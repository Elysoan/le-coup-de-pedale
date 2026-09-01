/* API du classement mondial du Coup de Pédale — Cloudflare Worker + D1.
   Deux routes : POST /submit (enregistre un score) et GET /leaderboard (top N).
   Aucune authentification : la protection repose sur une validation de plausibilité
   des valeurs reçues et un rate-limit par IP, pas sur CORS (CORS ne protège que les
   requêtes venant d'un navigateur, pas un script qui appelle l'API directement). */

const ALLOWED_STYLES = ['grimpeur', 'sprinteur', 'rouleur', 'puncheur', 'polyvalent'];
const MAX_NAME_LEN = 40;
const RATE_LIMIT_SECONDS = 60;

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders() },
  });
}

function isPlausible(body) {
  if (typeof body.riderName !== 'string' || body.riderName.trim().length === 0) return false;
  if (!ALLOWED_STYLES.includes(body.styleId)) return false;
  if (typeof body.countryCode !== 'string' || body.countryCode.length !== 2) return false;
  const nums = [body.wins, body.podiums, body.stageWins, body.finalReputation, body.seasons, body.score];
  if (nums.some(n => typeof n !== 'number' || !Number.isFinite(n) || n < 0)) return false;
  if (body.wins > 300 || body.podiums > 400 || body.stageWins > 300) return false;
  if (body.finalReputation > 100) return false;
  if (body.seasons > 25) return false;
  if (body.bestRank !== undefined && body.bestRank !== null) {
    if (typeof body.bestRank !== 'number' || body.bestRank < 1) return false;
  }
  return true;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders() });
    }

    if (url.pathname === '/leaderboard' && request.method === 'GET') {
      const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') || '50', 10) || 50));
      const styleParam = url.searchParams.get('style');
      const style = ALLOWED_STYLES.includes(styleParam) ? styleParam : null;
      const countryParam = url.searchParams.get('country');
      const country = (typeof countryParam === 'string' && /^[A-Za-z]{2}$/.test(countryParam))
        ? countryParam.toUpperCase() : null;

      // Filtres combinables : style et pays peuvent s'appliquer ensemble (ex. grimpeurs français).
      const conditions = [];
      const params = [];
      if (style) { conditions.push('style_id = ?'); params.push(style); }
      if (country) { conditions.push('country_code = ?'); params.push(country); }
      const whereClause = conditions.length ? ` WHERE ${conditions.join(' AND ')}` : '';
      params.push(limit);

      const { results } = await env.DB.prepare(
        `SELECT rider_name, style_id, country_code, wins, podiums, stage_wins,
                final_reputation, seasons, best_rank, score, submitted_at
         FROM leaderboard${whereClause} ORDER BY score DESC LIMIT ?`
      ).bind(...params).all();
      return json({ entries: results });
    }

    if (url.pathname === '/submit' && request.method === 'POST') {
      let body;
      try {
        body = await request.json();
      } catch (e) {
        return json({ error: 'invalid_json' }, 400);
      }
      if (!isPlausible(body)) return json({ error: 'invalid_data' }, 400);

      const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
      const now = new Date();
      const rl = await env.DB.prepare('SELECT last_submit FROM rate_limit WHERE ip = ?').bind(ip).first();
      if (rl) {
        const elapsedSeconds = (now.getTime() - new Date(rl.last_submit).getTime()) / 1000;
        if (elapsedSeconds < RATE_LIMIT_SECONDS) {
          return json({ error: 'rate_limited' }, 429);
        }
      }

      await env.DB.prepare(
        `INSERT INTO leaderboard
           (rider_name, style_id, country_code, wins, podiums, stage_wins, final_reputation, seasons, best_rank, score)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        String(body.riderName).trim().slice(0, MAX_NAME_LEN),
        body.styleId,
        body.countryCode.toUpperCase(),
        Math.round(body.wins),
        Math.round(body.podiums),
        Math.round(body.stageWins || 0),
        Math.round(body.finalReputation),
        Math.round(body.seasons),
        body.bestRank ? Math.round(body.bestRank) : null,
        Math.round(body.score)
      ).run();

      await env.DB.prepare(
        `INSERT INTO rate_limit (ip, last_submit) VALUES (?, ?)
         ON CONFLICT(ip) DO UPDATE SET last_submit = excluded.last_submit`
      ).bind(ip, now.toISOString()).run();

      const scoreValue = Math.round(body.score);
      const rankRow = await env.DB.prepare(
        'SELECT COUNT(*) + 1 AS rank FROM leaderboard WHERE score > ?'
      ).bind(scoreValue).first();

      return json({ ok: true, rank: rankRow ? rankRow.rank : null });
    }

    return json({ error: 'not_found' }, 404);
  },
};
