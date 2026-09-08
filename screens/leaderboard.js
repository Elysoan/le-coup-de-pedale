async function submitToLeaderboard(entry){
  if(!leaderboardConfigured()) return {ok:false};
  LAST_LEADERBOARD_ERROR = null;
  try{
    const res = await fetch(LEADERBOARD_API_URL + '/submit', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        riderName: entry.name,
        styleId: entry.styleId,
        countryCode: entry.countryCode,
        wins: entry.wins,
        podiums: entry.podiums,
        stageWins: entry.stageWins || 0,
        finalReputation: entry.finalReputation,
        seasons: entry.seasons,
        bestRank: entry.bestRank,
        score: careerScore(entry),
      }),
    });
    if(!res.ok){ LAST_LEADERBOARD_ERROR = 'server'; return {ok:false}; }
    const data = await res.json();
    return {ok:true, rank: data.rank || null};
  } catch(e){ LAST_LEADERBOARD_ERROR = 'offline'; return {ok:false}; }
}
async function fetchLeaderboard(styleId, countryCode){
  if(!leaderboardConfigured()) return null;
  LAST_LEADERBOARD_ERROR = null;
  try{
    const styleQuery = (styleId && styleId!=='all') ? `&style=${encodeURIComponent(styleId)}` : '';
    const countryQuery = (countryCode && countryCode!=='all') ? `&country=${encodeURIComponent(countryCode)}` : '';
    const res = await fetch(LEADERBOARD_API_URL + '/leaderboard?limit=50' + styleQuery + countryQuery);
    if(!res.ok){ LAST_LEADERBOARD_ERROR = 'server'; return null; }
    const data = await res.json();
    return Array.isArray(data.entries) ? data.entries : [];
  } catch(e){ LAST_LEADERBOARD_ERROR = 'offline'; return null; }
}
async function publishToLeaderboard(){
  if(!STATE || !STATE.rider || CAREER_HISTORY.length===0) return;
  const entry = CAREER_HISTORY[CAREER_HISTORY.length-1];
  STATE.leaderboardStatus = 'sending';
  renderCareerEnd();
  const result = await submitToLeaderboard(entry);
  if(!STATE) return; // écran quitté entretemps
  STATE.leaderboardStatus = result.ok ? 'ok' : 'error';
  STATE.leaderboardErrorReason = result.ok ? null : LAST_LEADERBOARD_ERROR;
  STATE.leaderboardRank = result.ok ? result.rank : null;
  renderCareerEnd();
}
function leaderboardCardHTML(){
  if(!leaderboardConfigured()) return '';
  const status = STATE.leaderboardStatus || 'idle';
  if(status==='ok'){
    const rank = STATE.leaderboardRank;
    return `<div class="card center">
      <p>🌍 ${tf('leaderboardPublished','Score publié au classement mondial !')}</p>
      ${rank ? `<p class="small" style="font-weight:800;">${tf('leaderboardRankPrefix','Ton rang mondial :')} #${rank}${rank>50?` <span style="font-weight:400;">(${tf('leaderboardOutsideTop50','hors du top 50 affiché')})</span>`:''}</p>` : ''}
      <button class="btn ghost" onclick="renderGlobalLeaderboard()">${tf('viewLeaderboard','Voir le classement')}</button>
    </div>`;
  }
  return `<div class="card center">
    <h3>🌍 ${tf('leaderboardTitle','Classement mondial')}</h3>
    <p class="small">${tf('leaderboardDesc',"Publie le score de ce coureur (nom, style, pays, palmarès) au classement public de tous les joueurs.")}</p>
    ${status==='error' ? `<p class="small" style="color:var(--red);">${STATE.leaderboardErrorReason==='offline' ? tf('leaderboardErrorOffline',"Échec de l'envoi — vérifie ta connexion internet.") : tf('leaderboardErrorServer',"Échec de l'envoi — le service est indisponible pour le moment, réessaie plus tard.")}</p>` : ''}
    <button class="btn" ${status==='sending'?'disabled':''} onclick="publishToLeaderboard()">${status==='sending'?tf('sending','Envoi…'):tf('leaderboardPublish','📤 Publier au classement')}</button>
  </div>`;
}
function renderGlobalLeaderboard(){
  if(STATE) STATE._screen = 'globalleaderboard';
  const lang = SETTINGS.lang === 'en';
  const styleChoices = [{id:'all', icon:'🌍', label:tf('allStyles','Tous les styles')}]
    .concat(STYLES.map(s=>({id:s.id, icon:s.icon, label:(lang&&s.nameEN)?s.nameEN:s.name})));
  /* Tri alphabétique sur le nom affiché (pas l'ordre d'insertion de COUNTRIES, qui ne suit
     aucun ordre lisible) — nécessaire pour retrouver rapidement un pays dans une liste de 20,
     contrairement au style (5 options, l'ordre existant reste lisible tel quel). */
  const countriesSorted = COUNTRIES.slice().sort((a,b)=>a.name.localeCompare(b.name, lang?'en':'fr'));
  const countryChoices = [{code:'all', flag:'🌍', label:tf('allCountries','Tous les pays')}]
    .concat(countriesSorted.map(c=>({code:c.code, flag:c.flag, label:c.name})));
  const currentStyle = styleChoices.find(s=>s.id===LEADERBOARD_STYLE_FILTER) || styleChoices[0];
  const currentCountry = countryChoices.find(c=>(c.code||'all')===LEADERBOARD_COUNTRY_FILTER) || countryChoices[0];
  const hasActiveFilter = LEADERBOARD_STYLE_FILTER!=='all' || LEADERBOARD_COUNTRY_FILTER!=='all';
  const filterToggleBtn = (label, icon, open, onclick) => `<button class="btn ghost" style="flex:1;min-width:0;display:flex;justify-content:space-between;align-items:center;gap:4px;font-size:0.82rem;padding:10px 10px;" onclick="${onclick}"><span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${icon} ${label}</span><span>${open?'▲':'▼'}</span></button>`;
  const stylePanel = LEADERBOARD_STYLE_PANEL_OPEN ? `<div style="max-height:280px;overflow-y:auto;margin-top:6px;">${styleChoices.map(s=>
    `<div class="row-item ${LEADERBOARD_STYLE_FILTER===s.id?'active':''}" onclick="setLeaderboardStyleFilter('${s.id}')"><span>${s.icon} ${s.label}</span></div>`
  ).join('')}</div>` : '';
  const countryPanel = LEADERBOARD_COUNTRY_PANEL_OPEN ? `<div style="max-height:280px;overflow-y:auto;margin-top:6px;">${countryChoices.map(c=>
    `<div class="row-item ${LEADERBOARD_COUNTRY_FILTER===(c.code||'all')?'active':''}" onclick="setLeaderboardCountryFilter('${c.code||'all'}')"><span>${c.flag} ${c.label}</span></div>`
  ).join('')}</div>` : '';
  setHTML(`
    ${heroHTML('🌍 '+tf('globalLeaderboard','Classement mondial'), tf('globalLeaderboardDesc',"Les meilleures carrières publiées par tous les joueurs du Coup de Pédale."))}
    ${STATE && STATE.leaderboardRank ? `<p class="small center" style="margin:-6px 0 8px;">${tf('leaderboardYourLastRank','Ton dernier score publié')} : <strong>#${STATE.leaderboardRank}</strong></p>` : ''}
    <div class="card" style="padding:10px;">
      <div class="chip-row" style="margin-top:0;">
        ${filterToggleBtn(currentStyle.label, currentStyle.icon, LEADERBOARD_STYLE_PANEL_OPEN, 'toggleLeaderboardStylePanel()')}
        ${filterToggleBtn(currentCountry.label, currentCountry.flag, LEADERBOARD_COUNTRY_PANEL_OPEN, 'toggleLeaderboardCountryPanel()')}
      </div>
      ${stylePanel}
      ${countryPanel}
      ${hasActiveFilter ? `<button class="btn ghost" style="margin-top:8px;font-size:0.82rem;padding:8px 4px;" onclick="resetLeaderboardFilters()">✕ ${tf('resetFilters','Réinitialiser les filtres')}</button>` : ''}
    </div>
    <div class="card center" id="leaderboard-loading"><p>${tf('loading','Chargement…')}</p></div>
    <div id="leaderboard-rows"></div>
    <button class="btn ghost" onclick="${STATE&&STATE.rider?'renderCareerEnd()':'renderMainMenu()'}">${tf('back','← Retour')}</button>
  `, true);
  loadGlobalLeaderboard();
}
function toggleLeaderboardStylePanel(){
  LEADERBOARD_STYLE_PANEL_OPEN = !LEADERBOARD_STYLE_PANEL_OPEN;
  LEADERBOARD_COUNTRY_PANEL_OPEN = false;
  renderGlobalLeaderboard();
}
function toggleLeaderboardCountryPanel(){
  LEADERBOARD_COUNTRY_PANEL_OPEN = !LEADERBOARD_COUNTRY_PANEL_OPEN;
  LEADERBOARD_STYLE_PANEL_OPEN = false;
  renderGlobalLeaderboard();
}
function resetLeaderboardFilters(){
  LEADERBOARD_STYLE_FILTER = 'all';
  LEADERBOARD_COUNTRY_FILTER = 'all';
  LEADERBOARD_STYLE_PANEL_OPEN = false;
  LEADERBOARD_COUNTRY_PANEL_OPEN = false;
  renderGlobalLeaderboard();
}
function setLeaderboardStyleFilter(styleId){
  LEADERBOARD_STYLE_FILTER = styleId;
  LEADERBOARD_STYLE_PANEL_OPEN = false;
  renderGlobalLeaderboard();
}
function setLeaderboardCountryFilter(countryCode){
  LEADERBOARD_COUNTRY_FILTER = countryCode;
  LEADERBOARD_COUNTRY_PANEL_OPEN = false;
  renderGlobalLeaderboard();
}
async function loadGlobalLeaderboard(){
  const entries = await fetchLeaderboard(LEADERBOARD_STYLE_FILTER, LEADERBOARD_COUNTRY_FILTER);
  const loadingEl = document.getElementById('leaderboard-loading');
  const rowsEl = document.getElementById('leaderboard-rows');
  if(!loadingEl || !rowsEl) return; // écran quitté entretemps
  if(entries === null){
    loadingEl.innerHTML = `<p>${LAST_LEADERBOARD_ERROR==='offline' ? tf('leaderboardUnavailableOffline','Impossible de contacter le classement — vérifie ta connexion internet.') : tf('leaderboardUnavailable',"Classement indisponible pour le moment.")}</p>`;
    return;
  }
  loadingEl.remove();
  if(entries.length === 0){
    const hasFilter = LEADERBOARD_STYLE_FILTER!=='all' || LEADERBOARD_COUNTRY_FILTER!=='all';
    rowsEl.innerHTML = `<p class="small center" style="padding:8px;">${hasFilter ? tf('leaderboardEmptyFiltered','Aucun score publié pour ce filtre pour le moment.') : tf('leaderboardEmpty','Aucun score publié pour le moment — sois le premier !')}</p>`;
    return;
  }
  rowsEl.innerHTML = `<div class="card">${entries.map((e,i)=>{
    const country = COUNTRIES.find(c=>c.code===e.country_code);
    const style = STYLES.find(s=>s.id===e.style_id);
    return `<div class="race-item" style="cursor:default;">
      <div><strong>#${i+1} ${country?country.flag:''} ${escapeHtml(e.rider_name)}</strong><p class="small" style="margin:2px 0 0;">${style?style.name:''} · ${e.wins}🏆 · ${e.seasons} ${tf('seasonsBareLower','saisons')}</p></div>
      <span class="pill mono">${e.score} pts</span>
    </div>`;
  }).join('')}</div>`;
}
