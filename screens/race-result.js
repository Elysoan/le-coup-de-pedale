function synthesizeStageSummary(race, focus, tier){
  if(!race.days || race.days <= 1) return null;
  const styles = (focus||[]).map(f=>STAGE_TYPE_LABELS[f]).filter(Boolean);
  if(!styles.length) styles.push(tf('rollingStageDefault','étape roulante'));
  const pickStyle = ()=> styles[Math.floor(Math.random()*styles.length)];
  const usedDays = new Set();
  const pickDay = (maxDay)=>{
    let d, tries=0;
    do { d = 1 + Math.floor(Math.random()*maxDay); tries++; } while(usedDays.has(d) && tries<20);
    usedDays.add(d);
    return d;
  };
  const lines = [];
  if(tier==='victoire'){
    const extraWins = race.days>=5 ? Math.floor(race.days/4) : 0; // plus la course est longue, plus une domination peut se traduire par plusieurs étapes
    const winCount = 1 + Math.floor(Math.random()*(extraWins+1));
    for(let i=0;i<winCount;i++) lines.push({day:pickDay(race.days), style:pickStyle(), result:tf('stageWinResult',"Victoire d'étape")});
    if(race.days>=5 && Math.random()<0.4) lines.push({day:pickDay(race.days), style:pickStyle(), result:tf('stagePodiumResult',"Podium d'étape")});
  } else if(tier==='podium'){
    lines.push({day:pickDay(race.days), style:pickStyle(), result:tf('stagePodiumResult',"Podium d'étape")});
    if(race.days>=5) lines.push({day:pickDay(race.days), style:pickStyle(), result:tf('stageTop10Result','Top 10')});
  } else if(tier==='top10'){
    lines.push({day:pickDay(race.days), style:pickStyle(), result:tf('stageTop10Result','Top 10')});
  } else if(tier==='peloton'){
    lines.push({day:pickDay(race.days), style:pickStyle(), result:tf('stagePelotonResult','Dans le peloton')});
  } else if(tier==='jourssans'){
    lines.push({day:pickDay(race.days), style:pickStyle(), result:tf('stageHardDayResult','Jour difficile')});
  } else if(tier==='abandon'){
    lines.push({day:pickDay(Math.max(1,Math.ceil(race.days/2))), style:pickStyle(), result:tf('stageAbandonResult','Abandon en cours de course')});
  }
  return lines.sort((a,b)=>a.day-b.day);
}

