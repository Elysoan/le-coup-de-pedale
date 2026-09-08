function renderMainMenu(){
  SUPPRESS_SAVE = false;
  CURRENT_SLOT = null;
  STATE = null;
  const slotCardHTML = (i)=>{
    const slot = SLOTS[i];
    if(slot && slot.state && slot.state.rider){
      const r = slot.state.rider;
      const country = COUNTRIES.find(c=>c.code===r.countryCode);
      const style = STYLES.find(s=>s.id===r.styleId);
      const label = r.retired ? tf('careerOver','Carrière terminée') : `${tf('season','Saison')} ${r.season} · ${r.age} ${tf('yo','ans')}`;
      return `<div class="race-item" style="align-items:center;cursor:pointer;" onclick="selectSlot(${i})">
        <div style="display:flex;gap:12px;align-items:center;">
          <div class="avatar">${country?country.flag:''}</div>
          <div>
            <strong>${r.name}</strong>
            <p class="small" style="margin:2px 0 0;">${style?style.name:''} · ${label}</p>
          </div>
        </div>
        <div style="display:flex;gap:8px;align-items:center;">
          <span style="color:var(--hero);font-weight:800;font-size:0.9rem;">${r.retired?tf('view','Voir'):tf('resume','▶️ Reprendre')}</span>
          <button class="footer-link" style="padding:10px;margin:-10px;" onclick="event.stopPropagation();confirmDeleteSlot(${i})" aria-label="${tf('deleteSlot','Supprimer cet emplacement')}" title="${tf('deleteSlot','Supprimer cet emplacement')}">🗑️</button>
        </div>
      </div>`;
    }
    return `<div class="race-item" style="align-items:center;cursor:pointer;" onclick="selectSlot(${i})">
      <div style="display:flex;gap:12px;align-items:center;">
        <div class="avatar" style="background:var(--surface-alt);"></div>
        <div><strong>${tf('slot','Emplacement')} ${i+1} — ${tf('empty','vide')}</strong><p class="small" style="margin:2px 0 0;">${tf('noCareer','Aucune carrière en cours.')}</p></div>
      </div>
      <span style="color:var(--hero);font-weight:800;font-size:0.9rem;">${tf('newCareer','🆕 Nouvelle carrière')}</span>
    </div>`;
  };
  const best = topCareers(1)[0];
  const hasAnyCareer = SLOTS.some(s=>s && s.state && s.state.rider);
  const hasProgress = SESSION.careersCompleted > 0 || UNLOCKED.size > 0 || SESSION.countriesPlayed.size > 0;
  const firstEmptySlot = [0,1,2].find(i=>!(SLOTS[i] && SLOTS[i].state && SLOTS[i].state.rider));
  const saveFailedHTML = SAVE_FAILED ? `<div class="card" style="border:1.5px solid var(--red);background:var(--red-light);">
    <p style="margin:0;"><strong>⚠️ ${tf('saveFailedTitle','Sauvegarde impossible')}</strong> ${tf('saveFailedDesc',"Ton navigateur a refusé la dernière sauvegarde (stockage plein ou bloqué) — ta progression la plus récente n'a peut-être pas été enregistrée.")}</p>
  </div>` : '';
  setHTML(`
    ${saveFailedHTML}
    <div class="screen-hero">
      <div style="display:flex;justify-content:flex-end;gap:8px;margin-bottom:14px;">
        <button style="background:${(SETTINGS.lang||'fr')==='fr'?'#fff':'rgba(255,255,255,0.22)'};color:${(SETTINGS.lang||'fr')==='fr'?'var(--hero)':'#fff'};border:none;border-radius:20px;padding:6px 14px;font-family:'Nunito',sans-serif;font-weight:800;font-size:0.82rem;cursor:pointer;" onclick="setLang('fr')">🇫🇷 FR</button>
        <button style="background:${SETTINGS.lang==='en'?'#fff':'rgba(255,255,255,0.22)'};color:${SETTINGS.lang==='en'?'var(--hero)':'#fff'};border:none;border-radius:20px;padding:6px 14px;font-family:'Nunito',sans-serif;font-weight:800;font-size:0.82rem;cursor:pointer;" onclick="setLang('en')">🇬🇧 EN</button>
      </div>
      <h1 style="text-align:center;">${tf('gameTitle','LE COUP DE PÉDALE')}</h1>
      <p style="text-align:center;">${tf('tagline',"Roule. Choisis. Deviens une légende.")}</p>
      <div style="display:flex;justify-content:center;gap:8px;flex-wrap:wrap;margin-top:14px;">
        <span style="background:rgba(255,255,255,0.18);border:1px solid rgba(255,255,255,0.4);border-radius:20px;padding:6px 14px;font-size:0.78rem;font-weight:700;color:#fff;">🏁 ${tf('pill55races','63 courses')}</span>
        <span style="background:rgba(255,255,255,0.18);border:1px solid rgba(255,255,255,0.4);border-radius:20px;padding:6px 14px;font-size:0.78rem;font-weight:700;color:#fff;">🚴 ${tf('pill5styles','5 profils de coureur')}</span>
        <span style="background:rgba(255,255,255,0.18);border:1px solid rgba(255,255,255,0.4);border-radius:20px;padding:6px 14px;font-size:0.78rem;font-weight:700;color:#fff;">🌍 ${tf('pill20countries','20 nationalités')}</span>
      </div>
    </div>
    ${firstEmptySlot !== undefined ? `<button class="btn" style="font-size:1.05rem;padding:14px;margin-bottom:20px;" onclick="selectSlot(${firstEmptySlot})">${tf('startCareerCTA','🚀 Débuter une carrière')}</button>` : ''}
    ${hasProgress ? `
    <h3>📊 ${tf('yourProgress','Ta progression')}</h3>
    <div class="grid3" style="margin-bottom:12px;">
      <div class="stat-tile"><span class="stat-tile-num" style="color:var(--green-dark);">${SESSION.careersCompleted}</span><span class="stat-tile-label">${tf(SESSION.careersCompleted>1?'careersDoneP':'careersDone','carrière'+(SESSION.careersCompleted>1?'s':'')+' terminée'+(SESSION.careersCompleted>1?'s':''))}</span></div>
      <div class="stat-tile"><span class="stat-tile-num" style="color:var(--yellow-dark);">${UNLOCKED.size}/${ACHIEVEMENTS.length}</span><span class="stat-tile-label">${tf('trophiesWord','trophées')}</span></div>
      <div class="stat-tile"><span class="stat-tile-num" style="color:var(--pink);">${SESSION.countriesPlayed.size}/${COUNTRIES.length}</span><span class="stat-tile-label">${tf('countriesTried','pays essayés')}</span></div>
    </div>
    ${best ? `<p class="small" style="margin:-4px 0 14px;text-align:center;">🏆 ${tf('bestCareer','Meilleure carrière')} : <strong>${best.name}</strong> — ${legacyTitleText(best.title)}</p>` : ''}
    ` : ''}
    ${SESSION.careersCompleted > 0 ? `<button class="btn ghost" onclick="renderChallenge()" style="border-color:var(--orange);color:var(--orange-dark);">🎯 ${tf('challengeMode','Mode défi')}</button>` : ''}
    <h3>💾 ${tf('yourSlots','Tes 3 emplacements de carrière')}</h3>
    ${[0,1,2].map(slotCardHTML).join('')}
    <h3 style="margin-top:14px;">🔎 ${tf('explore','Explorer')}</h3>
        <div class="grid2">
      <button class="btn ghost" onclick="renderHallOfFame()">${tf('hallOfFame','🏆 Palmarès des légendes')}</button>
      <button class="btn ghost" onclick="NAV_RETURN_TO='menu';renderTrophiesScreen()">${tf('trophies','🎖️ Trophées')} (${UNLOCKED.size}/${ACHIEVEMENTS.length})</button>
    </div>
    <button class="btn ghost" onclick="renderCareerComparator()">${tf('careerComparator','📊 Comparateur de carrières')}</button>
    <button class="btn ghost" onclick="ALMANAC_SCOPE='legend';renderRaceAlmanac()">📖 ${tf('raceAlmanacLegend','Almanach de légende (63 courses)')}</button>
    ${leaderboardConfigured() ? `<button class="btn ghost" onclick="renderGlobalLeaderboard()">${tf('globalLeaderboard','🌍 Classement mondial')}</button>` : ''}
    <div class="footer-links">
      <button class="footer-link" onclick="NAV_RETURN_TO='menu';renderTutorialScreen()">${tf('howToPlay','📖 Comment jouer ?')}</button>
      <button class="footer-link" onclick="NAV_RETURN_TO='menu';renderSettingsScreen()">${tf('accessibility','♿ Accessibilité')}</button>
    </div>
  `);
}
