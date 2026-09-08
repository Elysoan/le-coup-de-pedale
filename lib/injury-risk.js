/* Risque de chute pendant un évènement de course : plus élevé sur les choix audacieux,
   sur les monuments (pavé, descentes techniques), et amplifié par la fatigue. */
function crashChanceFor(rider, race, choice, weatherId){
  const _wmCrash = (typeof STATE !== 'undefined' && STATE && STATE.seasonWorldMods) || {};
  const _crashWorldMult = _wmCrash.crashMult || 1;
  let base = (choice.risk==='audacieux' ? 0.05 : choice.risk==='equilibre' ? 0.025 : choice.risk==='loufoque' ? 0.04 : 0.012) * _crashWorldMult;
  if(race.type==='monument') base *= 1.8;
  if(weatherId) base *= weatherCrashMult(weatherId);
  const fatigueFactor = 1 + Math.max(0, rider.fatigue-40)/90;
  return clamp(base * fatigueFactor, 0, 0.35);
}

/* Gravité d'une blessure : légère (repart à la prochaine course), modérée (absence de
   plusieurs courses en convalescence), grave (rare — fin de carrière prématurée).
   Une chute grave est un peu plus probable qu'un surmenage grave. */
function injurySeverity(rider, cause){
  const f = rider.fatigue;
  let graveP = clamp(0.015 + Math.max(0, f-85)*0.0025, 0, 0.08);
  if(cause==='surmenage') graveP *= 0.3;
  const modP = clamp(0.28 + Math.max(0, f-60)*0.006, 0, 0.6);
  const roll = Math.random();
  if(roll < graveP) return 'grave';
  if(roll < graveP+modP) return 'moderee';
  return 'legere';
}

function difficultyForRace(race, rider){
  const repGap = Math.max(0, race.prestige*16 - rider.reputation);
  const score = race.prestige*18 + repGap*0.5;
  if(score>=130) return {label:tf('diffExtreme','Extrême'), cls:'diff-5'};
  if(score>=100) return {label:tf('diffVeryHard','Très difficile'), cls:'diff-4'};
  if(score>=72) return {label:tf('diffHard','Difficile'), cls:'diff-3'};
  if(score>=45) return {label:tf('diffModerate','Modérée'), cls:'diff-2'};
  return {label:tf('diffEasy','Facile'), cls:'diff-1'};
}


/* L'équipe impose 3 courses par saison : en priorité liées à l'axe d'entraînement
   choisi par le joueur et à la spécialité de l'équipe, sinon tirées au hasard.
   Le pool fourni doit être celui déjà tiré pour la saison (voir chooseTraining),
   pour que les courses imposées correspondent bien à celles affichées ensuite. */
function pickImposedRaces(rider, trainingFocus, pool){
  const all = pool.filter(r=>!r.olympic && !r.locked);
  const team = currentTeam(rider);
  const priorityStats = [trainingFocus, team.specialty].filter(Boolean);
  let chosen = [];
  if(priorityStats.length){
    const matching = shuffleArr(all.filter(r=> r.events.some(e=>e.focus.some(f=>priorityStats.includes(f)))));
    chosen = matching.slice(0,3);
  }
  if(chosen.length<3){
    const remaining = shuffleArr(all.filter(r=>!chosen.includes(r)));
    chosen = chosen.concat(remaining.slice(0, 3-chosen.length));
  }
  // Jamais plus de 2 grands tours imposés dans la même saison, même par tirage.
  let gtSeen = 0;
  chosen = chosen.filter(r=>{
    if(r.type!=='grandtour') return true;
    gtSeen++;
    return gtSeen<=2;
  });
  return chosen.map(r=>r.id);
}