function finalizeRace(){
  const race = STATE.runQueue[STATE.runRaceIdx];
  let bestTier;
  let bestPerf = STATE.runRaceAccum.length ? STATE.runRaceAccum[STATE.runRaceAccum.length-1].perf : 0;
  if(STATE.runRaceAccum.some(e=>e.tier==='abandon')){
    bestTier = 'abandon';
  } else if(STATE.runRaceAccum.length > 1){
    /* Plusieurs semaines : la médiane (pas la moyenne) détermine le classement général —
       une seule semaine exceptionnelle ne doit pas suffire à faire basculer tout le
       classement dans le palier supérieur si les autres semaines sont médiocres. Un grand
       tour se gagne sur la régularité, pas sur un coup d'éclat isolé. */
    const perfs = STATE.runRaceAccum.map(e=>e.perf).sort((a,b)=>a-b);
    const mid = Math.floor(perfs.length/2);
    const medianPerf = perfs.length%2 ? perfs[mid] : (perfs[mid-1]+perfs[mid])/2;
    bestPerf = medianPerf;
    if(medianPerf>=88) bestTier='victoire';
    else if(medianPerf>=72) bestTier='podium';
    else if(medianPerf>=55) bestTier='top10';
    else if(medianPerf>=32) bestTier='peloton';
    else bestTier='jourssans';
  } else {
    bestTier = STATE.runRaceAccum[0] ? STATE.runRaceAccum[0].tier : 'jourssans';
  }

  /* Résumé jour par jour, uniquement pour les courses à un seul évènement RÉEL mais qui
     durent plusieurs jours (les grands tours ont déjà leurs propres semaines réelles) —
     qu'il y ait eu ou non des phases bonus/rival injectées autour de cet unique évènement
     (sans ce filtre, leur seule présence supprimait à tort ce résumé "Jour X"). */
  const realEntries = STATE.runRaceAccum.filter(e=>!e.isBonus && !e.isRivalEvent);
  STATE.pendingStageSummary = (realEntries.length === 1)
    ? synthesizeStageSummary(race, realEntries[0].focus, bestTier)
    : null;

  /* Compteur de victoires d'étape en carrière : une semaine de grand tour remportée
     compte comme une victoire d'étape, tout comme un "Jour X : Victoire d'étape" du
     résumé synthétique ci-dessus — indépendant du résultat global de la course. Une
     phase bonus gagnée sur une course d'un seul jour (classique, critérium...) ne
     compte PAS comme victoire d'étape : il n'y a pas d'étape sur une course d'un jour. */
  if(race.days > 1 && STATE.runRaceAccum.length > 1){
    STATE.rider.stageWins += STATE.runRaceAccum.filter(e=>e.tier==='victoire').reduce((sum,e)=>sum + (e.perf>=105 ? 2 : 1), 0);
  } else if(STATE.pendingStageSummary){
    STATE.rider.stageWins += STATE.pendingStageSummary.filter(l=>l.result==="Victoire d'étape").length;
  }
  if(STATE.rider.stageWins>=1) unlockTrophy('premiere-etape');
  if(STATE.rider.stageWins>=20) unlockTrophy('centurion-etapes');

  /* La Confrérie de la Poisse : un clin d'œil à l'autodérision sportive, qui peut
     s'inviter après un abandon ou une défaite serrée dans les derniers mètres — quelle
     que soit la nationalité du coureur. Purement narratif, avec un tout petit effet sur
     le mental selon la façon dont le coureur encaisse la chose. */
  let poisseEvent = null;
  const nearMiss = STATE.runRaceAccum.some(e=>e.tier==='podium' && e.perf>=86);
  const knownEnough = STATE.rider.reputation >= 15;
  if(knownEnough && (bestTier==='abandon' || nearMiss) && Math.random() < 0.35){
    const picked = CONFRERIE_POISSE_EVENTS[Math.floor(Math.random()*CONFRERIE_POISSE_EVENTS.length)];
    poisseEvent = (SETTINGS.lang==='en') ? {
      icon: picked.icon, title: picked.titleEN, desc: picked.descEN, choiceLabel: picked.choiceLabelEN, effect: picked.effect,
    } : picked;
    const k = 'mental';
    STATE.rider.stats[k] = clamp(STATE.rider.stats[k] + poisseEvent.effect.mental, 10, 99);
  }
  STATE.pendingPoisseEvent = poisseEvent;

  /* Chasse à une classification annexe (maillot à pois / maillot vert) sur un grand tour :
     le résultat de la course devient celui de la classification visée, calculé sur la
     seule moyenne des semaines pertinentes (montagne pour le grimpeur, sprint/classiques
     pour le sprinteur) — pas sur l'ensemble du parcours comme pour le classement général. */
  let jerseyResult = null;
  if(bestTier !== 'abandon' && (STATE.raceRole==='grimpeur' || STATE.raceRole==='sprinteur') && race.events && race.events.length > 1){
    const wantFocuses = STATE.raceRole==='grimpeur' ? ['montagne'] : ['sprint','classiques'];
    const matching = STATE.runRaceAccum.filter((e,i)=>{
      const ev = race.events[i];
      return ev && ev.focus.some(f=>wantFocuses.includes(f));
    });
    const matchingWeeks = STATE.runRaceAccum.map((e,i)=>{
      const ev = race.events[i];
      return (ev && ev.focus.some(f=>wantFocuses.includes(f))) ? i+1 : null;
    }).filter(x=>x!==null);
    if(matching.length){
      const avgJersey = matching.reduce((s,e)=>s+e.perf, 0) / matching.length;
      let jTier;
      if(avgJersey>=88) jTier='victoire';
      else if(avgJersey>=72) jTier='podium';
      else if(avgJersey>=55) jTier='top10';
      else if(avgJersey>=32) jTier='peloton';
      else jTier='jourssans';
      jerseyResult = {type:STATE.raceRole, tier:jTier, weeksCount:matching.length, weeks:matchingWeeks};
      /* Le résultat de la classification annexe reste distinct du classement général —
         viser le maillot à pois ne doit ni gonfler ni pénaliser le classement final au
         général (ni la réputation/prime qui en découlent), qui reflète toujours la
         performance sur l'ensemble des semaines. */
    } else {
      jerseyResult = {type:STATE.raceRole, tier:null, weeksCount:0, weeks:[]};
    }
  } else if(bestTier !== 'abandon' && STATE.raceRole==='jeune' && race.events && race.events.length > 1){
    /* Le maillot blanc suit exactement le même calcul que le classement général
       (moyenne des semaines) — c'est juste réservé aux moins de 25 ans, pas un
       critère de performance différent. */
    jerseyResult = {type:'jeune', tier:bestTier, weeksCount:STATE.runRaceAccum.length, weeks:STATE.runRaceAccum.map((e,i)=>i+1)};
  }
  STATE.pendingJerseyResult = jerseyResult;

  /* En cas d'abandon, ne compter que les jours réellement courus (au prorata des
     évènements canoniques joués), pas la durée totale prévue de la course — sinon un
     abandon au jour 1 d'un grand tour de 21 jours gonflerait à tort la surcharge et la
     récupération pour le reste de la saison (cf. applyFatigue/applyInterRaceRecovery). */
  const _canonicalForDays = race._baseEventCount || race.events.length || 1;
  const _daysRacedThisRace = bestTier === 'abandon'
    ? Math.max(1, Math.round(race.days * Math.min(1, STATE.runEventIdx / _canonicalForDays)))
    : race.days;
  STATE.cumulativeDaysRaced = (STATE.cumulativeDaysRaced || 0) + _daysRacedThisRace;
  STATE.lastRacedMonth = race.month; // mémoriser le mois de la dernière course disputée
  const repGain = repGainFor(race, bestTier, STATE.rider.reputation, STATE.rider);
  let confDelta = confidenceDeltaFor(bestTier);
  if(STATE.domestiqueBonus){ confDelta += 5; STATE.domestiqueBonus = false; }
  STATE.rider.reputation = clamp(STATE.rider.reputation + repGain, 0, 100);
  STATE.rider.palmares.push({season:STATE.rider.season, raceName:race.name, raceId:race.id, type:race.type, tier:bestTier, prestige:race.prestige});
  recordGlobalRaceResult(race, bestTier, STATE.rider);
  updateWorldRank(STATE.rider, bestTier, race.prestige, bestPerf);

  /* Paiement différé d'une déclaration confiante en interview : si le résultat de
     cette course-ci n'est pas au moins un podium, la confiance affichée la dernière
     fois se retourne contre le coureur. */
  STATE.confidentBetNote = null;
  if(STATE.rider.pendingConfidentBet){
    STATE.rider.pendingConfidentBet = false;
    if(bestTier!=='victoire' && bestTier!=='podium'){
      STATE.rider.reputation = clamp(STATE.rider.reputation - 4, 0, 100);
      STATE.confidentBetNote = "Tes propos confiants après ta dernière victoire se retournent un peu contre toi après ce résultat plus terne.";
    }
  }

  STATE.rider.teamConfidence = clamp(STATE.rider.teamConfidence + confDelta, 0, 100);
  /* "Engouement exceptionnel des sponsors" (moneyBonus) : primes de course majorées,
     comme annoncé — géré ici plutôt que dans repGainFor qui ne touche qu'à la réputation. */
  const _moneyMult = (STATE.seasonWorldMods && STATE.seasonWorldMods.moneyBonus) || 1;
  const prize = Math.round(prizeForResult(race, bestTier) * _moneyMult);
  STATE.rider.money += prize;
  const teamPrize = checkTeamVictory(race, bestTier);
  if(race.id==='champnat' && bestTier==='victoire'){
    STATE.rider.isNationalChampion = true;
    STATE.rider.nationalTitles = (STATE.rider.nationalTitles||0) + 1;
    unlockTrophy('champion-national');
    addJournalEntry(STATE.rider, `🏅 ${tf('nationalChampionEntry','Champion national — victoire lors du championnat national.')}`);
  }
  if(race.olympic){
    /* La médaille doit correspondre à ce que le joueur voit réellement affiché (le tier),
       pas à un seuil séparé plus strict : sinon "Victoire !" avec confettis peut se
       terminer en simple médaille d'argent, ce qui n'a aucun sens. */
    if(bestTier==='victoire'){
      STATE.rider.olympicGold = (STATE.rider.olympicGold||0) + 1;
      unlockTrophy('or-olympique');
      addJournalEntry(STATE.rider, `🥇 ${tf('olympicChampionEntry','Champion olympique — sacre aux Jeux Panhelléniques.')}`);
    } else if(bestTier==='podium'){
      const perf = (STATE.runRaceAccum[0] && STATE.runRaceAccum[0].perf) || 0;
      if(perf>=80){
        STATE.rider.olympicSilver = (STATE.rider.olympicSilver||0) + 1;
        unlockTrophy('argent-olympique');
        addJournalEntry(STATE.rider, `🥈 ${tf('olympicSilverEntry',"Médaille d'argent aux Jeux Panhelléniques.")}`);
      } else {
        STATE.rider.olympicBronze = (STATE.rider.olympicBronze||0) + 1;
        unlockTrophy('bronze-olympique');
        addJournalEntry(STATE.rider, `🥉 ${tf('olympicBronzeEntry','Médaille de bronze aux Jeux Panhelléniques.')}`);
      }
    }
  }
  if(bestTier==='victoire' && race.prestige>=3){
    addJournalEntry(STATE.rider, `🏆 ${tf('victoryOnEntry','Victoire sur')} ${race.name}.`);
  }
  checkRaceAchievements(race, bestTier);
  if(jerseyResult && jerseyResult.tier==='victoire'){
    if(jerseyResult.type==='grimpeur') unlockTrophy('maillot-pois');
    else if(jerseyResult.type==='sprinteur') unlockTrophy('maillot-vert');
    else if(jerseyResult.type==='jeune') unlockTrophy('maillot-blanc');
  }
  checkRivalAppearance(race, bestTier);
  const rivalBeat = (STATE.pendingRivalNote && STATE.pendingRivalNote.won) ? STATE.pendingRivalNote.rivalName : null;
  STATE.seasonSummary.results.push({raceName:race.name, type:race.type, prestige:race.prestige, bestTier, repGain, buzz:!!race.buzz, rivalBeat, events:STATE.runRaceAccum.slice()});
  STATE.pendingBestPerf = bestPerf;
  renderRaceResult(race, bestTier, repGain, confDelta, prize, teamPrize);
}

