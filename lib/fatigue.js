function applyFatigue(rider, race, choice, weatherId){
  /* Récupération individuelle : réduit l'accumulation de base */
  const reduc = 1 - (rider.stats.recuperation/280);
  /* Résistance : amortit l'impact de la difficulté sur les longues courses */
  const resistanceFactor = 1 - clamp((rider.stats.resistance - 50) / 150, -0.2, 0.35);
  /* Surcharge calendaire : au-delà de 45 jours courus, chaque jour supplémentaire
     fatigue davantage — l'organisme ne récupère plus aussi bien entre les efforts.
     Plus agressif qu'avant : 0.025 par jour (vs 0.018) pour que 65 jours de course
     soit vraiment éprouvant. */
  const daysSoFar = STATE.cumulativeDaysRaced || 0;
  const overloadWear = daysSoFar > 45 ? 1 + (daysSoFar - 45) * 0.025 : 1;
  /* Intensité selon durée : une étape de 21 jours coûte 45% de plus qu'une course d'un jour */
  const intensity = 1 + Math.min(race.days, 21) / 21 * 0.45;
  /* Prestige = peloton plus fort, course plus sélective, rythme plus élevé */
  const prestigeFactor = 1 + (race.prestige - 1) * 0.12;
  /* Proximité calendaire : deux courses dans le même mois (gap ≤ 0) ou très rapprochées
     (gap = 1 semaine en pratique) génèrent une fatigue supplémentaire car la récupération
     est incomplète. Ce facteur est calculé depuis STATE pour la course précédente. */
  const prevRace = STATE.runQueue && STATE.runRaceIdx > 0 ? STATE.runQueue[STATE.runRaceIdx - 1] : null;
  let proximityMult = 1;
  if(prevRace){
    const gap = race.month - prevRace.month;
    if(gap <= 0) proximityMult = 1.25;      // même mois : +25% de fatigue
    else if(gap === 1) proximityMult = 1.10; // mois suivant : +10%
  }
  const riskMult = choice ? (RISK_FATIGUE_MULT[choice.risk] || 1) : 1;
  const weatherMult = weatherId ? weatherFatigueMult(weatherId) : 1;
  /* Trajectoire Spécialiste : pénalité si trop de courses (>8 dans la saison).
     Le spécialiste est taillé pour les grands rendez-vous, pas pour courir partout. */
  const racesCount = STATE && STATE.runQueue ? STATE.runQueue.length : 0;
  const specialistePenalty = (rider.trajectory === 'specialiste' && racesCount > 8) ? 1.15 : 1;
  /* World events : modificateurs saisonniers de fatigue */
  const _wm = (STATE && STATE.seasonWorldMods) || {};
  let worldFatMult = 1;
  if(_wm.globalFatigueReduction) worldFatMult *= _wm.globalFatigueReduction;
  if(_wm.globalFatigueBoost) worldFatMult *= _wm.globalFatigueBoost;
  if(_wm.julyFatigue && race.month === 7) worldFatMult *= _wm.julyFatigue;
  if(_wm.springFatigue && race.month >= 3 && race.month <= 4 && (race.type === 'monument' || race.type === 'classique')) worldFatMult *= _wm.springFatigue;
  /* Important : diviser par le nombre RÉEL d'events de cette course (canoniques +
     phases bonus + event rival), pas seulement les canoniques (_baseEventCount, qui
     sert uniquement à l'affichage du compteur de jours). Sinon les phases bonus/rival
     ajoutent un coût de fatigue plein sans être comptées dans le diviseur, et la
     fatigue totale de la course dépasse largement son fatCost prévu. */
  const canonicalEvents = (race.events && race.events.length) || race._baseEventCount || 1;
  const cost = (race.fatCost / canonicalEvents) * reduc * resistanceFactor * overloadWear * intensity * prestigeFactor * proximityMult * riskMult * weatherMult * specialistePenalty * worldFatMult;
  rider.fatigue = clamp(rider.fatigue + cost, 0, 100);
  /* Tracker le pic de fatigue saisonnière pour le défi fatigue-maitrisee */
  if(STATE && rider.fatigue > (STATE._seasonMaxFatigue||0)) STATE._seasonMaxFatigue = rider.fatigue;
}

/* Récupération passive entre deux courses du calendrier, selon l'écart de mois et la
   capacité de récupération du coureur. Cette récupération devient moins efficace à mesure
   que le cumul réel de jours courus augmente, et sortir d'une course longue (typiquement
   un grand tour) laisse une fatigue résiduelle qui résiste davantage à la récupération
   qu'une simple accumulation de petites courses. */
function applyInterRaceRecovery(rider, prevRace, nextRace){
  if(!prevRace) return;
  let gap = nextRace.month - prevRace.month;
  if(gap < 0) gap += 12;
  const daysSoFar = STATE.cumulativeDaysRaced || 0;
  /* seasonFactor : la récupération devient moins efficace en fin de saison.
     Plus agressif qu'avant (0.009 vs 0.007) et plancher à 0.25 (vs 0.3). */
  const seasonFactor = clamp(1 - daysSoFar * 0.009, 0.25, 1);
  /* Après un grand tour ou un semi-tour long (>14j), la fatigue résiduelle
     résiste davantage à la récupération — l'organisme a vraiment souffert. */
  const prevRaceDepth = 1 - Math.min(prevRace.days, 21) / 21 * 0.40;
  /* Gap non-linéaire : même mois = presque pas de récupération possible.
     1 mois ≈ 14 pts, 2 mois ≈ 33 pts, 3 mois ≈ 55 pts (légèrement réduit vs avant). */
  const gapFactor = gap > 0 ? Math.pow(gap, 1.4) : 0;
  const recovery = gapFactor * (11 + rider.stats.recuperation / 11) * seasonFactor * prevRaceDepth;
  rider.fatigue = clamp(rider.fatigue - recovery, 0, 100);
  /* Plancher saisonnier : l'accumulation de fatigue de fond ne peut pas être
     effacée — même avec deux mois de repos, un coureur à 60j de course garde
     une fatigue résiduelle. */
  const seasonFloor = Math.min(45, daysSoFar * 1.0);
  rider.fatigue = Math.max(rider.fatigue, seasonFloor);
}
