/* ---- Fin de carrière ---- */

function goCareerEnd(reason){
  STATE.rider.retired = true;
  STATE.rider.retireReason = reason || 'age';
  trackEvent('career_end', { reason: reason || 'age', seasons: STATE.rider ? STATE.rider.season : undefined });
  if(STATE.rider.isMentor && STATE.rider.teammate){
    addJournalEntry(STATE.rider, `🧑‍🏫 ${tf('mentorFarewellPrefix','Dernière saison en tant que mentor de')} ${STATE.rider.teammate.name} — ${tf('mentorFarewellSuffix',"la transmission s'achève, le relais est passé.")}`);
  }
  checkCareerAchievements(STATE.rider);
  recordCareer(STATE.rider);
  checkSessionAchievements(STATE.rider);
  renderCareerEnd();
}

function renderCareerEnd(){
  const r = STATE.rider;
  const title = legacyTitle(r);
  const wins = r.palmares.filter(p=>p.tier==='victoire');
  const podiums = r.palmares.filter(p=>p.tier==='podium');
  const top = topCareers(5);
  const injuryNoteData = STATE.injuryEndNote;
  STATE.injuryEndNote = null;
  const injuryNote = injuryNoteData ? `${causeLabelFor(injuryNoteData.cause)} ${tf('severe','grave')} ${tf('duringRace','lors de')} "${injuryNoteData.raceName}" — ${tf('careerEndsPrematurely',"fin de carrière prématurée.")}` : null;
  // Badge défi
  const cr = window._creation || {};
  let challengeBadgeHTML = '';
  if(cr.challengeMode && cr.challengeObj){
    const success = (() => { try { return cr.challengeObj.check(r); } catch(e){ return false; } })();
    const color = success ? 'var(--green-dark,#1a7a3c)' : 'var(--red,#c0392b)';
    const icon = success ? tf('challengeAchieved','✅ Défi relevé !') : tf('challengeFailed','❌ Défi échoué');
    challengeBadgeHTML = `<div class="card" style="border:2px solid ${color};background:${success?'var(--green-light)':'var(--red-light)'};text-align:center;">
      <p style="font-size:1.2rem;font-weight:800;color:${color};margin:0;">${icon}</p>
      <p class="small" style="margin:4px 0 0;">🎯 ${cr.challengeObj.label}</p>
    </div>`;
  }
  setHTML(`
    ${heroHTML('🎬 '+tf('careerEnd','Fin de carrière'))}
    ${challengeBadgeHTML}
    ${trophyBannerHTML()}
    ${injuryNote ? `<div class="card" style="border:1.5px solid var(--red);background:var(--red-light);"><p><strong>⛑️ ${injuryNote}</strong></p></div>` : ''}
    <div class="card center">
      <h2>${r.name}</h2>
      <p class="small">${COUNTRIES.find(c=>c.code===r.countryCode).flag} ${COUNTRIES.find(c=>c.code===r.countryCode).name} · ${STYLES.find(s=>s.id===r.styleId).name}</p>
      <p class="result-tier tier-victoire" style="font-size:1.6rem;">${title}</p>
      <p class="small">${r.season-1} ${tf('proSeasons','saisons professionnelles')} · ${tf('retiredAt','Retraite à')} ${r.age} ${tf('yo','ans')} · ${currentTeam(r).name}</p>
    </div>
    <div class="card">
      <h3>📖 ${tf('highlights','Les moments forts')}</h3>
      ${careerHighlights(r).map(h=>`<p class="narrative-text" style="margin:8px 0;">${h}</p>`).join('')}
    </div>
    <div class="card">
      <h3>${tf('palmares','Palmarès')} (🏆 ${wins.length} ${tf(wins.length!==1?'winsP':'win','victoire'+(wins.length!==1?'s':''))}, 🥈 ${podiums.length} ${tf(podiums.length!==1?'podiumsP':'podium','podium'+(podiums.length!==1?'s':''))})</h3>
      ${(r.nationalTitles||r.olympicGold||r.olympicSilver||r.olympicBronze) ? `<p class="small">${r.nationalTitles?`🏅 ${r.nationalTitles} ${tf(r.nationalTitles>1?'nationalTitlesP':'nationalTitle','titre'+(r.nationalTitles>1?'s':'')+' de champion national')}`:''}${r.nationalTitles&&(r.olympicGold||r.olympicSilver||r.olympicBronze)?' · ':''}${r.olympicGold?`🥇×${r.olympicGold} `:''}${r.olympicSilver?`🥈×${r.olympicSilver} `:''}${r.olympicBronze?`🥉×${r.olympicBronze}`:''}</p>` : ''}
      ${wins.length===0 ? `<p class="small">${tf('noWinsCareer','Aucune victoire en carrière.')}</p>` : wins.map(w=>`<div class="log-line">${tf('season','Saison')} ${w.season} — <strong>${w.raceName}</strong> ${badgeHTML(w.type)}</div>`).join('')}
    </div>
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;cursor:pointer;" onclick="const b=document.getElementById('careerEndDetailsBody'), a=document.getElementById('careerEndDetailsArrow'); const open = b.style.display!=='none'; b.style.display = open?'none':'block'; a.textContent = open?'${tf('expand','▼ Déplier')}':'${tf('collapse','▲ Replier')}';">
        <h3 style="margin:0;">${tf('moreDetails','Plus de détails')}</h3>
        <span class="small" id="careerEndDetailsArrow">${tf('expand','▼ Déplier')}</span>
      </div>
      <div id="careerEndDetailsBody" style="display:none;margin-top:10px;">
        <h3>${tf('finalStats','Statistiques en fin de carrière')}</h3>
        ${statBarsHTML(r.stats)}
        <h3 style="margin-top:16px;">💰 ${tf('financialRecap','Bilan financier')}</h3>
        <p class="small">${tf('fortuneAmassed','Fortune amassée sur la carrière')} : ${Math.round(r.money).toLocaleString('fr-FR')} €</p>
        ${rivalsCardHTML()}
        <h3 style="margin-top:16px;">🏆 ${tf('top5Careers','Top 5 des carrières de la partie')}</h3>
        ${top.map((c,i)=>`<div class="race-item"><div><strong>#${i+1} ${c.name}</strong><p class="small" style="margin:2px 0 0;">${legacyTitleText(c.title)}</p></div><span class="pill">${c.wins} 🏆</span></div>`).join('')}
        ${leaderboardCardHTML()}
      </div>
    </div>
    <button class="btn" onclick="openShareCard()">${tf('shareCareer','📤 Partager ma carrière')}</button>
    <button class="btn ghost" onclick="NAV_RETURN_TO='careerend';renderCareerJournal()">${tf('careerJournal','📖 Journal de carrière')}</button>
    <button class="btn ghost" onclick="confirmResetGame()">${tf('startNewCareer','Commencer une nouvelle carrière')}</button>
    <button class="btn ghost" onclick="renderChallenge()" style="border-color:var(--orange);color:var(--orange-dark);">🎯 ${tf('challengeMode','Mode défi')}</button>
    <button class="btn ghost" onclick="NAV_RETURN_TO='careerend';renderTrophiesScreen()">🏆 ${tf('viewMyTrophies','Voir mes trophées')} (${UNLOCKED.size}/${ACHIEVEMENTS.length})</button>
  `);
}

function renderCareerJournal(){
  const r = STATE.rider;
  /* Nom d'écran dédié en cours de run, même logique que renderSettingsScreen(). */
  if(NAV_RETURN_TO==='inrun') STATE._screen = 'careerjournal';
  const entries = (r.journal||[]).slice().sort((a,b)=>a.season-b.season);
  setHTML(`
    ${heroHTML('📖 '+tf('careerJournalTitle','Journal de carrière'), `${tf('journalDesc','Les temps forts de la carrière de')} ${r.name}, ${tf('seasonAfterSeason','saison après saison.')}`)}
    <div class="card">
      ${entries.length ? entries.map(e=>`<div class="race-item"><div><span class="pill">${tf('season','Saison')} ${e.season}</span><p style="margin:6px 0 0;">${e.text}</p></div></div>`).join('') : `<p class="small">${tf('quietCareer','Une carrière discrète, sans grand moment marquant enregistré ici.')}</p>`}
    </div>
    <button class="btn ghost" onclick="${NAV_RETURN_TO==='inrun'?'restoreNavReturnScreen()':'renderCareerEnd()'}">${NAV_RETURN_TO==='inrun'?tf('back','← Retour'):tf('backToRecap','← Retour au bilan')}</button>
  `);
}

function confirmResetGame(){
  setHTML(`
    <div class="card center">
      <h1 class="h1-as-h2">🆕 ${tf('newCareerConfirmTitle','Commencer une nouvelle carrière ?')}</h1>
      <p>${tf('newCareerConfirmDesc',"Cet emplacement sera libéré pour la nouvelle carrière — la carrière que tu viens de terminer restera consultable depuis le Palmarès des légendes, mais son bilan détaillé (journal, palmarès complet) sera effacé de cet emplacement, sans possibilité de revenir en arrière.")}</p>
      <button class="btn" onclick="resetGame()">${tf('confirmNewCareer','Confirmer — nouvelle carrière')}</button>
      <button class="btn ghost" onclick="renderCareerEnd()">${tf('cancel','← Annuler')}</button>
    </div>
  `);
}

function resetGame(){
  STATE = null;
  window._creation = {name:'', country: COUNTRIES[0].code, style:null};
  if(CURRENT_SLOT !== null) SLOTS[CURRENT_SLOT] = null;
  /* CURRENT_SLOT reste sur ce même emplacement (ne pas le repasser à null) : c'est lui
     qui indique où sauvegarder la prochaine carrière une fois la création terminée
     (confirmCreation() ne réassigne jamais de slot lui-même). saveGame() sait
     désormais écrire null tant que STATE est vide, plutôt que {state:null,...}. */
  renderCreationScreen();
}

