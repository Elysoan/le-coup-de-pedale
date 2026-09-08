function renderInterviewScreen(){
  if(STATE) STATE._screen='interview';
  const rivalName = STATE.lastRivalName;
  setHTML(`
    ${riderHeaderHTML()}
    <div class="card">
      <h1 class="h1-as-h2">🎤 ${tf('postRaceInterview',"Interview d'après-course")}</h1>
      <p>${tf('journalistMic','Un journaliste te tend son micro, tout sourire. Que réponds-tu ?')}</p>
      <button class="btn ghost" onclick="applyInterviewChoice('humble')">🙏 ${tf('stayHumble','Rester humble')} — « ${tf('humbleQuote',"L'équipe a fait un travail formidable.")} »</button>
      <button class="btn ghost" onclick="applyInterviewChoice('confiant')">💪 ${tf('showConfidence','Afficher ta confiance')} — « ${tf('confidentQuote',"Je sens que je suis sur une autre planète en ce moment.")} »</button>
      <button class="btn ghost" onclick="applyInterviewChoice('piquant')">😏 ${tf('jab','Une pique')} ${rivalName?`${tf('towards','envers')} ${rivalName}`:tf('towardsCompetition','envers la concurrence')} — « ${rivalName?`${tf('jabQuote1','On verra si')} ${rivalName} ${tf('jabQuote1b','peut suivre le rythme.')}`:tf('jabQuote2','Certains ont encore du chemin à faire.')} »</button>
    </div>
  `);
}

function applyInterviewChoice(choice){
  const r = STATE.rider;
  if(choice==='humble'){
    r.reputation = clamp(r.reputation+1, 0, 100);
    r.teamConfidence = clamp(r.teamConfidence+2, 0, 100);
    r.reputation = clamp(r.reputation+1, 0, 100);
  } else if(choice==='confiant'){
    r.reputation = clamp(r.reputation+3, 0, 100);
    r.pendingConfidentBet = true;
    r.reputation = clamp(r.reputation+3, 0, 100);
  } else if(choice==='piquant'){
    r.reputation = clamp(r.reputation+2, 0, 100);
    r.stats.mental = clamp(r.stats.mental+2, 10, 99);
    r.reputation = clamp(r.reputation+4, 0, 100);
  }
  STATE.pendingInterviewReaction = interviewReaction(choice);
  renderInterviewReactionScreen();
}

function renderInterviewReactionScreen(){
  if(STATE) STATE._screen='interviewreaction';
  setHTML(`
    ${riderHeaderHTML()}
    <div class="card">
      <h1 class="h1-as-h2">📱 ${tf('publicReactions','Réactions du public')}</h1>
      <p class="narrative-text" style="font-style:italic;">${STATE.pendingInterviewReaction}</p>
    </div>
    <button class="btn" onclick="nextAfterRaceResult()">${tf('continue','Continuer')}</button>
  `);
}

function beginRaceOrFinish(){
  if(STATE.runRaceIdx >= STATE.runQueue.length){ finishSeason(); }
  else { beginRace(); }
}

function nextAfterRaceResult(){
  STATE.runRaceIdx++;
  maybeShowMidSeasonPersonalEvent();
}
