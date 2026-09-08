function rollWorldEvents(){
  if(!STATE.rider || STATE.rider.season < 2) return [];
  const count = Math.random() < 0.5 ? 1 : 2;
  let pool = WORLD_EVENTS.slice();
  const picked = [];
  for(let i=0;i<count&&pool.length;i++){
    const idx = Math.floor(Math.random()*pool.length);
    const chosen = pool.splice(idx,1)[0];
    picked.push(chosen);
    /* Exclusion mutuelle : deux évènements aux effets opposés (ex. vents favorables /
       calendrier chargé) ne doivent pas pouvoir tomber la même saison — ils
       s'annuleraient en silence tout en affichant deux textes contradictoires. */
    if(chosen.excludes && chosen.excludes.length) pool = pool.filter(ev=>!chosen.excludes.includes(ev.id));
  }
  return picked;
}

function applyWorldEvents(events){
  STATE.seasonWorldMods = {};
  events.forEach(ev => { try{ ev.apply(STATE); }catch(e){} });
  STATE.activeWorldEvents = events;
}


function checkPivotTrigger(){
  const r = STATE.rider;
  if(!r.careerFlags) r.careerFlags = {};
  const season = r.season;
  const pivot = PIVOT_EVENTS.find(p =>
    p.triggerSeason === season &&
    !r.careerFlags['pivot_done_' + p.id]
  );
  return pivot || null;
}

function renderPivotEvent(pivot){
  if(STATE) STATE._screen = 'pivotevent';
  STATE._pendingPivot = pivot;
  setHTML(`
    ${riderHeaderHTML()}
    <div class="card" style="border-left:4px solid var(--yellow);">
      <h1 class="h1-as-h2">${pivot.icon} ${pivot.title}</h1>
      <p>${pivot.desc}</p>
    </div>
    ${pivot.choices.map((c,i)=>`
      <button class="btn ${i===0?'':'ghost'}" onclick="applyPivotChoice(${i})">${c.label}</button>
    `).join('')}
  `);
}

function applyPivotChoice(i){
  const pivot = STATE._pendingPivot;
  const r = STATE.rider;
  r.careerFlags['pivot_done_' + pivot.id] = r.season;
  pivot.choices[i].effect(r);
  STATE._pendingPivot = null;
  saveGame();
  renderCalendarScreen();
}

/* ======================================================================
   TRAJECTOIRE DE CARRIÈRE
   Proposée une seule fois en S5 — définit l'identité du coureur pour
   la seconde moitié de sa carrière.
   ====================================================================== */

function checkTrajectoryTrigger(){
  const r = STATE.rider;
  return r.season === 5 && !r.trajectory && !r.careerFlags._trajectoryDone;
}

function renderTrajectoryChoice(){
  if(STATE) STATE._screen = 'trajectorychoice';
  const r = STATE.rider;
  const style = STYLES.find(s => s.id === r.styleId);
  setHTML(`
    ${riderHeaderHTML()}
    <div class="card" style="border-left:4px solid var(--yellow);">
      <h1 class="h1-as-h2">🛤️ ${tf('trajectoryTitle','Quelle carrière veux-tu construire ?')}</h1>
      <p>${tf('trajectoryDesc','Tu as 4 saisons de recul. Il est temps de choisir le fil directeur de ta carrière — une décision permanente qui orientera tes objectifs et tes opportunités.')}</p>
    </div>
    <div class="card" onclick="chooseTrajectory('specialiste')" style="cursor:pointer;">
      <strong>🎯 ${tf('traj_specialiste','Le Spécialiste')}</strong>
      <p class="small" style="margin:6px 0 0;">${tf('traj_specialiste_desc','Tu te concentres sur quelques courses clés. +12% de performance sur tes courses de prédilection. Si tu en joues plus de 8 dans la saison, ta fatigue augmente plus vite.')}</p>
    </div>
    <div class="card" onclick="chooseTrajectory('globetrotter')" style="cursor:pointer;">
      <strong>🌍 ${tf('traj_globetrotter','Le Globe-trotteur')}</strong>
      <p class="small" style="margin:6px 0 0;">${tf('traj_globetrotter_desc',"Tu courses partout, tu t\u2019exposes partout. +1 point de r\u00e9putation sur chaque course hors sp\u00e9cialit\u00e9. Tu arrives en d\u00e9but de saison avec +8 de fatigue r\u00e9siduelle, mais les \u00e9quipes de rang sup\u00e9rieur s\u2019int\u00e9ressent \u00e0 toi plus vite.")}</p>
    </div>
    <div class="card" onclick="chooseTrajectory('leader')" style="cursor:pointer;">
      <strong>👑 ${tf('traj_leader','Le Leader')}</strong>
      <p class="small" style="margin:6px 0 0;">${tf('traj_leader_desc','+5% de performance sur les courses imposées par l’équipe — tu livres quand ça compte. En contrepartie, chaque contre-performance sur une course de prestige élevé te coûte 1 point de réputation supplémentaire.')}</p>
    </div>
  `);
}

