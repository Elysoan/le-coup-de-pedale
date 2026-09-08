function unlockTrophy(id){
  if(UNLOCKED.has(id)) return;
  UNLOCKED.add(id);
  if(STATE && STATE.rider){
    UNLOCK_INFO[id] = {riderName: STATE.rider.name, season: STATE.rider.season, countryCode: STATE.rider.countryCode};
    const t = ACHIEVEMENTS.find(a=>a.id===id);
    STATE.rider.reputation = clamp(STATE.rider.reputation + (t && t.rare ? 3 : 1), 0, 100);
  }
  if(STATE){
    STATE.pendingTrophyUnlocks = STATE.pendingTrophyUnlocks || [];
    STATE.pendingTrophyUnlocks.push(id);
  }
}

function trophyBannerHTML(){
  if(!STATE || !STATE.pendingTrophyUnlocks || STATE.pendingTrophyUnlocks.length===0) return '';
  const html = STATE.pendingTrophyUnlocks.map(id=>{
    const t = ACHIEVEMENTS.find(a=>a.id===id);
    if(!t) return '';
    return `<div class="card trophy-shimmer" style="border:1.5px solid var(--yellow);">
      <p style="margin:0;"><strong>${t.rare?`🌟 ${tf('legendaryTrophyBanner','TROPHÉE LÉGENDAIRE')} — `:`🎉 ${tf('trophyUnlockedBanner','Trophée débloqué')} — `}${t.icon} ${t.name}</strong></p>
      <p class="small" style="margin:2px 0 0;">${t.desc}</p>
    </div>`;
  }).join('');
  STATE.pendingTrophyUnlocks = [];
  return html;
}

function checkRaceAchievements(race, bestTier){
  /* Les maillots à pois/CLM récompensent une étape isolée, indépendamment du
     classement général de la course — sortis du gate "bestTier===victoire" ci-dessous,
     sinon un coureur qui gagne une étape de montagne sans remporter le grand tour ne
     touche jamais ce trophée, contrairement à ce que sa description promet. */
  if(race.type==='grandtour'){
    STATE.runRaceAccum.forEach(e=>{
      if(e.tier!=='victoire') return;
      const ev = race.events.find(ev=>ev.title===e.title);
      if(!ev) return;
      if(ev.focus.includes('montagne')) unlockTrophy('maillot-pois');
      if(ev.focus.includes('clm')) unlockTrophy('maillot-clm');
    });
  }
  if(bestTier !== 'victoire') return;
  unlockTrophy('first-win');
  const winMap = {tdf:'maillot-jaune', giro:'corsa-rosa', vuelta:'la-vuelta', roubaix:'reine-pave',
    flandres:'roi-flandres', lbl:'doyenne', sanremo:'sanremo-win', lombardia:'feuilles-mortes', mondiaux:'arc-en-ciel'};
  if(winMap[race.id]) unlockTrophy(winMap[race.id]);

  const rider = STATE.rider;
  const gtWins = new Set(rider.palmares.filter(p=>p.type==='grandtour' && p.tier==='victoire').map(p=>p.raceName));
  if(gtWins.size>=3) unlockTrophy('triple-couronne');
  const monWins = new Set(rider.palmares.filter(p=>p.type==='monument' && p.tier==='victoire').map(p=>p.raceName));
  if(monWins.size>=5) unlockTrophy('grand-chelem-monuments');
  const totalWins = rider.palmares.filter(p=>p.tier==='victoire').length;
  if(totalWins>=10) unlockTrophy('multi-victorieux');

  if(STATE.runRaceAccum.every(e=>e.risk==='sur')) unlockTrophy('perfectionniste');
  if(STATE.runRaceAccum.some(e=>e.risk==='audacieux')) unlockTrophy('casse-cou');
}

function checkSeasonAchievements(results){
  if(results.length>=8 && results.every(r=>r.bestTier!=='abandon' && r.bestTier!=='forfait')){
    unlockTrophy('increvable');
  }
}

function checkCareerAchievements(rider){
  if(rider.season-1 >= 12) unlockTrophy('longevite');
  if(rider.reputation >= 95) unlockTrophy('legende');
  if((rider.teamChanges||0) === 0 && rider.season-1 >= 5) unlockTrophy('fidelite');
  if(rider.retireReason==='voluntary' && rider.reputation >= 86) unlockTrophy('retraite-doree');
  if(rider.retireReason==='injury') unlockTrophy('destin-brise');
  if(rider.money >= 1500000) unlockTrophy('fortune-peloton');
}

function checkSessionAchievements(rider){
  SESSION.careersCompleted++;
  SESSION.stylesPlayed.add(rider.styleId);
  SESSION.countriesPlayed.add(rider.countryCode);
  if(SESSION.careersCompleted>=1) unlockTrophy('premiers-pas');
  if(SESSION.careersCompleted>=5) unlockTrophy('veteran-du-jeu');
  if(SESSION.countriesPlayed.size>=5) unlockTrophy('explorateur');
  if(SESSION.stylesPlayed.size>=STYLES.length) unlockTrophy('polyvalent-joueur');
}
