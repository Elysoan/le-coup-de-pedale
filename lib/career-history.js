function recordCareer(rider){
  const wins = rider.palmares.filter(p=>p.tier==='victoire').length;
  const podiums = rider.palmares.filter(p=>p.tier==='podium').length;
  // Victoires par type de course
  const winsByType = {};
  rider.palmares.filter(p=>p.tier==='victoire').forEach(p=>{
    const race = RACES_DATA().find(r=>r.id===p.raceId);
    const type = race ? race.type : 'autre';
    winsByType[type] = (winsByType[type]||0) + 1;
  });
  // Podiums par type de course
  const podiumsByType = {};
  rider.palmares.filter(p=>p.tier==='podium').forEach(p=>{
    const race = RACES_DATA().find(r=>r.id===p.raceId);
    const type = race ? race.type : 'autre';
    podiumsByType[type] = (podiumsByType[type]||0) + 1;
  });
  // Meilleur classement mondial atteint (le pic réel, pas le classement au moment de l'arrêt)
  const bestRank = rider.peakWorldRank || rider.worldRank || 450;
  // Evaluation du defi si mode defi actif
  const cr = window._creation || {};
  let challengeResult = null;
  if(cr.challengeMode && cr.challengeObj){
    try { challengeResult = cr.challengeObj.check(rider) ? 'success' : 'fail'; } catch(e){ challengeResult = 'fail'; }
  }
  CAREER_HISTORY.push({
    name: rider.name,
    countryCode: rider.countryCode,
    styleId: rider.styleId,
    seasons: rider.season - 1,
    retireAge: rider.age,
    wins, podiums,
    winsByType, podiumsByType,
    stageWins: rider.stageWins || 0,
    bestRank,
    finalReputation: Math.round(rider.reputation),
    finalTeam: currentTeam(rider).name,
    title: legacyTitleKey(rider),
    challengeMode: cr.challengeMode || false,
    challengeObjId: cr.challengeObj ? cr.challengeObj.id : null,
    challengeObjLabel: cr.challengeObj ? cr.challengeObj.label : null,
    challengeResult,
  });
}

function topCareers(n){
  /* Les carrières en mode défi sont volontairement handicapées par des contraintes
     imposées (équipe/pays/style tirés au sort) — les mélanger à score égal avec des
     carrières libres dans le Hall of Fame les désavantagerait injustement. Leur succès
     se lit via leur propre badge de réussite/échec, pas via ce classement. */
  return CAREER_HISTORY.filter(c=>!c.challengeMode).sort((a,b)=>careerScore(b)-careerScore(a)).slice(0,n);
}
