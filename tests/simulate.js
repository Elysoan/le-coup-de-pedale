/* Bot testeur : joue un grand nombre de carrières en cliquant aléatoirement sur tout
   élément cliquable non bloqué, et vérifie des invariants de base (pas de NaN/undefined/
   [object Object] affiché, stats dans leurs bornes). Sert de filet anti-régression
   « comportemental », en complément du lint statique de lint-source.js.

   Usage : node simulate.js [nombre de carrières]  (défaut 40, PR/push) — le workflow
   planifié passe un nombre plus élevé pour un run plus approfondi. */
const { chromium } = require('playwright');
const http = require('http');
const path = require('path');
const fs = require('fs');

const NUM_CAREERS = Number(process.argv[2] || 40);
const REPO_ROOT = path.join(__dirname, '..');

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json',
  '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon' };

function startServer(){
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const reqPath = decodeURIComponent(req.url.split('?')[0]);
      const filePath = path.join(REPO_ROOT, reqPath === '/' ? '/index.html' : reqPath);
      if (!filePath.startsWith(REPO_ROOT)) { res.writeHead(403); res.end(); return; }
      fs.readFile(filePath, (err, data) => {
        if (err) { res.writeHead(404); res.end('Not found'); return; }
        res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream' });
        res.end(data);
      });
    });
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => resolve(server));
  });
}

