/* ---- Évènement personnel (vie hors vélo) ---- */

/* Constitue le vivier d'évènements personnels pour un coureur donné : le vivier
   générique (privé des évènements réservés au début de saison si non pertinent) plus
   les évènements spécifiques à sa nationalité, s'il y en a. */
function personalEventPool(rider, includeSeasonStartOnly, rivalRecords){
  let pool = includeSeasonStartOnly ? PERSONAL_EVENTS : PERSONAL_EVENTS.filter(e=>!e.seasonStartOnly);
  const national = NATIONAL_EVENTS[rider.countryCode];
  if(national && national.length) pool = pool.concat(national, national);
  if(rider.teammate){
    const tmEvents = TEAMMATE_EVENTS[rider.teammate.archetype];
    if(tmEvents && tmEvents.length){
      const name = rider.teammate.name;
      const materialized = tmEvents.map(ev=>({
        icon: ev.icon,
        title: ev.title.replace(/\{name\}/g, name),
        desc: ev.desc.replace(/\{name\}/g, name),
        titleEN: ev.titleEN ? ev.titleEN.replace(/\{name\}/g, name) : undefined,
        descEN: ev.descEN ? ev.descEN.replace(/\{name\}/g, name) : undefined,
        choices: ev.choices,
        payoff: ev.payoff || false,
      }));
      /* Dupliqué plusieurs fois : sinon noyé dans les 45 évènements génériques et
         quasiment jamais tiré sur une carrière entière. */
      pool = pool.concat(materialized, materialized, materialized);
    }
  }
  const rival = mostRivaledName(rivalRecords);
  if(rival.name && rival.total>=2){
    const materialized = RIVAL_EVENTS.map(ev=>({
      icon: ev.icon,
      title: ev.title.replace(/\{name\}/g, rival.name),
      desc: ev.desc.replace(/\{name\}/g, rival.name),
      titleEN: ev.titleEN ? ev.titleEN.replace(/\{name\}/g, rival.name) : undefined,
      descEN: ev.descEN ? ev.descEN.replace(/\{name\}/g, rival.name) : undefined,
      choices: ev.choices,
    }));
    pool = pool.concat(materialized, materialized);
    /* Un vrai point culminant unique : ne se propose plus une fois déjà vécu avec ce
       rival précis, sinon rien n'empêche de retomber dessus à chaque saison suivante
       tant que le total de confrontations reste au-dessus du seuil. */
    const _payoffsSeen = (STATE && STATE.rider && STATE.rider.rivalPayoffsSeen) || [];
    if(rival.total>=5 && !_payoffsSeen.includes(rival.name)){
      pool.push({
        icon: RIVAL_PAYOFF_EVENT.icon,
        title: RIVAL_PAYOFF_EVENT.title.replace(/\{name\}/g, rival.name),
        desc: RIVAL_PAYOFF_EVENT.desc.replace(/\{name\}/g, rival.name),
        titleEN: RIVAL_PAYOFF_EVENT.titleEN ? RIVAL_PAYOFF_EVENT.titleEN.replace(/\{name\}/g, rival.name) : undefined,
        descEN: RIVAL_PAYOFF_EVENT.descEN ? RIVAL_PAYOFF_EVENT.descEN.replace(/\{name\}/g, rival.name) : undefined,
        choices: RIVAL_PAYOFF_EVENT.choices,
        payoff: true,
        rivalPayoff: true,
        rivalKey: rival.name,
      });
    }
  }
  return pool.map(localizeEvent);
}

/* Applique la traduction anglaise d'un évènement personnel si dispo, sinon repli
   silencieux sur le français (même principe que pickVariant pour les courses). */
function localizeEvent(ev){
  const out = {icon: ev.icon, payoff: ev.payoff, rivalPayoff: ev.rivalPayoff, rivalKey: ev.rivalKey};
  Object.defineProperty(out, 'title', {enumerable:true, get(){ return (SETTINGS.lang==='en' && ev.titleEN) ? ev.titleEN : ev.title; }});
  Object.defineProperty(out, 'desc', {enumerable:true, get(){ return (SETTINGS.lang==='en' && ev.descEN) ? ev.descEN : ev.desc; }});
  out.choices = ev.choices.map(c => {
    const choice = {effect: c.effect, bond: c.bond};
    Object.defineProperty(choice, 'label', {enumerable:true, get(){ return (SETTINGS.lang==='en' && c.labelEN) ? c.labelEN : c.label; }});
    return choice;
  });
  return out;
}

