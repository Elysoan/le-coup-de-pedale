function saveGame(){
  if(SUPPRESS_SAVE) return;
  try{
    const global = {
      unlocked: Array.from(UNLOCKED),
      session: {
        careersCompleted: SESSION.careersCompleted,
        stylesPlayed: Array.from(SESSION.stylesPlayed),
        countriesPlayed: Array.from(SESSION.countriesPlayed),
        tipsShown: SESSION.tipsShown,
      },
      careerHistory: CAREER_HISTORY,
      unlockInfo: UNLOCK_INFO,
      raceRecords: RACE_RECORDS,
    };
    localStorage.setItem(GLOBAL_KEY, JSON.stringify(global));
    if(CURRENT_SLOT !== null){
      /* STATE null (juste après resetGame(), avant que confirmCreation() ne le
         repeuple) : écrire le null pur attendu par l'invariant du slot, pas
         {state:null,...} — sinon ce demi-état écrasait le null qu'on venait de poser. */
      SLOTS[CURRENT_SLOT] = STATE ? {state: STATE, creation: window._creation} : null;
      localStorage.setItem(SLOTS_KEY, JSON.stringify(SLOTS));
    }
    SAVE_FAILED = false;
  } catch(e){
    /* Stockage indisponible (navigateur restrictif, mode privé, quota plein...) : on ne
       bloque pas le jeu, mais on ne veut plus que ça reste invisible pour le joueur —
       un signal discret est affiché au prochain écran plutôt qu'une perte de progression
       silencieuse. */
    SAVE_FAILED = true;
  }
}