function renderWorldEventsScreen(){
  if(STATE) STATE._screen = 'worldevents';
  const events = STATE.activeWorldEvents || [];
  const cancelNote = STATE._worldEventCancelledRace
    ? `<p class="small" style="color:var(--red);margin:4px 0 0;">❌ ${tf('worldEventCancelled','Course annulée cette saison')} : ${STATE._worldEventCancelledRace}</p>`
    : '';
  /* Message vestiaire : ambiance narrative aléatoire, à partir de la S2 */
  const vestMsg = pickVestiaireMessage();
  const vestHTML = vestMsg ? `<div class="card" style="border-left:4px solid var(--text-soft);background:var(--surface-alt);">
    <p class="narrative-text" style="margin:0;">${vestMsg.icon} <em>${SETTINGS.lang==='en' ? vestMsg.en : vestMsg.fr}</em></p>
  </div>` : '';
  /* Si aucun world event ET aucun message vestiaire, aller directement au calendrier */
  if(!events.length && !vestHTML){ renderCalendarScreen(); return; }
  /* S'il n'y a que le vestiaire (pas de world events), afficher simplement le message + bouton */
  if(!events.length){
    setHTML(`
      ${riderHeaderHTML()}
      ${vestHTML}
      <button class="btn" onclick="renderCalendarScreen()">📅 ${tf('buildCalendar','Construire mon calendrier')}</button>
    `);
    return;
  }
  setHTML(`
    ${riderHeaderHTML()}
    ${vestHTML}
    <div class="card" style="border-left:4px solid var(--blue);">
      <h1 class="h1-as-h2">🌐 ${tf('worldEventsTitle','Actualité du peloton')}</h1>
      <p class="small">${tf('worldEventsSubtitle','Avant de bâtir ton calendrier, voici ce qui agite le monde cycliste cette saison.')}</p>
    </div>
    ${events.map(ev=>{
      const _en = SETTINGS.lang==='en';
      const title = (_en && ev.titleEN) ? ev.titleEN : ev.title;
      const desc = (_en && ev.descEN) ? ev.descEN : ev.desc;
      const effect = (_en && ev.effectEN) ? ev.effectEN : ev.effect;
      return `
      <div class="card">
        <strong>${ev.icon} ${title}</strong>
        <p class="small" style="margin:6px 0 4px;">${desc}</p>
        <p class="small" style="font-weight:700;color:var(--blue);">↳ ${effect}</p>
      </div>
    `;}).join('')}
    ${cancelNote}
    <button class="btn" onclick="renderCalendarScreen()">📅 ${tf('buildCalendar','Construire mon calendrier')}</button>
  `);
}

function chooseTrajectory(id){
  const r = STATE.rider;
  r.trajectory = id;
  r.careerFlags._trajectoryDone = true;
  addJournalEntry(r, `🛤️ ${tf('trajectoryChosen','Trajectoire choisie')} : ${tf('trajectory_'+id, id)}`);
  saveGame();
  renderWorldEventsScreen();
}