/* Sur les courses prestigieuses, un rival de carrière peut être présent : son résultat
   est comparé au meilleur score du coureur sur cette course pour alimenter la rivalité. */
function checkRivalAppearance(race, bestTier){
  STATE.pendingRivalNote = null;
  if(!STATE.rivals || STATE.rivals.length===0) return;
  const assignedRivals = STATE.rivals.filter(rv=>(rv.raceIds||[]).includes(race.id));
  if(assignedRivals.length === 0) return;
  /* Priorité : utiliser la perf de la phase rival si elle existe dans runRaceAccum, et
     créditer le MÊME rival que celui nommé dans ce duel (rivalEntry.rivalName) — sinon,
     avec plusieurs rivaux présents dans la course, un tirage indépendant pourrait créditer
     un rival différent de celui réellement affronté dans le récit.
     Fallback (pas de duel direct) : tirage réactif favorisant le rival le plus fort, comparé
     à la meilleure perf globale du coureur. */
  const rivalEntry = STATE.runRaceAccum.find(e=>e.isRivalEvent);
  const rival = (rivalEntry && assignedRivals.find(rv=>rv.name===rivalEntry.rivalName))
    || pickReactiveRival(assignedRivals);
  let won;
  if(rivalEntry){
    won = rivalEntry.perf >= rivalDuelThreshold(rival.strength);
  } else {
    const rivalPerf = clamp(rival.strength + (Math.random()*30-15) + race.prestige*2, 0, 100);
    const playerPerf = Math.max(...STATE.runRaceAccum.map(e=>e.perf||0));
    won = playerPerf >= rivalPerf;
  }
  /* Un abandon ne peut jamais compter comme une victoire face au rival — bestTier est
     reçu justement pour ça, il ne doit pas rester ignoré. */
  if(bestTier==='abandon' || bestTier==='forfait') won = false;
  const rec = STATE.rivalRecords[rival.name] || {wins:0, losses:0};
  if(won) rec.wins++; else rec.losses++;
  STATE.rivalRecords[rival.name] = rec;
  STATE.pendingRivalNote = {rivalName: rival.name, won};
  if(rec.wins - rec.losses >= 5) unlockTrophy('bete-noire');
}

