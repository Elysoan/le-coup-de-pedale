function renderRoleChoice(race){
  if(STATE) STATE._screen='rolechoice';
  const jerseys = gtJerseys(race.id);
  const isYoung = STATE.rider.age <= 25;
  setHTML(`
    ${riderHeaderHTML()}
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <h2>${race.flag?race.flag+' ':''}${race.name}</h2>
        ${badgeHTML(race.type)}
      </div>
      <p class="small">🗓️ ${MONTHS[race.month]}</p>
      <hr class="divider" style="border:none;border-top:1px dashed var(--line);">
      <h3>🎽 ${tf('whatRole','Quel rôle sur cette course ?')}</h3>
      <p>${tf('roleChoiceDesc',"Jouer le classement général, viser une classification annexe, ou se mettre au service de l'équipe ?")}</p>
      <button class="btn" onclick="chooseRole('leader')">🎯 ${tf('playGC','Jouer le classement général (leader)')}</button>
      ${race.type==='grandtour' ? `
        <button class="btn ghost" onclick="chooseRole('grimpeur')">${jerseys.kom.icon} ${tf('aimFor','Viser le')} ${jerseys.kom.label} (${tf('bestClimber','meilleur grimpeur')})</button>
        <button class="btn ghost" onclick="chooseRole('sprinteur')">${jerseys.points.icon} ${tf('aimFor','Viser le')} ${jerseys.points.label} (${tf('bestSprinter','meilleur sprinteur')})</button>
        ${isYoung ? `<button class="btn ghost" onclick="chooseRole('jeune')">⚪ ${tf('aimForWhiteJersey','Viser le maillot blanc (meilleur jeune)')}</button>` : ''}
      ` : ''}
      <button class="btn ghost" onclick="chooseRole('equipier')">🤝 ${tf('rideForTeam',"Rouler pour l'équipe (équipier)")}</button>
    </div>
  `);
}

function chooseRole(role){
  const race = STATE.runQueue[STATE.runRaceIdx];
  STATE.raceRole = role;
  if(role === 'equipier'){
    resolveAsDomestique(race);
  } else {
    renderCurrentEvent();
  }
}

/* Rôle d'équipier : résultat garanti modeste (peloton), effort et fatigue réduits de
   moitié, mais forte hausse de confiance d'équipe en échange du renoncement à sa chance
   personnelle sur cette course. */
function resolveAsDomestique(race){
  const rider = STATE.rider;
  const reduc = 1 - (rider.stats.recuperation/280);
  const daysSoFar = STATE.cumulativeDaysRaced || 0;
  /* Mêmes coefficients que applyFatigue (overload 0.025, intensité 0.45) — un rôle
     d'équipier n'est pas exempté de la surcharge calendaire ni du poids des longues courses. */
  const overloadWear = daysSoFar > 45 ? 1 + (daysSoFar-45)*0.025 : 1;
  const intensity = 1 + Math.min(race.days, 21)/21 * 0.45;
  const prestigeFactor = 1 + (race.prestige - 1) * 0.12;
  const _wmDom = (STATE && STATE.seasonWorldMods) || {};
  let worldFatMult = 1;
  if(_wmDom.globalFatigueReduction) worldFatMult *= _wmDom.globalFatigueReduction;
  if(_wmDom.globalFatigueBoost) worldFatMult *= _wmDom.globalFatigueBoost;
  if(_wmDom.julyFatigue && race.month === 7) worldFatMult *= _wmDom.julyFatigue;
  if(_wmDom.springFatigue && race.month >= 3 && race.month <= 4 && (race.type === 'monument' || race.type === 'classique')) worldFatMult *= _wmDom.springFatigue;
  const cost = race.fatCost * reduc * overloadWear * intensity * prestigeFactor * worldFatMult * RISK_FATIGUE_MULT.sur * 0.5;
  rider.fatigue = clamp(rider.fatigue + cost, 0, 100);
  STATE.runRaceAccum = [{title:tf('domestiqueRoleTitle',"Rôle d'équipier"), choiceLabel:tf('domestiqueRoleDesc',"Rouler entièrement pour le leader désigné, sans jouer sa propre carte"),
    risk:'sur', tier:'peloton', perf:50, trained:null}];
  STATE.domestiqueBonus = true;
  finalizeRace();
}
