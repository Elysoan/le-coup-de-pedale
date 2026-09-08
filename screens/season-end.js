/* ---- Fin de saison ---- */

function finishSeason(){
  if(STATE._seasonEnding) return; // garde contre double-tap / appel en boucle
  if(!STATE.seasonSummary){ renderSeasonSetupScreen(); return; } // état incohérent : repartir proprement
  STATE._seasonEnding = true;
  const _remainingImposed = (STATE.runQueue||[]).slice(STATE.runRaceIdx||0).filter(rc=>(STATE.imposedRaceIds||[]).includes(rc.id)).length;
  if(_remainingImposed > 0){
    trackEvent('mid_season_abandon', { season_number: STATE.rider ? STATE.rider.season : undefined, races_remaining: _remainingImposed });
  } else {
    trackEvent('season_end', { season_number: STATE.rider ? STATE.rider.season : undefined });
  }
  const rider = STATE.rider;
  const completedSeason = rider.season;
  const results = STATE.seasonSummary.results;
  const repStart = STATE.seasonSummary.repStart;
  const rankStart = STATE.seasonSummary.rankStart;
  const ratingStart = STATE.seasonSummary.ratingStart;
  const statsStart = STATE.seasonSummary.statsStart;
  endSeasonAging(rider, STATE.trainingFocus);
  /* Tracker les saisons dans le top 50 pour le career cap 'top50-trois-saisons' */
  if(rider.worldRank <= 50) rider._top50Seasons = (rider._top50Seasons||0) + 1;
  /* Rivaux qui progressent : ajuster leur force selon le niveau du joueur.
     Si le joueur est top 50, les rivaux s'améliorent pour rester menaçants.
     Si le joueur régresse, les rivaux stagnent légèrement.
     On vise que les rivaux restent toujours légèrement en dessous du joueur
     pour que les duels restent crédibles mais pas écrasants. */
  if(STATE.rivals && STATE.rivals.length){
    const _targetStrength = clamp(40 + (100 - rider.worldRank) * 0.35, 30, 82);
    STATE.rivals.forEach(rv => {
      const _delta = (_targetStrength - rv.strength) * 0.25 + (Math.random()*4 - 2);
      rv.strength = clamp(rv.strength + _delta, 25, 85);
      rv.age = (rv.age!=null ? rv.age : 24) + 1;
    });
    /* Retraite des rivaux : au-delà de 34 ans, une chance croissante de raccrocher
       chaque saison — pour qu'un rival ne reste pas indéfiniment le même sur 15
       saisons. Un remplaçant plus jeune émerge aussitôt pour garder le trio complet. */
    const _retiring = STATE.rivals.filter(rv => rv.age>=34 && Math.random() < clamp((rv.age-33)*0.12, 0, 0.85));
    if(_retiring.length){
      STATE.rivals = STATE.rivals.filter(rv => !_retiring.includes(rv));
      STATE.rivalRetirementNotes = _retiring.map(rv=>{
        const rec = STATE.rivalRecords[rv.name] || {wins:0, losses:0};
        /* Nettoyer le bilan du rival retraité : sinon mostRivaledName() peut continuer à
           le désigner comme "le plus affronté" et déclencher des évènements narratifs à
           son sujet alors qu'il a quitté le peloton. */
        delete STATE.rivalRecords[rv.name];
        return {name: rv.name, countryCode: rv.countryCode, wins: rec.wins, losses: rec.losses};
      });
      const _others = COUNTRIES.filter(c=>c.code!==rider.countryCode);
      _retiring.forEach(()=>{
        const _usedNames = new Set(STATE.rivals.map(rv=>rv.name).concat([rider.name]));
        const _c = _others[Math.floor(Math.random()*_others.length)];
        const _newRival = makeRival(_c.code, _usedNames, {strengthBase:30, strengthMax:55, age:19+Math.floor(Math.random()*4)});
        STATE.rivals.push(_newRival);
        STATE.rivalRecords[_newRival.name] = {wins:0, losses:0};
      });
    }
  }
  rider.season = completedSeason + 1;
  rider.contractYearsLeft = Math.max(0, rider.contractYearsLeft - 1);
  STATE.injuryAbsenceRemaining = 0;
  const salary = salaryForSeason(rider);
  rider.money += salary;
  STATE.lastSalary = salary;

  /* Objectif de saison : bonus/malus selon tenu ou raté, avec sévérité graduée. */
  STATE.objectiveNote = null;
  const obj = STATE.seasonObjective;
  if(obj && obj!=='aucun'){
    const objDef = SEASON_OBJECTIVES.find(o=>o.id===obj);
    let met = null; // true = tenu, false = raté, null = non évaluable (course non couru)
    if(obj==='survive'){
      met = !results.some(x=>x.bestTier==='abandon'||x.bestTier==='forfait');
    } else if(obj==='top10'){
      const attempted = results.some(x=>x.prestige>=3);
      if(attempted) met = results.some(x=>x.prestige>=3 && (x.bestTier==='victoire'||x.bestTier==='podium'||x.bestTier==='top10'));
    } else if(obj==='podium'){
      const attempted = results.some(x=>x.prestige>=3);
      if(attempted) met = results.some(x=>x.prestige>=3 && (x.bestTier==='victoire'||x.bestTier==='podium'));
    } else if(obj==='etapes'){
      const stepRaces = results.filter(x=>x.type==='grandtour'||x.type==='semitour');
      if(stepRaces.length) met = stepRaces.some(x=>x.bestTier==='victoire'||x.bestTier==='podium');
    } else if(obj==='victoire'){
      const attempted = results.some(x=>x.prestige>=3);
      if(attempted) met = results.some(x=>x.prestige>=3 && x.bestTier==='victoire');
    } else if(obj==='monument'){
      const attempted = results.some(x=>x.prestige>=4);
      if(attempted) met = results.some(x=>x.prestige>=4 && x.bestTier==='victoire');
    } else if(obj==='solide'){
      met = !results.some(x=>x.bestTier==='abandon'||x.bestTier==='forfait');
    }

    const severity = objDef ? (objDef.severity||1) : 1;
    const objLabel = (SETTINGS.lang==='en' && objDef?.labelEN) ? objDef.labelEN : (objDef?.label||obj);

    if(met===true){
      /* Bonus selon sévérité : objectif majeur = plus gratifiant */
      const repBonus = severity===3 ? 6 : severity===2 ? 4 : 2;
      rider.reputation = clamp(rider.reputation + repBonus, 0, 100);
      rider.teamConfidence = clamp(rider.teamConfidence + (severity*3), 0, 100);
      STATE.objectiveNote = {ok:true, text:`${tf('objectiveWord','Objectif')} "${objLabel}" ${tf('objectiveMetText',"tenu — l'équipe est satisfaite.")}`, severity};
    } else if(met===false){
      /* Malus punitif selon sévérité */
      const repMalus  = severity===3 ? 10 : severity===2 ? 6  : 3;
      const confMalus = severity===3 ? 20 : severity===2 ? 12 : 5;
      rider.reputation    = clamp(rider.reputation    - repMalus,  0, 100);
      rider.teamConfidence = clamp(rider.teamConfidence - confMalus, 0, 100);
      /* Contrat raccourci si objectif majeur raté et contractYearsLeft > 1 */
      let contractCut = false;
      if(severity===3 && rider.contractYearsLeft > 1){
        rider.contractYearsLeft--;
        contractCut = true;
      }
      const missedSuffix = contractCut
        ? tf('objectiveMissedContract',"pas rempli — la direction reconsidère ton contrat. −1 saison.")
        : tf('objectiveMissedText','pas rempli — la direction est mécontente.');
      STATE.objectiveNote = {ok:false, text:`${tf('objectiveWord','Objectif')} "${objLabel}" ${missedSuffix}`, severity, contractCut};
    }
  }
  STATE.seasonObjective = null;

  /* Stagnation publique : si le coureur a une réputation établie (>30) mais n'a
     obtenu aucun résultat notable (aucun top10 sur prestige ≥ 2), le peloton et
     la presse commencent à questionner son niveau. Malus léger mais réel. */
  const hasNotableResult = results.some(r => r.bestTier !== 'peloton' && r.bestTier !== 'jourssans' && r.bestTier !== 'forfait' && r.bestTier !== 'abandon' && r.prestige >= 2);
  if(!hasNotableResult && rider.reputation > 30){
    const stagnationMalus = Math.round(rider.reputation * 0.04); // ~4% de la rep actuelle
    rider.reputation = clamp(rider.reputation - stagnationMalus, 0, 100);
    if(!STATE.objectiveNote){
      STATE.objectiveNote = {ok:false, text:tf('stagnationNote','Saison discrète — ton niveau est questionné dans le peloton.'), severity:1};
    }
  }

  /* Défi secondaire optionnel : petite récompense si relevé et réussi. */
  STATE.challengeNote = null;
  if(STATE.sideChallengeActive && STATE.sideChallenge){
    const c = STATE.sideChallenge;
    const success = c.check(results, rider, !!STATE.hadInjuryThisSeason);
    if(success){
      if(c.reward.money) rider.money += c.reward.money;
      if(c.reward.reputation) rider.reputation = clamp(rider.reputation + c.reward.reputation, 0, 100);
      const chLabel = (SETTINGS.lang==='en' && c.labelEN) ? c.labelEN : c.label;
      STATE.challengeNote = {ok:true, text:`${tf('challengeWord','Défi')} "${chLabel}" ${tf('challengeMetText','relevé avec succès !')}`};
    } else {
      const chLabel = (SETTINGS.lang==='en' && c.labelEN) ? c.labelEN : c.label;
      STATE.challengeNote = {ok:false, text:`${tf('challengeWord','Défi')} "${chLabel}" ${tf('challengeMissedText','pas atteint cette fois.')}`};
    }
  }
  STATE.sideChallenge = null;
  STATE.sideChallengeActive = false;
  STATE.hadInjuryThisSeason = false;

  /* Rôle de mentor : progression passive de la complicité avec le coéquipier et un peu
     de réputation chaque saison — le peloton respecte ce rôle de transmission. */
  if(rider.isMentor && rider.teammate){
    rider.teammate.bond = clamp(rider.teammate.bond + 3, 0, 100);
    rider.reputation = clamp(rider.reputation + 1, 0, 100);
  }

  /* Sponsor personnel : versement, décompte de la durée, et rupture si "exigeant" et
     aucun podium (ou mieux) obtenu cette saison. */
  STATE.sponsorNote = null;
  STATE.lastSponsorPay = 0;
  if(rider.sponsor){
    STATE.lastSponsorPay = rider.sponsor.pay;
    rider.money += rider.sponsor.pay;
    const hadPodiumOrBetter = results.some(x=>(x.bestTier==='victoire' || x.bestTier==='podium') && x.prestige>=3);
    if(rider.sponsor.personality==='exigeant' && !hadPodiumOrBetter){
      STATE.sponsorNote = {type:'dropped', name:rider.sponsor.name, icon:rider.sponsor.icon};
      rider.sponsor = null;
    } else {
      rider.sponsor.seasonsLeft--;
      if(rider.sponsor.seasonsLeft<=0){
        STATE.sponsorNote = {type:'ended', name:rider.sponsor.name, icon:rider.sponsor.icon};
        rider.sponsor = null;
      }
    }
  }

  if(STATE.rivals){
    STATE.rivals.forEach(rv=>{ rv.strength = clamp(rv.strength + (Math.random()*3-0.5), 20, 95); });
  }

  STATE.careerCapNote = null;
  if(rider.careerCap){
    const capDef = CAREER_CAP_TYPES.find(c=>c.id===rider.careerCap.type);
    const capLabel = (SETTINGS.lang==='en' && capDef.labelEN) ? capDef.labelEN : capDef.label;
    if(checkCareerCapCondition(rider, rider.careerCap.type)){
      rider.reputation = clamp(rider.reputation + 8, 0, 100);
      STATE.careerCapNote = {ok:true, text:`${capLabel} — ${tf('careerCapAchievedSuffix','cap de carrière atteint ! (+8 réputation)')}`};
      rider.careerCap = null;
    } else if(completedSeason >= rider.careerCap.deadlineSeason){
      STATE.careerCapNote = {ok:false, text:`${capLabel} — ${tf('careerCapMissedSuffix','cap de carrière manqué, la date limite est dépassée.')}`};
      rider.careerCap = null;
    }
    // Sinon, le cap reste actif silencieusement — pas encore de date limite atteinte.
  }

  /* Stocker l'entrée d'historique saisonnier */
  if(!rider.seasonHistory) rider.seasonHistory = [];
  rider.seasonHistory.push({
    season: completedSeason,
    teamName: currentTeam(rider).name,
    wins: results.filter(x=>x.bestTier==='victoire').length,
    podiums: results.filter(x=>['victoire','podium'].includes(x.bestTier)).length,
    rep: Math.round(rider.reputation),
    worldRank: rider.worldRank,
    races: results.length,
  });

  checkSeasonAchievements(results);
  STATE.seasonRecapData = {seasonNum: completedSeason, results, repStart, rankStart, ratingStart, statsStart};
  renderSeasonRecap();
}