/* Couleur de célébration adaptée au maillot effectivement remporté — le jaune du
   classement général du Tour de Gaule n'est pas le rose du Giro, ni le vert d'un
   maillot de points ; par défaut (course "normale"), on reste sur le corail de la
   marque plutôt que d'inventer une couleur qui n'existe pas dans le vrai cyclisme. */

function renderRaceResult(race, bestTier, repGain, confDelta, prize, teamPrize){
  if(STATE) STATE._screen='raceresult';
  prize = prize || 0;
  teamPrize = teamPrize || 0;
  const injury = STATE.pendingInjury;
  STATE.pendingInjury = null;
  const jersey = STATE.pendingJerseyResult;
  STATE.pendingJerseyResult = null;
  const rivalNote = STATE.pendingRivalNote;
  STATE.pendingRivalNote = null;
  STATE.lastRivalName = rivalNote ? rivalNote.rivalName : null;
  let injuryBanner = '';
  let continueAttr = `onclick="nextAfterRaceResult()"`;
  let continueLabel = tf('continue','Continuer');

  if(injury){
    if(injury.severity==='legere'){
      injuryBanner = `<div class="card" style="border:1.5px solid var(--red);background:var(--red-light);">
        <p><strong>🩹 ${causeLabelFor(injury.cause)} — ${tf('minorInjury','blessure légère')}.</strong></p>
        <p class="small" style="font-style:italic;">${injuryReason(injury.cause)}</p>
        <p class="small">${tf('canRestartNext','Le coureur peut repartir dès la prochaine course du calendrier.')}</p>
      </div>`;
    } else if(injury.severity==='moderee'){
      const missCount = 1 + Math.floor(Math.random()*3);
      STATE.injuryAbsenceRemaining = missCount;
      injuryBanner = `<div class="card" style="border:1.5px solid var(--red);background:var(--red-light);">
        <p><strong>🚑 ${causeLabelFor(injury.cause)} — ${tf('seriousInjury','blessure plus sérieuse')}.</strong></p>
        <p class="small" style="font-style:italic;">${injuryReason(injury.cause)}</p>
        <p class="small">${tf('convalescenceNote','Convalescence : absence prévue sur les')} ${missCount} ${tf(missCount>1?'nextRacesP':'nextRace','prochaine'+(missCount>1?'s':'')+' course'+(missCount>1?'s':'')+' du calendrier.')}</p>
      </div>`;
    } else {
      injuryBanner = `<div class="card" style="border:1.5px solid var(--red);background:var(--red-light);">
        <p><strong>⛑️💔 ${causeLabelFor(injury.cause)} ${tf('severe','grave')}.</strong> ${tf('careerEndsHere',"Les examens médicaux sont sans appel : la carrière s'arrête ici.")}</p>
      </div>`;
      STATE.injuryEndNote = {cause: injury.cause, raceName: race.name};
      addJournalEntry(STATE.rider, `🚑 ${causeLabelFor(injury.cause)} ${tf('severe','grave')} ${tf('duringRace','lors de')} "${race.name}" — ${tf('careerEndsPrematurely',"fin de carrière prématurée.")}`);
      continueAttr = `onclick="goCareerEnd('injury')"`;
      continueLabel = tf('viewCareerRecap','Voir le bilan de carrière');
    }
  }

  const rivalBanner = rivalNote ? `<div class="card" style="border:1.5px solid var(--blue);background:#EAF2FA;">
    <p style="margin:0;"><strong>🥊 ${tf('rivalAlsoThere','Ton rival')} ${rivalNote.rivalName} ${tf('rivalAlsoThereEnd','était aussi sur cette course.')}</strong></p>
    <p class="small" style="margin:2px 0 0;">${rivalNote.won ? tf('finishAhead',"Tu termines devant lui.") : tf('finishBehind',"Il termine devant toi cette fois.")}</p>
  </div>` : '';

  const poisse = STATE.pendingPoisseEvent;
  STATE.pendingPoisseEvent = null;
  const poisseBanner = poisse ? `<div class="card" style="border:1.5px solid var(--purple);background:var(--purple-light);">
    <p style="margin:0;"><strong>${poisse.icon} ${poisse.title}</strong></p>
    <p class="small" style="margin:4px 0;">${poisse.desc}</p>
    <p class="small" style="font-style:italic;">${poisse.choiceLabel}</p>
  </div>` : '';

  const stageSummary = STATE.pendingStageSummary;
  STATE.pendingStageSummary = null;
  const stageSummaryHTML = stageSummary ? `<div class="small" style="margin:8px 0;">
      <strong>📋 ${tf('overTheDays','Sur les')} ${race.days} ${tf('daysOfRacing','jours de course :')}</strong>
      ${stageSummary.map(l=>`<div class="log-line">${tf('day','Jour')} ${l.day} (${l.style}) : ${l.result}</div>`).join('')}
    </div>` : '';

  let jerseyBanner = '';
  if(jersey){
    const jerseys = gtJerseys(race.id);
    const jerseyNames = {
      grimpeur: `${jerseys.kom.label} (${tf('bestClimber','meilleur grimpeur')})`,
      sprinteur: `${jerseys.points.label} (${tf('bestSprinter','meilleur sprinteur')})`,
      jeune: tf('whiteJerseyFull','maillot blanc (meilleur jeune)'),
    };
    const jerseyName = jerseyNames[jersey.type] || tf('secondaryClassification','classification annexe');
    if(jersey.tier===null){
      jerseyBanner = `<div class="card" style="border:1.5px solid var(--purple);background:var(--purple-light);">
        <p style="margin:0;"><strong>🎽 ${tf('chasingJersey','Chasse au')} ${jerseyName}</strong></p>
        <p class="small" style="margin:2px 0 0;">${tf('noSuitableStage',"Aucune étape adaptée à cet objectif n'était au programme cette année — résultat basé sur le classement général par défaut.")}</p>
      </div>`;
    } else {
      jerseyBanner = `<div class="card" style="border:1.5px solid var(--purple);background:var(--purple-light);">
        <p style="margin:0;"><strong>🎽 ${tf('objective','Objectif')} : ${jerseyName}</strong></p>
        <p class="small" style="margin:2px 0 0;">${tf('jerseyResult','Résultat sur ce maillot')} : <strong>${TIER_LABEL[jersey.tier]}</strong> — ${tf('basedOnWeeks','basé sur la/les semaine')}${jersey.weeksCount>1?'s':''} ${jersey.weeks.join(` ${tf('and','et')} `)} (${jersey.weeksCount} ${tf(jersey.weeksCount>1?'relevantP':'relevant','pertinente'+(jersey.weeksCount>1?'s':''))} ${tf('outOf','sur')} ${race.events.length}).</p>
      </div>`;
    }
  }

  const trainedList = STATE.runRaceAccum.filter(x=>x.trained).map(x=>x.trained);
  const detrainedList = STATE.runRaceAccum.filter(x=>x.detrained).map(x=>x.detrained);
  // weeklyRecap uniquement pour les grands tours (qui ont de vraies semaines à étapes) —
  // on exclut les phases bonus/rival injectées, qui ne sont pas des semaines à part entière.
  const gtRealWeeks = STATE.runRaceAccum.filter(x=>!x.isBonus && !x.isRivalEvent);
  const weeklyRecap = (race.type==='grandtour' && gtRealWeeks.length>1) ? `<div class="small" style="margin:6px 0;">
      ${gtRealWeeks.map((x,idx)=>`${tf('week','Semaine')} ${idx+1} : <span class="${tierClass(x.tier)}">${TIER_LABEL[x.tier]}</span>`).join(' · ')}
    </div>` : '';
  /* Les phases bonus/rival sont des moments tactiques DANS le même jour/évènement réel —
     pas des résultats séparés. Leur donner un badge de classement (Podium, Peloton...)
     n'aurait aucun sens : on ne peut pas être "sur le podium" pendant l'échauffement, et sur
     une course d'un jour il ne peut y avoir qu'un seul résultat final (déjà affiché plus
     haut). Elles influencent bien le score global (cf. bestTier), mais ici on se contente de
     rappeler narrativement le choix fait à chaque moment, sans classement par moment. */
  const bonusMoments = STATE.runRaceAccum.filter(x=>x.isBonus || x.isRivalEvent);
  const phaseRecap = (race.type!=='grandtour' && bonusMoments.length>0) ? `<div class="small" style="margin:6px 0;">
      <strong>📋 ${tf('raceMoments','Temps forts de la course :')}</strong>
      ${bonusMoments.map(x=>`<div class="log-line">${x.title||tf('mainPhase','Phase principale')} — ${x.choiceLabel}</div>`).join('')}
    </div>` : '';
  const cardClass = bestTier==='victoire' ? 'tier-win' : (bestTier==='podium' ? 'tier-podium-card' : '');
  const tierPopClass = (bestTier==='victoire' || bestTier==='podium') ? 'pop' : '';
  const theme = celebrationTheme(race, bestTier, jersey);
  const confettiRow = bestTier==='victoire' ? `<div class="confetti-row">${theme.emoji}🏆${theme.emoji}</div>` : '';
  const cardStyle = bestTier==='victoire' ? `style="border-color:${theme.hex};background:linear-gradient(135deg, ${theme.hex}22, var(--surface) 60%);"` : '';

  /* Une victoire marquante (course de prestige) déclenche une brève interview
     d'après-course, sauf si une blessure grave a déjà orienté vers la fin de carrière. */
  if(bestTier==='victoire' && race.prestige>=2 && continueLabel===tf('continue','Continuer')){
    continueAttr = `onclick="renderInterviewScreen()"`;
  }

  const confidentBetBanner = STATE.confidentBetNote ? `<div class="card" style="border:1.5px solid var(--red);background:var(--red-light);">
    <p style="margin:0;font-style:italic;">🎤 ${STATE.confidentBetNote}</p>
  </div>` : '';
  STATE.confidentBetNote = null;

  setHTML(`
    ${riderHeaderHTML()}
    ${trophyBannerHTML()}
    <div class="card result-card ${cardClass}" ${cardStyle}>
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <h2>${race.flag?race.flag+' ':''}${race.name}</h2>
        ${badgeHTML(race.type)}
      </div>
      ${confettiRow}
      <p class="result-tier ${tierPopClass} ${tierClass(bestTier)}">${TIER_LABEL[bestTier]}</p>
      <p class="narrative-text">${tierNarrative(bestTier)}</p>
      <p class="small">🏁 ${tf('finalRanking','Classement')} : ${estimatePlacement(bestTier, STATE.pendingBestPerf)}</p>
      ${stageSummaryHTML}
      ${weeklyRecap}
      ${phaseRecap}
      ${trainedList.map(k=>`<p class="small">📈 ${STAT_LABELS[k]} ${tf('statUp','en hausse')}</p>`).join('')}
      ${detrainedList.map(k=>`<p class="small">📉 ${STAT_LABELS[k]} ${tf('statDown','en baisse')}</p>`).join('')}
      <hr class="divider" style="border:none;border-top:1px dashed var(--line);">
      <div class="grid3" style="${prize>0?'grid-template-columns:1fr 1fr;gap:10px;':''}">
        <div class="stat-tile"><span class="stat-tile-num" style="color:${repGain>=0?'var(--green-dark)':'var(--red)'};">${repGain>=0?'+':''}${repGain}</span><span class="stat-tile-label">${tf('reputationWord','Réputation')}</span></div>
        <div class="stat-tile"><span class="stat-tile-num" style="color:${confDelta>=0?'var(--green-dark)':'var(--red)'};">${confDelta>=0?'+':''}${confDelta}</span><span class="stat-tile-label">${tf('confidenceWord','Confiance')}</span></div>
        <div class="stat-tile"><span class="stat-tile-num">${Math.round(STATE.rider.fatigue)}</span><span class="stat-tile-label">${tf('fatigueWord','Fatigue')}</span></div>
        ${prize>0?`<div class="stat-tile"><span class="stat-tile-num" style="color:var(--yellow-dark);">+${prize.toLocaleString('fr-FR')}€</span><span class="stat-tile-label">${tf('prizeWord','Prime')}</span></div>`:''}
      </div>
      ${teamPrize>0?`<p class="small" style="margin-top:8px;">🎽 +${teamPrize.toLocaleString('fr-FR')} € (${tf('team','équipe')})</p>`:''}
    </div>
    ${injuryBanner}
    ${confidentBetBanner}
    ${jerseyBanner}
    ${poisseBanner}
    ${rivalBanner}
    <button class="btn" ${continueAttr}>${continueLabel}</button>
  `, true);
}