/* ======================================================================
   ÉVÉNEMENTS DU MONDE CYCLISTE
   1-2 events tirés au sort chaque début de saison (dès S2).
   Ils modifient concrètement la saison en cours — effets visibles
   à l'écran ET mécaniques réels.
   ====================================================================== */

function pickVestiaireMessage(){
  if(!STATE || (STATE.rider && STATE.rider.season <= 1)) return null; // pas en S1
  const msg = VESTIAIRE_POOL[Math.floor(Math.random()*VESTIAIRE_POOL.length)];
  return msg;
}

function maybeShowPersonalEvent(){
  // La trajectoire a priorité absolue en S5 (une seule fois)
  if(checkTrajectoryTrigger()){ renderTrajectoryChoice(); return; }
  // Les pivots ont priorité sur les événements personnels ordinaires
  const pivot = checkPivotTrigger();
  if(pivot){ renderPivotEvent(pivot); return; }

  if(Math.random() < 0.3){
    const pool = personalEventPool(STATE.rider, true, STATE.rivalRecords);
    STATE.pendingPersonalEvent = pool[Math.floor(Math.random()*pool.length)];
    renderPersonalEvent();
  } else {
    renderWorldEventsScreen();
  }
}

/* Entre deux courses d'une même saison (pas seulement avant la saison) : probabilité
   plus faible course par course, pour ne pas multiplier les interruptions, mais qui
   permet d'en croiser aussi en plein cœur du calendrier. Les évènements marqués
   seasonStartOnly (liés à la coupure hivernale) restent réservés au début de saison. */
function maybeShowMidSeasonPersonalEvent(){
  STATE.personalEventReturnTo = 'nextraceChoice';
  // Proposition de confirmation/ajustement de profil en S2 ou S3, une seule fois
  if(!STATE.rider.styleConfirmed && (STATE.rider.season===2||STATE.rider.season===3) && !STATE._styleEventShown){
    const suggested = detectRiderProfile(STATE.rider);
    if(suggested){
      STATE._styleEventShown = true;
      renderStyleConfirmEvent(suggested);
      return;
    }
  }
  const pool = personalEventPool(STATE.rider, false, STATE.rivalRecords);
  if(Math.random() < 0.15){
    STATE.pendingPersonalEvent = pool[Math.floor(Math.random()*pool.length)];
    renderPersonalEvent();
  } else {
    beginRaceOrFinish();
  }
}


function renderStyleConfirmEvent(suggestedStyleId){
  if(STATE) STATE._screen='styleconfirm';
  const r = STATE.rider;
  const currentStyle = STYLES.find(s=>s.id===r.styleId);
  const suggestedStyle = STYLES.find(s=>s.id===suggestedStyleId);
  const isSame = suggestedStyleId === r.styleId;
  setHTML(`
    ${riderHeaderHTML()}
    <div class="card">
      <h2>🔍 ${tf('profileConfirmTitle','Ton profil prend forme')}</h2>
      <p>${isSame
        ? `${tf('profileConfirmSame','Tes résultats confirment ton profil')} <strong>${currentStyle.icon} ${currentStyle.name}</strong>. ${tf('profileConfirmSameDesc','Continue dans cette direction.')}`
        : `${tf('profileConfirmDiff','Tes performances suggèrent un profil')} <strong>${suggestedStyle.icon} ${suggestedStyle.name}</strong> ${tf('profileConfirmDiff2','plutôt que')} <strong>${currentStyle.icon} ${currentStyle.name}</strong>.`
      }</p>
      ${!isSame ? `<p class="small">${tf('profileSwitchDesc','Basculer vers ce profil ajustera ton style de jeu — les courses correspondantes te seront plus favorables.')}</p>` : ''}
    </div>
    ${!isSame ? `
      <button class="btn" onclick="confirmStyleSwitch('${suggestedStyleId}')">${suggestedStyle.icon} ${tf('adoptProfile','Adopter le profil')} ${suggestedStyle.name}</button>
      <button class="btn ghost" onclick="keepCurrentStyle()">${currentStyle.icon} ${tf('keepProfile','Garder mon profil')} ${currentStyle.name}</button>
    ` : `
      <button class="btn" onclick="keepCurrentStyle()">${tf('continue','Continuer')}</button>
    `}
  `);
}