function renderSeasonRecap(){
  if(STATE) STATE._screen='seasonrecap';
  const {seasonNum, results, repStart, rankStart, ratingStart, statsStart} = STATE.seasonRecapData;
  const r = STATE.rider;
  const team = currentTeam(r);
  const wins = results.filter(x=>x.bestTier==='victoire').length;
  const podiums = results.filter(x=>x.bestTier==='podium').length;
  const repChange = Math.round(r.reputation - repStart);
  const rankChange = (typeof rankStart==='number') ? (rankStart - r.worldRank) : null; // positif = progression
  const ratingChange = (typeof ratingStart==='number') ? (globalRiderRating(r.stats) - ratingStart) : null;
  const seasonsPlayed = r.season - 1;
  /* L'âge est déterministe (départ 19-21 ans, +1/saison) : avec un plafond de 15 saisons,
     un coureur atteint au maximum 33-35 ans. Un seuil d'âge fixé au-delà de cette borne ne
     se déclencherait jamais — on le place donc juste sous elle, pour qu'il reste un vrai
     déclencheur (plus précoce que le plafond de saisons) pour les coureurs partis le plus tard. */
  const forcedByAge = r.age >= 33;
  const forcedBySeasons = seasonsPlayed >= 15;
  const forcedRetire = forcedByAge || forcedBySeasons;
  const canRetire = r.age >= 30;
  const contractOver = r.contractYearsLeft <= 0;

  /* Hint recrutement : signale discrètement quand des équipes supérieures sont à portée
     même si le contrat court encore — pour que le joueur sache que ça bouge. */
  const _currentTierIdx = TEAM_TIER_ORDER[currentTeam(r).tier] || 0;
  /* Même bonus de portée que offersForRider() : un globetrotter a accès à +2 paliers,
     pas seulement +1 — sinon ce hint ignore des équipes réellement accessibles à la
     prochaine négociation pour cette trajectoire. */
  const _tierReach = (r.trajectory === 'globetrotter' ? 2 : 1) + ((STATE.seasonWorldMods && STATE.seasonWorldMods.recruitmentBonus) || 0);
  const _nextTierTeams = TEAMS.filter(t =>
    TEAM_TIER_ORDER[t.tier] > _currentTierIdx && TEAM_TIER_ORDER[t.tier] <= _currentTierIdx + _tierReach && t.minRep <= r.reputation + 10
  );
  const _contractLeftStr = r.contractYearsLeft > 1
    ? `encore ${r.contractYearsLeft} saisons`
    : `encore 1 saison`;
  const _contractLeftStrEN = r.contractYearsLeft > 1
    ? `${r.contractYearsLeft} seasons left`
    : `1 season left`;
  const recruitHintHTML = (!contractOver && !forcedRetire && _nextTierTeams.length > 0) ? `
    <div class="card" style="border-left:4px solid var(--green);background:var(--green-light);">
      <p style="margin:0;font-size:0.9rem;">📈 <strong>${SETTINGS.lang==='en'
        ? 'Higher-level teams are showing interest in you.'
        : "Des équipes de niveau supérieur s'intéressent à toi."}</strong> ${SETTINGS.lang==='en'
        ? `Your contract with ${currentTeam(r).name} has ${_contractLeftStrEN}, but keep this in mind for your next contract negotiation.`
        : `Ton contrat avec ${currentTeam(r).name} court ${_contractLeftStr}, mais garde ça en tête pour la prochaine fin de contrat.`}</p>
    </div>` : '';

  const sponsorNote = STATE.sponsorNote;
  const sponsorNoteHTML = sponsorNote ? `<div class="card" style="border:1.5px solid var(--red);background:var(--red-light);">
    <p style="margin:0;"><strong>${sponsorNote.icon} ${sponsorNote.name}</strong> ${sponsorNote.type==='dropped'
      ? tf('sponsorDropped',"met fin au contrat, faute de résultats à la hauteur de ses attentes cette saison.")
      : tf('sponsorEnds',"arrive au terme de son contrat — à renouveler ou remplacer.")}</p>
  </div>` : '';
  const rivalRetireNotes = STATE.rivalRetirementNotes || [];
  const rivalRetireHTML = rivalRetireNotes.map(rn=>{
    const country = COUNTRIES.find(c=>c.code===rn.countryCode);
    const record = (rn.wins>0 || rn.losses>0)
      ? ` ${tf('headToHeadRecord','Bilan face à toi')} : ${rn.wins}${tf('winAbbr','V')}-${rn.losses}${tf('lossAbbr','D')}.`
      : '';
    return `<div class="card" style="border:1.5px solid var(--purple);background:var(--purple-light);">
      <p style="margin:0;"><strong>🏁 ${country?country.flag+' ':''}${rn.name}</strong> ${tf('rivalRetires','prend sa retraite après une longue carrière.')}${record}</p>
      <p class="small" style="margin:4px 0 0;">${tf('newRivalEmerges','Un nouveau rival émerge dans le peloton.')}</p>
    </div>`;
  }).join('');
  STATE.rivalRetirementNotes = null;
  const objNote = STATE.objectiveNote;
  const objNoteHTML = objNote ? `<div class="card" style="border:1.5px solid ${objNote.ok?'var(--green)':'var(--red)'};background:${objNote.ok?'var(--green-light)':'var(--red-light)'};">
    <p style="margin:0;"><strong>${objNote.ok?tf('objectiveMet','🎯 Objectif tenu — '):tf('objectiveMissed','🎯 Objectif manqué — ')}</strong>${objNote.text}</p>
  </div>` : '';
  STATE.objectiveNote = null;
  const chNote = STATE.challengeNote;
  const chNoteHTML = chNote ? `<div class="card" style="border:1.5px solid ${chNote.ok?'var(--green)':'var(--line)'};background:${chNote.ok?'var(--green-light)':'var(--surface-alt)'};">
    <p style="margin:0;"><strong>${chNote.ok?tf('challengeMet','🎲 Défi réussi — '):tf('challengeMissed','🎲 Défi manqué — ')}</strong>${chNote.text}</p>
  </div>` : '';
  STATE.challengeNote = null;
  const capNote = STATE.careerCapNote;
  const capNoteHTML = capNote ? `<div class="card" style="border:1.5px solid ${capNote.ok?'var(--green)':'var(--line)'};background:${capNote.ok?'var(--green-light)':'var(--surface-alt)'};">
    <p style="margin:0;"><strong>${capNote.ok?tf('careerCapMet','🚩 '):tf('careerCapMissed','🚩 ')}</strong>${capNote.text}</p>
  </div>` : '';
  STATE.careerCapNote = null;
  setHTML(`
    <div class="screen-hero">
      <p class="kicker">${tf('recap','Bilan')} — ${tf('season','Saison')} ${seasonNum}</p>
      <h1>${r.name.toUpperCase()}</h1>
      <p>${team.name} · ${r.age} ${tf('yo','ans')}${(()=>{ const _s=STYLES.find(s=>s.id===r.styleId); return _s?` · ${_s.name}`:''; })()}</p>
    </div>
    ${riderHeaderHTML()}
    ${trophyBannerHTML()}
    ${tipBox('season-recap', "Réputation et confiance d'équipe (en haut) sont tes deux jauges clés : la confiance protège ton contrat après une saison difficile, mais si ta réputation retombe sous le seuil exigé par ton équipe, le renouvellement n'est plus garanti.", tf('tipSeasonRecap'))}
    ${objNoteHTML}
    ${chNoteHTML}
    ${capNoteHTML}
    ${sponsorNoteHTML}
    ${rivalRetireHTML}
    <div class="card">
      <h3>${tf('seasonResults','Résultats de la saison')}</h3>
      <div class="grid3">
        <div class="stat-tile"><span class="stat-tile-num" style="color:var(--yellow-dark);">${wins}</span><span class="stat-tile-label">${tf(wins!==1?'winsP':'win','victoire'+(wins!==1?'s':''))}</span></div>
        <div class="stat-tile"><span class="stat-tile-num" style="color:var(--blue);">${podiums}</span><span class="stat-tile-label">${tf(podiums!==1?'podiumsP':'podium','podium'+(podiums!==1?'s':''))}</span></div>
        <div class="stat-tile"><span class="stat-tile-num" style="color:${repChange>=0?'var(--green-dark)':'var(--red)'};">${repChange>=0?'+':''}${repChange}</span><span class="stat-tile-label">${tf('reputationWord','Réputation')}</span></div>
      </div>
      <p class="small" style="margin-top:10px;">💰 ${tf('salary','Salaire')} +${Math.round(STATE.lastSalary||0).toLocaleString('fr-FR')} €${STATE.lastSponsorPay?` · 🤝 ${tf('sponsor','Sponsor')} +${STATE.lastSponsorPay.toLocaleString('fr-FR')} €`:''}</p>
      ${results.map(x=>`<div class="race-item"><div><strong>${x.raceName}</strong></div>
        <span class="${tierClass(x.bestTier)} mono small">${TIER_LABEL[x.bestTier]}</span></div>`).join('')}
    </div>
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;cursor:pointer;" onclick="const b=document.getElementById('seasonRecapDetailsBody'), a=document.getElementById('seasonRecapDetailsArrow'); const open = b.style.display!=='none'; b.style.display = open?'none':'block'; a.textContent = open?'${tf('expand','▼ Déplier')}':'${tf('collapse','▲ Replier')}';">
        <h3 style="margin:0;">${tf('moreDetails','Plus de détails')}</h3>
        <span class="small" id="seasonRecapDetailsArrow">${tf('expand','▼ Déplier')}</span>
      </div>
      <div id="seasonRecapDetailsBody" style="display:none;margin-top:10px;">
        ${(rankChange!==null || ratingChange!==null) ? `
        <h3>📈 ${tf('progressVsLastSeason','Évolution par rapport à la saison précédente')}</h3>
        <div class="grid3">
          <div class="stat-tile"><span class="stat-tile-num" style="color:${repChange>0?'var(--green-dark)':repChange<0?'var(--red)':'var(--text-soft)'};">${repChange>=0?'+':''}${repChange}</span><span class="stat-tile-label">${tf('reputationWord','Réputation')}</span></div>
          <div class="stat-tile"><span class="stat-tile-num" style="color:${rankChange>0?'var(--green-dark)':rankChange<0?'var(--red)':'var(--text-soft)'};">${rankChange>=0?'+':''}${rankChange}</span><span class="stat-tile-label">🌍 ${tf('worldRankProgress','places au classement')}</span></div>
          <div class="stat-tile"><span class="stat-tile-num" style="color:${ratingChange>0?'var(--green-dark)':ratingChange<0?'var(--red)':'var(--text-soft)'};">${ratingChange>=0?'+':''}${Math.round(ratingChange)}</span><span class="stat-tile-label">${tf('overallRatingProgress','note globale')}</span></div>
        </div>` : ''}
        <h3 style="margin-top:16px;">${tf('newStats','Nouvelles statistiques')}</h3>
        ${statBarsHTML(r.stats, statsStart)}
      </div>
    </div>
    ${recruitHintHTML}
    ${forcedRetire ? `
      <div class="card center">
        <p>${forcedByAge
          ? `${tf('at','À')} ${r.age} ${tf('yo','ans')}, <strong>${r.name}</strong> ${tf('endsCareerAge','met un terme à sa carrière professionnelle.')}`
          : (team.tier==='WorldTour' || team.tier==='Équipe de légende')
            ? `${tf('after','Après')} ${seasonsPlayed} ${tf('seasonsAtTop',"saisons au plus haut niveau,")} <strong>${r.name}</strong> ${tf('endsCareerSeasons',"tire sa révérence et prend sa retraite.")}`
            : `${tf('after','Après')} ${seasonsPlayed} ${tf('seasonsCareerGeneric',"saisons de carrière professionnelle,")} <strong>${r.name}</strong> ${tf('endsCareerSeasons',"tire sa révérence et prend sa retraite.")}`}</p>
        <button class="btn" onclick="goCareerEnd('age')">${tf('viewCareerRecap','Voir le bilan de carrière')}</button>
      </div>
    ` : `
      ${contractOver
        ? `<button class="btn" onclick="renderContractScreen()">📋 ${tf('contractEndsWith','Fin de contrat avec')} ${team.name} — ${tf('negotiateNext','négocier la suite')}</button>`
        : `<button class="btn" onclick="startNewSeason()">${tf('restartSeason','Repartir pour la saison')} ${r.season} (${tf('contract','contrat')} ${team.name}, ${tf('stillSeasons','encore')} ${r.contractYearsLeft} ${tf(r.contractYearsLeft>1?'seasonsLeftBareP':'seasonsLeftBare','saison'+(r.contractYearsLeft>1?'s':''))})</button>`}
      ${canRetire ? `<button class="btn ghost" onclick="goCareerEnd('voluntary')">${tf('retire','Prendre sa retraite')}</button>` : ''}
    `}
  `);
}