function loadGlobalData(){
  try{
    const raw = localStorage.getItem(GLOBAL_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch(e){ return null; }
}

function loadSlotsData(){
  try{
    const raw = localStorage.getItem(SLOTS_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    /* On complète/tronque à 3 cases plutôt que de tout jeter dès que la forme diffère
       un peu de l'attendu — sinon une longueur inattendue efface jusqu'à 3 carrières
       en cours sans la moindre tentative de récupération. */
    if(Array.isArray(parsed)) return [parsed[0]||null, parsed[1]||null, parsed[2]||null];
  } catch(e){}
  return [null, null, null];
}

/* Migration douce depuis l'ancien format à emplacement unique (avant l'introduction
   des 3 emplacements) : la carrière en cours devient l'emplacement 1, le reste
   (trophées, historique) devient la progression globale partagée. */
function migrateOldSaveIfNeeded(){
  try{
    const raw = localStorage.getItem(OLD_SAVE_KEY);
    if(!raw) return;
    const old = JSON.parse(raw);
    const global = {unlocked: old.unlocked||[], session: old.session||null, careerHistory: old.careerHistory||[]};
    localStorage.setItem(GLOBAL_KEY, JSON.stringify(global));
    const slots = [null, null, null];
    if(old.state) slots[0] = {state: old.state, creation: old.creation||null};
    localStorage.setItem(SLOTS_KEY, JSON.stringify(slots));
    localStorage.removeItem(OLD_SAVE_KEY);
  } catch(e){ /* pas grave, on repart sur une base vide */ }
}

function restoreGlobalData(g){
  if(!g) return;
  if(g.unlocked) UNLOCKED = new Set(g.unlocked);
  if(g.session){
    SESSION = {
      careersCompleted: g.session.careersCompleted||0,
      stylesPlayed: new Set(g.session.stylesPlayed||[]),
      countriesPlayed: new Set(g.session.countriesPlayed||[]),
      tipsShown: g.session.tipsShown||{},
    };
  }
  if(g.careerHistory) CAREER_HISTORY = g.careerHistory;
  if(g.unlockInfo) UNLOCK_INFO = g.unlockInfo;
  if(g.raceRecords) RACE_RECORDS = g.raceRecords;
}

/* Compatibilité ascendante : une sauvegarde faite avant l'ajout d'un champ récent au
   coureur (ex. stageWins) ne l'a pas encore — on le complète pour éviter tout NaN/bug. */
function backfillRiderFields(rider){
  if(!rider) return;
  if(typeof rider.stageWins !== 'number') rider.stageWins = 0;
  if(typeof rider.sponsor === 'undefined') rider.sponsor = null;
  if(typeof rider.pendingConfidentBet !== 'boolean') rider.pendingConfidentBet = false;
  if(typeof rider.teammate === 'undefined') rider.teammate = generateTeammate();
  if(typeof rider.signatureRaceId === 'undefined') rider.signatureRaceId = null;
  if(typeof rider.careerCap === 'undefined') rider.careerCap = null;
  if(!Array.isArray(rider.journal)) rider.journal = [];
  if(typeof rider.isMentor !== 'boolean') rider.isMentor = false;
  if(typeof rider.mentorOfferDeclined !== 'boolean') rider.mentorOfferDeclined = false;
  if(typeof rider.worldRank !== 'number') rider.worldRank = 450;
  if(typeof rider.styleConfirmed !== 'boolean') rider.styleConfirmed = false;
  if(!rider.careerFlags) rider.careerFlags = {};
  if(typeof rider.trajectory === 'undefined') rider.trajectory = null;
  if(!Array.isArray(rider.seasonHistory)) rider.seasonHistory = [];
  if(typeof rider._top50Seasons === 'undefined') rider._top50Seasons = 0;
  if(typeof rider.role === 'undefined') rider.role = null;
  if(typeof rider.peakWorldRank !== 'number') rider.peakWorldRank = rider.worldRank;
  if(!Array.isArray(rider.rivalPayoffsSeen)) rider.rivalPayoffsSeen = [];
}

/* Journal de carrière : quelques lignes chronologiques sur les vrais temps forts,
   consultable en fin de carrière — au-delà du simple résumé "moments forts". */
function addJournalEntry(rider, text){
  if(!rider.journal) rider.journal = [];
  rider.journal.push({season: rider.season, text});
}

/* Reprend la carrière d'un emplacement précis exactement là où elle avait été laissée,
   en redirigeant vers l'écran correspondant au dernier état sauvegardé. Les écrans
   purement transitoires (affichage d'un résultat) renvoient vers le prochain écran
   d'action plutôt que de tenter de reconstruire un affichage éphémère. */
function resumeSlot(i){
  SUPPRESS_SAVE = false;
  CURRENT_SLOT = i;
  const slot = SLOTS[i];
  STATE = slot ? slot.state : null;
  window._creation = (slot && slot.creation) || {name:'', country: COUNTRIES[0].code, style:null};
  if(!STATE){ renderCreationScreen(); return; }
  backfillRiderFields(STATE.rider);
  const screen = STATE._screen;
  /* Garde-fou sur l'index de course en cours : contrairement au reste du code (qui
     vérifie systématiquement les bornes avant d'accéder à la course en cours), une
     reprise de partie sur un index désynchronisé plantait l'écran au lieu de retomber
     proprement sur le calendrier. */
  const _hasValidCurrentRace = STATE.runQueue && STATE.runQueue[STATE.runRaceIdx];
  if(screen==='seasonsetup') renderSeasonSetupScreen();
  else if(screen==='convalescence' && _hasValidCurrentRace) renderConvalescenceScreen(STATE.runQueue[STATE.runRaceIdx]);
  else if(screen==='mentoroffer') renderMentorOffer();
  else if(screen==='interview') renderInterviewScreen();
  else if(screen==='interviewreaction') renderInterviewReactionScreen();
  else if(screen==='calendar') renderCalendarScreen();
  else if(screen==='rolechoice' && _hasValidCurrentRace) renderRoleChoice(STATE.runQueue[STATE.runRaceIdx]);
  else if(screen==='nextracebchoice') beginRaceOrFinish();
  else if(screen==='currentevent') renderCurrentEvent();
  else if(screen==='styleconfirm') renderStyleConfirmEvent(detectRiderProfile(STATE.rider)||STATE.rider.styleId);
  else if(screen==='trajectorychoice') renderTrajectoryChoice();
  else if(screen==='worldevents') renderWorldEventsScreen();
  else if(screen==='pivotevent' && STATE._pendingPivot) renderPivotEvent(STATE._pendingPivot);
  else if(screen==='seasonrecap' && STATE.seasonRecapData) renderSeasonRecap();
  else if(screen==='contractscreen') renderContractScreen();
  else if(screen==='personalevent' && STATE.pendingPersonalEvent) renderPersonalEvent();
  else if(screen==='cancelrace') renderCancelRaceScreen();
  else if(STATE.runQueue && STATE.runQueue.length) renderCalendarScreen();
  else renderSeasonSetupScreen();
}

/* Sélectionne un emplacement depuis le menu principal : reprend la carrière en cours
   si l'emplacement en contient une (non retraitée), ou démarre une création dedans. */
function selectSlot(i){
  const slot = SLOTS[i];
  if(slot && slot.state && slot.state.rider && !slot.state.rider.retired){
    resumeSlot(i);
  } else if(slot && slot.state && slot.state.rider && slot.state.rider.retired){
    viewRetiredCareer(i);
  } else {
    SUPPRESS_SAVE = false;
    CURRENT_SLOT = i;
    STATE = null;
    window._creation = {name:'', country: COUNTRIES[0].code, style:null};
    renderCreationScreen();
  }
}

/* « Voir » sur une carrière retraitée doit vraiment l'afficher, pas relancer une
   création dans ce même emplacement (ce qui l'écrasait au rendu suivant, via
   l'autosave). CURRENT_SLOT reste sur cet emplacement comme pour resumeSlot() —
   la carrière est déjà terminée, réécrire le même état ne perd rien. */
function viewRetiredCareer(i){
  SUPPRESS_SAVE = false;
  CURRENT_SLOT = i;
  const slot = SLOTS[i];
  STATE = slot.state;
  window._creation = slot.creation || {name:'', country: COUNTRIES[0].code, style:null};
  backfillRiderFields(STATE.rider);
  renderCareerEnd();
}

function deleteSlot(i){
  SLOTS[i] = null;
  try{ localStorage.setItem(SLOTS_KEY, JSON.stringify(SLOTS)); SAVE_FAILED = false; } catch(e){ SAVE_FAILED = true; }
  renderMainMenu();
}

function confirmDeleteSlot(i){
  const slot = SLOTS[i];
  const name = slot && slot.state && slot.state.rider ? slot.state.rider.name : tf('thisCareer','cette carrière');
  setHTML(`
    <div class="card center">
      <h1 class="h1-as-h2">🗑️ ${tf('deleteCareerTitle','Supprimer cette carrière ?')}</h1>
      <p>${name} ${tf('willBeErased','sera')} <strong>${tf('permanentlyErased','définitivement effacé')}</strong> ${tf('fromThisSlot',"de cet emplacement — impossible de revenir en arrière.")}</p>
      <button class="btn" style="background:var(--red);box-shadow:0 6px 0 #C23B3B, 0 10px 20px -8px rgba(194,59,59,0.45);" onclick="deleteSlot(${i})">${tf('deletePermanently','Supprimer définitivement')}</button>
      <button class="btn ghost" onclick="renderMainMenu()">${tf('cancel','← Annuler')}</button>
    </div>
  `);
}
