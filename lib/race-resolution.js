function resolveEvent(rider, event, choice, weatherId, racePrestige, isGrandTour, isHomeRace, isSignatureRace, raceType){
  const statAvg = statFocusAverage(rider, event.focus);
  const forme = clamp(100 - rider.fatigue*0.75 + (Math.random()*16-8), 5, 100);
  /* Les stats pèsent plus lourd qu'avant (0.62 contre 0.55), la part de forme du jour et
     de mental un peu moins — un coureur avec de meilleures stats doit gagner plus souvent,
     sans que le résultat ne devienne pour autant totalement déterministe. */
  let base = statAvg*0.62 + forme*0.26 + rider.stats.mental*0.12;
  if(weatherId) base += weatherPerfModifier(weatherId, event.focus);

  /* Ferveur du public à domicile : courir dans son propre pays donne un léger coup de
     fouet mental, un classique du cyclisme (cf. l'avantage constaté des coureurs locaux
     sur les classiques de leur pays). Effet modeste, jamais décisif à lui seul. */
  if(isHomeRace) base += 3;

  /* Course de cœur : celle choisie librement en début de carrière comme objectif
     personnel. Un supplément d'envie modeste, comparable à la ferveur du public à
     domicile — un attachement affectif qui peut se cumuler avec la ferveur locale. */
  if(isSignatureRace) base += 3;

  /* Spécialité de signature : le style du coureur correspond au profil de la course —
     grimpeur sur un grand tour de montagne, sprinteur sur une classique rapide, etc.
     Bonus significatif mais pas écrasant : un spécialiste gagne plus souvent sur son
     terrain sans rendre les autres courses sans intérêt. */
  if(rider.styleId && raceType){
    const _raceProxy = {type: raceType, events: [event]};
    if(raceMatchesStyle(_raceProxy, rider.styleId)) base += 5;
  }

  /* Bonus de faim : coureur qui a refusé de raccrocher (pivot S9) — regain de motivation
     sur les 2 saisons suivant le refus. */
  if(rider.careerFlags && rider.careerFlags.hungerBonus){
    if(rider.season <= rider.careerFlags.hungerBonus + 2) base += 6;
  }

  /* Trajectoire de carrière :
     - Spécialiste : +12% sur les courses de sa spécialité (type + focus matching)
     - Globetrotter : pas de bonus perf direct (compensé par l'accès aux équipes)
     - Leader : +5% sur les courses imposées par l'équipe */
  if(rider.trajectory === 'specialiste' && raceType){
    const _raceProxyTraj = {type: raceType, events: [event]};
    if(raceMatchesStyle(_raceProxyTraj, rider.styleId)) base *= 1.12;
  }
  if(rider.trajectory === 'leader' && STATE && STATE.imposedRaceIds && raceType){
    // Identifier si la course en cours est une course imposée
    const _currentRace = STATE.runQueue && STATE.runQueue[STATE.runRaceIdx];
    if(_currentRace && STATE.imposedRaceIds.includes(_currentRace.id)) base *= 1.05;
  }

  /* Sur les courses prestigieuses (monuments, grands tours...), un coureur très jeune
     n'a statistiquement presque jamais course la victoire dans la réalité (le plus jeune
     vainqueur de Paris-Roubaix depuis 1950 avait 22 ans) — un frein progressif s'applique
     avant 24 ans, proportionnel au prestige de la course, sans jamais rendre la victoire
     strictement impossible. */
  if(racePrestige >= 3 && rider.age < 24){
    const yearsUnder = 24 - rider.age;
    const prestigeMult = racePrestige >= 4 ? 1 : 0.5;
    base -= yearsUnder * 4 * prestigeMult;
  }

  /* Un grand tour se joue aussi sur l'expérience spécifique de courir 3 semaines
     d'affilée (gestion de la fatigue cumulée, du rythme, des étapes) — indépendamment
     de l'âge. Un coureur à son tout premier grand tour de carrière est freiné, un peu
     moins au deuxième, plus du tout à partir du troisième. */
  if(isGrandTour){
    const priorGrandTours = rider.palmares.filter(p=>p.type==='grandtour').length;
    if(priorGrandTours < 2){
      base -= (2 - priorGrandTours) * 5;
    }
  }

  /* Malus d'inexpérience : un coureur de S1-S3 est encore en rodage — il ne sait pas
     lire une course, se positionner, gérer la pression. Ce malus disparaît progressivement
     sur 4 saisons et ne s'applique plus à partir de la S4. Volontairement modéré pour
     qu'un débutant garde une vraie chance de victoire sur une course facile dès la S1
     (cf. les seuils de victoire par prestige plus bas).
     S1 : -10, S2 : -5, S3 : -2, S4+ : 0 */
  const season = rider.season || 1;
  if(season === 1) base -= 10;
  else if(season === 2) base -= 5;
  else if(season === 3) base -= 2;
  // S4+ : plus de malus — la progression naturelle des stats prend le relais.

  let perf, spread;
  if(choice.risk==='sur'){ perf = base*0.92; spread = 5; }
  else if(choice.risk==='audacieux'){ perf = base*1.08; spread = 18; }
  else if(choice.risk==='loufoque'){ perf = 35 + statAvg*0.25; spread = 32; }
  else { perf = base; spread = 11; }

  /* La variance se resserre modérément sur les courses les plus prestigieuses (le résultat
     y reflète davantage le niveau réel), sans jamais l'écraser complètement — une partie
     non négligeable de hasard doit rester, certaines carrières décollent vite, d'autres non. */
  if(racePrestige >= 4) spread *= 0.72;
  else if(racePrestige === 3) spread *= 0.86;

  perf += (Math.random()*2-1)*spread;
  perf = clamp(perf, 0, 118);

  /* Les seuils victoire et podium varient selon le prestige de la course.
     Gagner une petite course (prestige 1) est plus accessible qu'un monument (prestige 5),
     ce qui permet à un débutant de décrocher une victoire sur une course facile dès la S1,
     tout en gardant les Grands Tours et monuments hors de portée sans une vraie progression.
     Victoire : P1=64, P2=70, P3=76, P4=82, P5=88
     Podium   : P1=60, P2=64, P3=68, P4=70, P5=72 */
  const _wm3 = (typeof STATE !== 'undefined' && STATE && STATE.seasonWorldMods) || {};
  const _competUp = _wm3.competitionUp || 0;
  /* Seuils de victoire par prestige. P1 à 67 (vs 70) pour que les jeunes puissent
     gagner dès la S1-S2 sur petites courses ; P2 à 72 pour qu'un coureur mid-carrière
     avec stats ~60 y accède raisonnablement. P5 (monuments, GT) inchangé à 88. */
  const _vicTable = [0,67+_competUp,72+_competUp,77+_competUp,82+_competUp,88+_competUp];
  const _podTable = [0,67,69,71,71,72];
  const vicSeuil = (racePrestige && _vicTable[racePrestige]) ? _vicTable[racePrestige] : 88+_competUp;
  const podSeuil = (racePrestige && _podTable[racePrestige]) ? _podTable[racePrestige] : 72;
  let tier;
  if(perf>=vicSeuil) tier='victoire';
  else if(perf>=podSeuil) tier='podium';
  else if(perf>=55) tier='top10';
  else if(perf>=32) tier='peloton';
  else tier='jourssans';

  if(perf<20 && rider.fatigue>65 && Math.random()<0.22) tier='abandon';

  let trained = null;
  /* Progression des stats en course : les jeunes progressent plus vite, mais
     un coureur expérimenté continue d'affiner ses qualités jusqu'à 33 ans.
     Tranche 28-33 : probabilité réduite (20% vs 35%) et gain plus faible (0.2-0.4). */
  if(TIER_VALUE[tier]>=2){
    const trainProba = rider.age<=27 ? 0.35 : rider.age<=33 ? 0.20 : 0;
    if(Math.random() < trainProba){
      const gainAmt = rider.age<=27 ? (0.4+Math.random()*0.5) : (0.2+Math.random()*0.2);
      const k = event.focus[Math.floor(Math.random()*event.focus.length)];
      rider.stats[k] = clamp(rider.stats[k] + gainAmt, 15, 99);
      trained = k;
    }
  }

  /* Un choix risqué (audacieux ou loufoque) qui tourne mal peut aussi coûter un peu de
     stat, pas seulement ne rien rapporter : surmenage, déconvenue physique ou morale. */
  let detrained = null;
  if((tier==='jourssans' || tier==='abandon') && (choice.risk==='audacieux' || choice.risk==='loufoque') && Math.random()<0.3){
    const k = event.focus[Math.floor(Math.random()*event.focus.length)];
    rider.stats[k] = clamp(rider.stats[k] - (0.4+Math.random()*0.6), 10, 99);
    detrained = k;
  }

  return {tier, perf: Math.round(perf), trained, detrained};
}
