function renderRivalDuelFeedback(){
  if(STATE) STATE._screen = 'rivalduel';
  const fd = STATE._pendingRivalDuelFeedback;
  if(!fd){ renderCurrentEvent(); return; }
  STATE._pendingRivalDuelFeedback = null;
  const lang = SETTINGS.lang === 'en';
  const isGood = fd.good;
  const bank = isGood ? RIVAL_DUEL_FEEDBACK.good : RIVAL_DUEL_FEEDBACK.bad;
  const pool = bank[fd.risk] || bank.equilibre;
  const raw = pool[Math.floor(Math.random()*pool.length)];
  const msg = (lang ? raw.en : raw.fr).replace(/\{name\}/g, fd.rivalName);
  const color = isGood ? 'var(--green)' : 'var(--red)';
  const bgColor = isGood ? 'var(--green-light)' : 'var(--red-light)';
  const icon = isGood ? '✅' : '❌';
  const riskIcon = {sur:'🛡️', equilibre:'⚖️', audacieux:'🎲', loufoque:'🤪'}[fd.risk] || '⚡';
  const tierLabel = {
    victoire: lang?'Win':'Victoire',
    podium: lang?'Podium':'Podium',
    top10: lang?'Top 10':'Top 10',
    jourssans: lang?'Off day':'Jour sans',
    abandon: lang?'DNF':'Abandon',
  }[fd.tier] || fd.tier;
  /* Estimation de la place finale — disponible seulement si c'est le dernier event
     (sinon la course continue, la place finale n'est pas encore déterminée) */
  const finalPlaceLine = !fd.hasNextEvent
    ? ` · 🏁 ${lang?'Est. finish':'Place estimée'} : <strong>${estimatePlacement(fd.tier, fd.perf??50)}</strong>`
    : '';

  setHTML(`
    ${riderHeaderHTML()}
    <div class="card" style="border:2px solid ${color};background:${bgColor};">
      <p style="margin:0 0 8px;font-weight:700;color:${color};">${icon} 🥊 ${lang?'Duel vs':'Duel contre'} ${fd.rivalName}</p>
      <p class="narrative-text" style="margin:0 0 10px;">${msg}</p>
      <p class="small" style="margin:0;color:var(--text-soft);">${riskIcon} ${lang?'Your choice':'Ton choix'} : <strong>${fd.choiceLabel}</strong> · ${lang?'Result on this phase':'Résultat sur cette phase'} : <strong>${tierLabel}</strong>${finalPlaceLine}</p>
    </div>
    <button class="btn" onclick="proceedAfterRivalDuel()">
      ${fd.hasNextEvent ? (lang?'Continue the race →':'Continuer la course →') : (lang?'See the result →':'Voir le résultat →')}
    </button>
  `, true);
}

function proceedAfterRivalDuel(){
  const fd = STATE._rivalDuelNext;
  STATE._rivalDuelNext = null;
  if(!fd) { renderCurrentEvent(); return; }
  if(fd.doFinalize) finalizeRace();
  else renderCurrentEvent();
}

function rollRivalRaceEvent(race, rivals){
  // Vérifier si un rival est présent dans cette course
  const presentRivals = (rivals||[]).filter(rv => (rv.raceIds||[]).includes(race.id));
  if(presentRivals.length === 0) return null;
  const rival = pickReactiveRival(presentRivals);

  // Choisir un event rival adapté au type de course
  const typeToFocus = {
    grandtour: ['montagne','resistance'],
    monument: ['classiques','mental'],
    classique: ['classiques','sprint'],
    semitour: ['resistance','montagne'],
    crit: ['sprint'],
    champ: ['mental','resistance'],
  };
  const preferred = typeToFocus[race.type] || [];
  const sorted = RIVAL_RACE_EVENTS.slice().sort((a,b) => {
    const aMatch = a.focus.some(f => preferred.includes(f)) ? -1 : 1;
    const bMatch = b.focus.some(f => preferred.includes(f)) ? -1 : 1;
    return aMatch - bMatch + (Math.random()-0.5)*0.5;
  });
  const def = sorted[0];
  const v = def.variants[Math.floor(Math.random() * def.variants.length)];
  const name = rival.name;

  const event = {focus: def.focus, _isBonus: true, _isRivalEvent: true, _rivalName: name};
  Object.defineProperty(event, 'title', {enumerable:true, get(){
    const t = (SETTINGS.lang==='en' && v.titleEN) ? v.titleEN : v.title;
    return t.replace(/\{name\}/g, name);
  }});
  Object.defineProperty(event, 'desc', {enumerable:true, get(){
    const d = (SETTINGS.lang==='en' && v.descEN) ? v.descEN : v.desc;
    return d.replace(/\{name\}/g, name);
  }});
  event.choices = def.choices.map(c => {
    const choice = {risk: c.risk, tilt: c.tilt||[]};
    Object.defineProperty(choice, 'label', {enumerable:true, get(){
      return (SETTINGS.lang==='en' && c.labelEN) ? c.labelEN : c.label;
    }});
    return choice;
  });
  return event;
}