(async () => {
  const server = await startServer();
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}/index.html`;

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 400, height: 850 } });
  // Seules les vraies exceptions JS non interceptées comptent comme échec : les erreurs
  // console liées au chargement de ressources tierces (Google Fonts, Tag Manager) dépendent
  // de la politique réseau de l'environnement d'exécution (sandbox, runner CI...), pas de la
  // correction du jeu — le jeu lui-même n'appelle jamais console.error().
  const pageErrors = [];
  page.on('pageerror', e => pageErrors.push(String(e && e.stack || e)));
  page.on('dialog', d => { pageErrors.push('UNEXPECTED NATIVE DIALOG: ' + d.message()); d.dismiss(); });

  await page.goto(baseUrl, { waitUntil: 'load' });
  await page.waitForTimeout(3000); // laisser l'écran de démarrage se stabiliser

  const result = await page.evaluate(async (numCareers) => {
    const BLOCKED = ['renderMainMenu','renderRaceAlmanac','renderTutorialScreen','renderSettingsScreen',
      'renderHallOfFame','renderTrophiesScreen','renderCareerComparator','renderChallenge',
      'renderSeasonHistory','openShareCard','renderCareerJournal','downloadShareCard','nativeShareCard',
      'setLang','setFontSize','toggleHighContrast','toggleReduceMotion','confirmDeleteSlot','resetGame',
      'toggleCalMonth','toggleHelp'];

    const COUNTRY_CODES = (typeof COUNTRIES !== 'undefined') ? COUNTRIES.map(c=>c.code) : ['FR'];

    function screenKey(){
      if (STATE && STATE.rider) return (STATE._screen||'?') + ':' + STATE.rider.season;
      if (window._creation) return 'creation:' + (window._creation.style||'nostyle');
      return 'menu';
    }

    function candidates(){
      const els = Array.from(document.querySelectorAll('#app [onclick]:not([disabled])'));
      return els.filter(el => {
        const attr = el.getAttribute('onclick') || '';
        return !BLOCKED.some(fn => attr.indexOf(fn+'(') === 0);
      });
    }

    function checkInvariants(careerIdx, violations){
      const html = document.getElementById('app').innerHTML;
      if (/\bNaN\b/.test(html)) violations.push({career: careerIdx, screen: screenKey(), issue: 'NaN in rendered HTML'});
      if (html.indexOf('undefined') !== -1) violations.push({career: careerIdx, screen: screenKey(), issue: 'literal "undefined" in rendered HTML'});
      if (html.indexOf('[object Object]') !== -1) violations.push({career: careerIdx, screen: screenKey(), issue: '[object Object] in rendered HTML'});
      if (STATE && STATE.rider){
        const r = STATE.rider;
        if (!(r.fatigue >= 0 && r.fatigue <= 200)) violations.push({career: careerIdx, screen: screenKey(), issue: 'fatigue out of range: '+r.fatigue});
        if (!(r.reputation >= 0 && r.reputation <= 100)) violations.push({career: careerIdx, screen: screenKey(), issue: 'reputation out of range: '+r.reputation});
        if (!(r.teamConfidence >= 0 && r.teamConfidence <= 100)) violations.push({career: careerIdx, screen: screenKey(), issue: 'teamConfidence out of range: '+r.teamConfidence});
        if (!(r.money >= 0) || isNaN(r.money)) violations.push({career: careerIdx, screen: screenKey(), issue: 'negative/NaN money: '+r.money});
        if (!(r.age >= 15 && r.age <= 60)) violations.push({career: careerIdx, screen: screenKey(), issue: 'age out of range: '+r.age});
        if (r.stats) {
          Object.keys(r.stats).forEach(k => {
            const v = r.stats[k];
            if (!(v >= 0 && v <= 100)) violations.push({career: careerIdx, screen: screenKey(), issue: 'stat '+k+' out of range: '+v});
          });
        }
        if (!(r.worldRank >= 1)) violations.push({career: careerIdx, screen: screenKey(), issue: 'worldRank invalid: '+r.worldRank});
      }
    }

    const careers = [];
    const violations = [];
    const errors = [];
    let totalSteps = 0;
    const MAX_TOTAL_STEPS = 400000;
    const MAX_STEPS_PER_CAREER = 2500;
    const STUCK_LIMIT = 100;

    resetGame();

    for (let c = 0; c < numCareers && totalSteps < MAX_TOTAL_STEPS; c++){
      // Randomise la nationalité tout de suite, avant le choix du style.
      try {
        const code = COUNTRY_CODES[Math.floor(Math.random()*COUNTRY_CODES.length)];
        if (typeof updateCountry === 'function') updateCountry(code);
      } catch(e){ errors.push({career:c, phase:'updateCountry', message:String(e && e.message || e)}); }

      let steps = 0;
      let lastKey = null;
      let stuckCount = 0;
      let crashed = null;
      let stuck = null;

      while (steps < MAX_STEPS_PER_CAREER && totalSteps < MAX_TOTAL_STEPS){
        if (STATE && STATE.rider && STATE.rider.retired) break;

        const key = screenKey();
        if (key === lastKey) stuckCount++; else { stuckCount = 0; lastKey = key; }
        if (stuckCount >= STUCK_LIMIT){ stuck = key; break; }

        checkInvariants(c, violations);

        const cand = candidates();
        if (cand.length === 0){
          stuck = key + ' (no candidates)';
          break;
        }
        const primary = cand.filter(el => el.tagName === 'BUTTON' && el.classList.contains('btn') && !el.classList.contains('ghost'));
        const pool = (primary.length > 0 && Math.random() < 0.6) ? primary : cand;
        const el = pool[Math.floor(Math.random()*pool.length)];
        const attr = el.getAttribute('onclick') || '';
        try {
          (0, eval)(attr);
        } catch(e){
          crashed = {onclick: attr, message: String(e && e.message || e), stack: String(e && e.stack || ''), screen: key};
          break;
        }
        steps++;
        totalSteps++;
      }

      checkInvariants(c, violations);

      const summary = { index: c, steps, crashed, stuck };
      if (STATE && STATE.rider){
        const r = STATE.rider;
        summary.style = r.styleId;
        summary.country = r.countryCode;
        summary.seasons = r.season;
        summary.age = r.age;
        summary.retired = !!r.retired;
        summary.retireReason = r.retireReason || null;
        summary.wins = (r.palmares||[]).filter(p=>p.tier==='victoire').length;
        summary.podiums = (r.palmares||[]).filter(p=>p.tier==='podium').length;
        summary.finalReputation = r.reputation;
        summary.finalMoney = Math.round(r.money);
        summary.worldRank = r.worldRank;
      } else {
        summary.incomplete = true;
      }
      careers.push(summary);

      try { resetGame(); } catch(e){ errors.push({career:c, phase:'resetGame', message:String(e && e.message || e)}); }
    }

    return { careers, violations, errors, totalSteps, unlockedTrophies: (typeof UNLOCKED !== 'undefined') ? UNLOCKED.size : null };
  }, NUM_CAREERS);

  console.log('careers:', result.careers.length, 'totalSteps:', result.totalSteps);
  console.log('violations:', result.violations.length);
  console.log('errors:', result.errors.length);
  console.log('pageErrors:', pageErrors.length);
  const crashedCareers = result.careers.filter(c=>c.crashed);
  const stuckCareers = result.careers.filter(c=>c.stuck);
  console.log('crashed careers:', crashedCareers.length, 'stuck careers:', stuckCareers.length);

  const failed = result.violations.length > 0 || result.errors.length > 0 || pageErrors.length > 0
    || crashedCareers.length > 0 || stuckCareers.length > 0;

  if (failed) {
    console.error('\nDétails (premiers éléments) :');
    if (result.violations.length) console.error('violations:', JSON.stringify(result.violations.slice(0, 10), null, 2));
    if (result.errors.length) console.error('errors:', JSON.stringify(result.errors.slice(0, 10), null, 2));
    if (pageErrors.length) console.error('pageErrors:', JSON.stringify(pageErrors.slice(0, 10), null, 2));
    if (crashedCareers.length) console.error('crashedCareers:', JSON.stringify(crashedCareers.slice(0, 5), null, 2));
    if (stuckCareers.length) console.error('stuckCareers:', JSON.stringify(stuckCareers.slice(0, 5), null, 2));
  }

  await browser.close();
  server.close();

  if (failed) {
    console.error('\nSimulation échouée.');
    process.exit(1);
  } else {
    console.log('\nSimulation OK.');
  }
})();