/* ---- Fin de contrat ---- */

function renderContractScreen(keepState){
  if(STATE) STATE._screen='contractscreen';
  if(!keepState) STATE._pendingTeamChoice = null;
  const pendingTeam = STATE._pendingTeamChoice;
  const r = STATE.rider;
  const offers = offersForRider(r);
  const current = currentTeam(r);
  const renewed = offers.some(t=>t.id===current.id);
  setHTML(`
    ${heroHTML('📋 '+tf('contractEnd','Fin de contrat'))}
    ${riderHeaderHTML()}
    <div class="card">
      <p class="small">${renewed
        ? `${tf('contractEndsRenew','Ton contrat avec')} ${current.name} ${tf('contractEndsRenewEnd',"arrive à échéance. L'équipe souhaite discuter d'une prolongation, et d'autres formations se manifestent aussi.")}`
        : `${tf('contractEndsNoRenew','Ton contrat avec')} ${current.name} ${tf('contractEndsNoRenewEnd',"arrive à échéance et l'équipe ne te propose pas de prolongation : il est temps de signer ailleurs.")}`}</p>
    </div>
    ${offers.map(t=>{
      const duration = contractDurationFor(r, t);
      const offeredRole = computeOfferedRole(r, t);
      const offeredSalary = (() => {
        const tierBase = {'Continentale':8000,'ProTeam':18000,'WorldTour':38000,'Équipe de légende':70000}[t.tier] || 8000;
        const repBonus = Math.pow(r.reputation/100,1.6)*80000;
        const roleMult = ROLE_SALARY_MULT[offeredRole.id] || 1.0;
        return Math.round((tierBase+repBonus)*roleMult);
      })();
      const tierDesc = {
        'Continentale': tf('tierDescContinentale','Niveau 1 — Formation et courses régionales'),
        'ProTeam': tf('tierDescProTeam','Niveau 2 — Compétitions nationales et internationales'),
        'WorldTour': tf('tierDescWorldTour','Niveau 3 — Élite mondiale, grands tours'),
        'Équipe de légende': tf('tierDescLegende','Niveau 4 — Sommet absolu du cyclisme professionnel'),
      }[t.tier] || '';
      const isPending = pendingTeam === t.id;
      return `<div class="card team-card ${isPending?'selected':''}" onclick="selectTeamCard('${t.id}')">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <h2>🎽 ${t.name}</h2>
          <span class="pill">${teamTierLabel(t.tier)}</span>
        </div>
        <p class="small" style="margin:2px 0;color:var(--text-soft);font-style:italic;">${tierDesc}</p>
        <p class="small">${t.id===current.id?tf('renewalCurrent','Prolongation avec ton équipe actuelle'):tf('newEmployer','Nouvel employeur')} · ${tf('contractOf','contrat de')} ${duration} ${tf(duration>1?'seasonsBareP':'seasonsBare','saison'+(duration>1?'s':''))}. ${t.specialty?`${tf('specialty','Spécialité')} : ${STAT_ICONS[t.specialty]} ${STAT_LABELS[t.specialty]}.`:tf('generalistTeam','Équipe généraliste.')}</p>
        <p class="small"><strong>${offeredRole.icon} ${tf('roleOffered','Poste proposé')} : ${SETTINGS.lang==='en'?offeredRole.nameEN:offeredRole.name}</strong> · 💰 ${offeredSalary.toLocaleString('fr-FR')} €/${tf('seasonBare','saison')}</p>
        ${isPending ? `<p class="small" style="color:var(--warn);font-weight:700;margin-top:6px;">⚠️ ${tf('confirmTeamWarning','Clique à nouveau pour signer ce contrat.')}</p>` : ''}
      </div>`;
    }).join('')}
  `, keepState);
}

function selectTeamCard(teamId){
  if(STATE._pendingTeamChoice === teamId){ chooseTeam(teamId); return; }
  STATE._pendingTeamChoice = teamId;
  renderContractScreen(true);
}

/* Durée de contrat proposée : les équipes s'engagent plus longtemps avec les coureurs
   déjà bien installés (réputation élevée), sinon un contrat plus court et prudent. */
function contractDurationFor(rider, team){
  const base = 1 + Math.round(rider.reputation/45);
  return clamp(base + Math.floor(Math.random()*2), 1, 4);
}

function chooseTeam(teamId){
  const r = STATE.rider;
  const team = TEAMS.find(t=>t.id===teamId);
  const changed = teamId !== r.teamId;
  r.contractYearsLeft = contractDurationFor(r, team);
  r.teamId = teamId;
  r.teamConfidence = changed ? 55 : clamp(r.teamConfidence, 28, 100);
  r.role = computeOfferedRole(r, team).id;
  if(changed){
    r.teamChanges = (r.teamChanges||0) + 1;
    r.teammate = generateTeammate();
  }
  startNewSeason();
}

