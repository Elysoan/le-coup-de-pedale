function t(key){
  const lang = SETTINGS.lang || 'fr';
  if(lang==='en' && I18N.en[key] !== undefined) return I18N.en[key];
  return null; // signale a l'appelant de retomber sur le texte francais en dur
}
/* Petit raccourci pour les endroits ou on veut : traduction si dispo, sinon la valeur
   française déjà écrite en dur passée en 2e argument. */
function tf(key, frText){
  const v = t(key);
  return v===null ? frText : v;
}
function setLang(lang){
  SETTINGS.lang = lang;
  applySettings();
  saveSettings();
  if(STATE && STATE.rider){ rerenderCurrentScreenForLang(); } else { renderMainMenu(); }
}
/* Depuis l'écran Réglages (accessible avec ou sans carrière en cours, contrairement à
   setLang() ci-dessus qui suppose venir du menu principal ou d'un écran de run
   suivi) : on reste simplement sur Réglages plutôt que de sauter ailleurs. */
function setLangFromSettings(lang){
  SETTINGS.lang = lang;
  applySettings();
  saveSettings();
  renderSettingsScreen(true);
}
/* Redessine l'écran courant après un changement de langue en cours de partie, sur le
   même principe que resumeSlot (dispatch par nom d'écran). */
function rerenderCurrentScreenForLang(){
  const screen = STATE._screen;
  if(screen==='seasonsetup') renderSeasonSetupScreen();
  else if(screen==='mentoroffer') renderMentorOffer();
  else if(screen==='convalescence') renderConvalescenceScreen(STATE.runQueue[STATE.runRaceIdx]);
  else if(screen==='calendar') renderCalendarScreen();
  else if(screen==='rolechoice') renderRoleChoice(STATE.runQueue[STATE.runRaceIdx]);
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
/* Réglages/Journal ouverts en cours de run (via NAV_RETURN_TO='inrun') ne touchent
   jamais STATE._screen tant qu'ils sont affichés — sinon le "retour" perdrait la trace
   du véritable écran de jeu sous-jacent. STATE._navReturnScreen capture ce nom d'écran
   juste avant l'ouverture ; ce helper le restaure avant de redessiner. */
function restoreNavReturnScreen(){
  if(STATE && STATE._navReturnScreen) STATE._screen = STATE._navReturnScreen;
  rerenderCurrentScreenForLang();
}
