function renderCurrentEvent(){
  if(STATE) STATE._screen='currentevent';
  if(STATE.runRaceIdx >= STATE.runQueue.length){ finishSeason(); return; }
  const race = STATE.runQueue[STATE.runRaceIdx];
  const event = race.events[STATE.runEventIdx];
  if(!event._wackyRolled){
    event._wackyRolled = true;
    if(Math.random() < 0.2){
      const label = WACKY_CHOICE_LABELS[Math.floor(Math.random()*WACKY_CHOICE_LABELS.length)];
      event.choices = event.choices.concat([{label, risk:'loufoque', tilt:[]}]);
    }
  }
  if(!event._weather){
    event._weather = rollWeather(race.month, race.flag==='🇦🇺').id;
  }
  const weather = WEATHER_TYPES.find(w=>w.id===event._weather);
  const form = riderFormStatus(STATE.rider);
  const isHomeRace = race.flag && race.flag === COUNTRIES.find(c=>c.code===STATE.rider.countryCode)?.flag;
  const isSignatureRace = STATE.rider.signatureRaceId && STATE.rider.signatureRaceId === race.id;
  const riskIcon = {sur:'🛡️', equilibre:'⚖️', audacieux:'🎲', loufoque:'🤪'};
  /* Indicateur stat↔phase : montre au joueur si ses stats sont adaptées à cet event */
  const _statAvgForEvent = statFocusAverage(STATE.rider, event.focus);
  const _statIndicator = (() => {
    const lang = SETTINGS.lang === 'en';
    const v = Math.round(_statAvgForEvent);
    if(_statAvgForEvent >= 70) return {icon:'💪', color:'var(--green-dark)', label: lang ? `Terrain that suits you (${v})` : `Terrain favorable (${v})`};
    if(_statAvgForEvent >= 50) return {icon:'⚡', color:'var(--text-soft)', label: lang ? `You can hold your own here (${v})` : `Tu peux t'y accrocher (${v})`};
    return {icon:'😬', color:'var(--red)', label: lang ? `This phase doesn't play to your strengths (${v})` : `Cette phase ne joue pas en ta faveur (${v})`};
  })();
  const statMatchHTML = `<p class="small" style="color:${_statIndicator.color};margin:2px 0 0;">${_statIndicator.icon} ${_statIndicator.label}</p>`;
  /* Mini-résultat de la phase précédente sur courses multi-étapes */
  const _lpr = STATE._lastPhaseResult;
  STATE._lastPhaseResult = null;
  const _tierColor = {victoire:'var(--green-dark)', podium:'var(--green-dark)', top10:'var(--blue)', peloton:'var(--text-soft)', jourssans:'var(--red)', abandon:'var(--red)'};
  const _tierIcon  = {victoire:'🏆', podium:'🥈', top10:'👍', peloton:'🚴', jourssans:'😓', abandon:'❌'};
  const _lang = SETTINGS.lang === 'en';
  const lastPhaseHTML = _lpr ? `<div style="background:${_lpr.tier==='victoire'||_lpr.tier==='podium'?'var(--green-light)':_lpr.tier==='abandon'||_lpr.tier==='jourssans'?'var(--red-light)':'var(--surface-alt)'};border:2px solid ${_tierColor[_lpr.tier]||'var(--line)'};border-radius:10px;padding:8px 12px;margin-bottom:8px;display:flex;align-items:center;gap:10px;">
    <span style="font-size:1.4em;line-height:1;">${_tierIcon[_lpr.tier]||'📋'}</span>
    <div>
      <p class="small" style="margin:0;font-weight:700;color:${_tierColor[_lpr.tier]||'var(--text)'};">${tierNarrative(_lpr.tier)}</p>
      <p class="small" style="margin:0;color:var(--text-soft);">${_lang?'Result of the previous phase':'Résultat de la phase précédente'}</p>
    </div>
  </div>` : '';
  setHTML(`
    ${riderHeaderHTML()}
    ${lastPhaseHTML}
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <h2>${race.flag?race.flag+' ':''}${race.name}</h2>
        ${badgeHTML(race.type)}
      </div>
      <p class="small">🗓️ ${MONTHS[race.month]}${(() => {
        if(race.type==='grandtour'){
          if(event._isBonus) return ` · ${tf('racePhase','Phase de course')}`;
          const weekNum = race.events.slice(0, STATE.runEventIdx+1).filter(e=>!e._isBonus).length;
          const weekTotal = race.sampleWeeks || (race._baseEventCount||race.events.length);
          return ` · ${tf('weekCounter','Semaine')} ${weekNum}/${weekTotal}`;
        }
        // Pour les courses multi-jours (semitours) : afficher le jour
        // On répartit les events sur les jours réels de la course (race.days)
        const totalDays = race.days || 1;
        if(totalDays > 1){
          const totalEvents = race.events.length;
          // Position actuelle dans les events (0-indexé)
          const evIdx = STATE.runEventIdx;
          // Jour estimé : répartition linéaire des events sur les jours
          const dayNum = Math.max(1, Math.round((evIdx + 0.5) / totalEvents * totalDays));
          return ` · ${tf('dayCounter','Jour')} ${dayNum}/${totalDays}`;
        }
        return '';
      })()} · ${tf('raceCounter','Course')} ${STATE.runRaceIdx+1} ${tf('ofSeason','de la saison')}</p>
      <p class="small">${weather.icon} ${weather.label} · ${form.icon} ${form.label}</p>
      ${isHomeRace ? `<p class="small" style="color:var(--green-dark);font-weight:700;">📣 ${tf('homeCrowdNote','Le public te porte — tu cours à domicile !')}</p>` : ''}
      ${isSignatureRace ? `<p class="small" style="color:var(--pink);font-weight:700;">❤️ ${tf('signatureRaceNote','Ta course de cœur — celle que tu attends toute la saison !')}</p>` : ''}
      ${event._isRivalEvent ? `<p class="small" style="color:var(--blue);font-weight:700;">🥊 ${tf('rivalPresentNote','Duel en cours !')}</p>` : ''}
      ${statMatchHTML}
      <hr class="divider" style="border:none;border-top:1px dashed var(--line);">
      <h3>${event.title}</h3>
      <p class="narrative-text" style="margin:4px 0 10px;">${event.desc}</p>
      ${tipBox('risk-levels', "Chaque choix a un niveau de risque : les options prudentes sont plus régulières mais rapportent moins, les audacieuses peuvent rapporter gros ou se retourner contre toi. Surveille aussi l'avertissement ⚠️ de risque de chute.", tf('tipRiskLevels'))}
      ${event.choices.map((c,i)=>{
        const crashPct = Math.round(crashChanceFor(STATE.rider, race, c, event._weather)*100);
        const crashTag = crashPct>=6 ? ` · ⚠️ ${crashPct}% ${tf('crashRiskWord','chute')}` : '';
        return `<button class="btn ${c.risk}" onclick="chooseOption(${i})">${riskIcon[c.risk]} ${c.label} <span class="mono" style="font-size:0.7rem;opacity:0.8;">(${RISK_LABEL[c.risk]}${crashTag})</span></button>`;
      }).join('')}
    </div>
  `, true);
}