function rollBonusPhases(race, rivalPresent){
  /* Nombre de phases bonus selon prestige :
     1 → 0-1 | 2-3 → 1-2 | 4-5 → 2-3
     Si un rival est présent dans la course, on plafonne à 1 pour ne pas surcharger.
     Aléatoire dans la plage, légèrement biaisé vers le bas pour éviter la répétition. */
  const p = race.prestige || 1;
  let min, max;
  if(p <= 1){ min=0; max=1; }
  else if(p <= 3){ min=1; max=2; }
  else { min=2; max=3; }
  if(rivalPresent){ max = Math.min(max, 1); min = Math.min(min, 1); }
  if(race.type === 'grandtour'){ max = Math.min(max, 2); }
  const count = min + Math.floor(Math.random()*(max-min+1));
  if(count === 0) return [];

  /* Sélectionner des phases pertinentes selon le type de course,
     sinon piocher aléatoirement dans le pool complet. */
  const typeToFocus = {
    grandtour:['montagne','resistance','clm'],
    monument:['classiques','montagne','mental'],
    classique:['classiques','sprint','mental'],
    semitour:['resistance','montagne','recuperation'],
    crit:['sprint','mental'],
    champ:['clm','sprint','resistance'],
  };
  const preferred = typeToFocus[race.type] || [];
  const sorted = BONUS_PHASE_POOL.slice().sort((a,b)=>{
    const aMatch = a.focus.some(f=>preferred.includes(f)) ? -1 : 1;
    const bMatch = b.focus.some(f=>preferred.includes(f)) ? -1 : 1;
    return aMatch - bMatch + (Math.random()-0.5)*0.5;
  });
  const selected = sorted.slice(0, count);
  return selected.map(def => {
    const v = def.variants[Math.floor(Math.random()*def.variants.length)];
    const event = {focus: def.focus, _isBonus: true};
    Object.defineProperty(event, 'title', {enumerable:true, get(){
      return (SETTINGS.lang==='en' && v.titleEN) ? v.titleEN : v.title;
    }});
    Object.defineProperty(event, 'desc', {enumerable:true, get(){
      return (SETTINGS.lang==='en' && v.descEN) ? v.descEN : v.desc;
    }});
    event.choices = def.choices.map(c => {
      const choice = {risk:c.risk, tilt:c.tilt||[]};
      Object.defineProperty(choice, 'label', {enumerable:true, get(){
        return (SETTINGS.lang==='en' && c.labelEN) ? c.labelEN : c.label;
      }});
      return choice;
    });
    return event;
  });
}

function beginRace(){
  const race = STATE.runQueue[STATE.runRaceIdx];
  const prev = STATE.runRaceIdx>0 ? STATE.runQueue[STATE.runRaceIdx-1] : null;
  applyInterRaceRecovery(STATE.rider, prev, race);
  STATE.runRaceAccum = [];
  STATE.runEventIdx = 0;
  STATE.raceRole = null;

  // Injection des phases narratives bonus selon le prestige (Évolution 6)
  // Les phases bonus enrichissent tous les types de course.
  // _baseEventCount conserve le nombre d'events canoniques (avant injection)
  // pour que le compteur affiché reste cohérent avec la durée réelle de la course.
  if(!race._bonusInjected){
    race._bonusInjected = true;
    race._baseEventCount = race.events.length;
    // Vérifier si un rival est présent : si oui, limiter les phases bonus à 1 max
    const _rivalPresent = (STATE.rivals||[]).some(rv => (rv.raceIds||[]).includes(race.id));
    const bonusPhases = rollBonusPhases(race, _rivalPresent);
    if(bonusPhases.length > 0){
      race.events = bonusPhases.concat(race.events);
    }
    // Injecter un event rival si un rival est présent dans cette course (une seule fois, en milieu de course)
    const rivalEvent = rollRivalRaceEvent(race, STATE.rivals);
    if(rivalEvent){
      const insertAt = Math.floor(race.events.length / 2); // milieu de course
      race.events.splice(insertAt, 0, rivalEvent);
    }

    // Pré-assigner la météo : les phases bonus du même jour que le 1er event normal
    // reçoivent la même météo pour éviter les incohérences ("pluie" puis "canicule" le même jour)
    const firstDayWeather = rollWeather(race.month, race.flag==='🇦🇺').id;
    const bonusCount = race.events.filter(e => e._isBonus).length;
    for(let i = 0; i <= bonusCount; i++){
      if(race.events[i]) race.events[i]._weather = firstDayWeather;
    }
    // Les events suivants (jours différents) auront leur propre météo tirée à la volée
  }

  if(STATE.injuryAbsenceRemaining > 0){
    renderConvalescenceScreen(race);
    return;
  }

  // Surmenage : risque de blessure avant même le départ si la fatigue est déjà très élevée.
  const overload = Math.max(0, STATE.rider.fatigue - 70);
  if(Math.random() < overload*0.018){
    handleInjury('surmenage', race);
    return;
  }

  if(race.type === 'grandtour'){
    renderRoleChoice(race);
  } else {
    renderCurrentEvent();
  }
}