function confirmStyleSwitch(newStyleId){
  STATE.rider.styleId = newStyleId;
  STATE.rider.styleConfirmed = true;
  beginRaceOrFinish();
}

function keepCurrentStyle(){
  STATE.rider.styleConfirmed = true;
  beginRaceOrFinish();
}

function renderPersonalEvent(){
  if(STATE) STATE._screen='personalevent';
  const ev = STATE.pendingPersonalEvent;
  setHTML(`
    ${riderHeaderHTML()}
    <div class="card">
      <h1 class="h1-as-h2">${ev.icon} ${tf('personalLife','Vie personnelle')}</h1>
      <h3>${ev.title}</h3>
      <p>${ev.desc}</p>
      ${ev.choices.map((c,i)=>`<button class="btn equilibre" onclick="applyPersonalEvent(${i})">${c.label}</button>`).join('')}
    </div>
  `);
}

function applyPersonalEvent(i){
  const ev = STATE.pendingPersonalEvent;
  const choice = ev.choices[i];
  const r = STATE.rider;
  const eff = choice.effect || {};
  const changes = [];
  if(ev.payoff){
    addJournalEntry(r, `${ev.icon} ${ev.title}`);
  }
  if(ev.rivalPayoff && ev.rivalKey){
    if(!r.rivalPayoffsSeen) r.rivalPayoffsSeen = [];
    r.rivalPayoffsSeen.push(ev.rivalKey);
  }
  if(eff.stats){
    Object.keys(eff.stats).forEach(k=>{
      const before = r.stats[k];
      r.stats[k] = clamp(before + eff.stats[k], 8, 99);
      const delta = Math.round((r.stats[k]-before)*10)/10;
      if(delta!==0) changes.push(`${STAT_ICONS[k]} ${STAT_LABELS[k]} ${delta>=0?'+':''}${delta}`);
    });
  }
  if(eff.fatigue){ r.fatigue = clamp(r.fatigue + eff.fatigue, 0, 100); changes.push(`🔥 ${tf('fatigueWord','Fatigue')} ${eff.fatigue>=0?'+':''}${eff.fatigue}`); }
  if(eff.reputation){ r.reputation = clamp(r.reputation + eff.reputation, 0, 100); changes.push(`⭐ ${tf('reputationWord','Réputation')} ${eff.reputation>=0?'+':''}${eff.reputation}`); }
  if(choice.bond && r.teammate){
    r.teammate.bond = clamp(r.teammate.bond + choice.bond, 0, 100);
    changes.push(`🤝 ${tf('bondWith','Complicité avec')} ${r.teammate.name} ${choice.bond>=0?'+':''}${choice.bond}`);
  }
  STATE.pendingPersonalEventResult = {title: ev.title, choiceLabel: choice.label, changes};
  STATE.pendingPersonalEvent = null;
  renderPersonalEventResult();
}

function renderPersonalEventResult(){
  if(STATE) STATE._screen='personaleventresult';
  const res = STATE.pendingPersonalEventResult;
  setHTML(`
    ${riderHeaderHTML()}
    <div class="card">
      <h2>✅ ${tf('consequences','Conséquences')}</h2>
      <p class="small" style="font-style:italic;">${res.choiceLabel}</p>
      ${res.changes.length ? res.changes.map(c=>`<p class="small" style="margin:5px 0;font-weight:700;">${c}</p>`).join('') : `<p class="small">${tf('noMeasurableConsequence','Pas de conséquence mesurable cette fois.')}</p>`}
    </div>
    <button class="btn" onclick="proceedAfterPersonalEvent()">${tf('continue','Continuer')}</button>
  `);
}

function proceedAfterPersonalEvent(){
  STATE.pendingPersonalEventResult = null;
  if(STATE.personalEventReturnTo === 'nextraceChoice'){ beginRaceOrFinish(); }
  else if(STATE.personalEventReturnTo === 'race'){ beginRace(); }
  else { renderWorldEventsScreen(); }
}