function chooseOption(i){
  const race = STATE.runQueue[STATE.runRaceIdx];
  const event = race.events[STATE.runEventIdx];
  const choice = event.choices[i];
  const weatherId = event._weather;

  if(Math.random() < crashChanceFor(STATE.rider, race, choice, weatherId)){
    handleInjury('chute', race, {
      title:event.title, choiceLabel:choice.label+' — chute en course',
      risk:choice.risk, tier:'abandon', perf:0, trained:null
    });
    return;
  }

  const isHomeRace = race.flag && race.flag === COUNTRIES.find(c=>c.code===STATE.rider.countryCode)?.flag;
  const isSignatureRace = STATE.rider.signatureRaceId && STATE.rider.signatureRaceId === race.id;
  const result = resolveEvent(STATE.rider, event, choice, weatherId, race.prestige, race.type==='grandtour', isHomeRace, isSignatureRace, race.type);
  applyFatigue(STATE.rider, race, choice, weatherId);
  STATE.runRaceAccum.push({title:event.title, choiceLabel:choice.label, risk:choice.risk, tier:result.tier, perf:result.perf, trained:result.trained, detrained:result.detrained, isRivalEvent:!!event._isRivalEvent, rivalName:event._rivalName||null, isBonus:!!event._isBonus, focus:event.focus||null});
  STATE.runEventIdx++;
  /* Sur une course à plusieurs semaines (grand tour), abandonner une semaine met fin à
     toute la course : impossible de repartir la semaine suivante, comme dans la réalité. */
  const doFinalize = (result.tier==='abandon' || STATE.runEventIdx >= race.events.length);

  /* Feedback narratif immédiat après un event rival */
  if(event._isRivalEvent){
    /* Le rival crédité du duel doit être celui réellement nommé dans l'event (event._rivalName),
       pas un tirage indépendant — sinon avec plusieurs rivaux présents dans la même course, le
       nom affiché dans le récit pourrait ne pas correspondre au rival dont la force détermine
       le seuil de victoire, ni à celui crédité plus tard dans checkRivalAppearance(). */
    const presentRivals = (STATE.rivals||[]).filter(rv=>(rv.raceIds||[]).includes(race.id));
    const rival = presentRivals.find(rv=>rv.name===event._rivalName) || presentRivals[0] || {name:'ton rival', strength:50};
    const isGood = result.perf >= rivalDuelThreshold(rival.strength);
    STATE._pendingRivalDuelFeedback = {
      good: isGood,
      risk: choice.risk,
      rivalName: rival.name,
      choiceLabel: choice.label,
      tier: result.tier,
      perf: result.perf,
      hasNextEvent: !doFinalize,
    };
    STATE._rivalDuelNext = {doFinalize};
    renderRivalDuelFeedback();
    return;
  }

  /* Sur les courses à étapes (multi-events non-rival), mémoriser le résultat
     de la phase pour l'afficher en contexte sur l'écran suivant */
  const isMultiEvent = race.events && race.events.filter(e=>!e._isBonus).length > 1;
  if(isMultiEvent && !doFinalize){
    STATE._lastPhaseResult = {tier: result.tier, perf: result.perf, eventTitle: event.title};
  } else {
    STATE._lastPhaseResult = null;
  }

  if(doFinalize){ finalizeRace(); }
  else { renderCurrentEvent(); }
}

