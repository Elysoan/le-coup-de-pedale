/* Réputation : un résultat dans la norme (peloton) est neutre ; en dessous, ça coûte
   réellement de la réputation sur les courses prestigieuses ; au-dessus, ça rapporte gros.
   Les gains se réduisent à l'approche de 100 (rendements décroissants) : atteindre le
   sommet et y rester doit rester rare, réservé aux plus grandes carrières. */
function repGainFor(race, bestTier, currentRep, rider){
  const rep = currentRep==null ? 50 : currentRep;
  /* Calendrier du buzz : une course très suivie amplifie la réputation en jeu, dans les
     deux sens — un pari qui rapporte plus si le coureur brille, coûte plus s'il déçoit. */
  const buzzMult = race.buzz ? 1.4 : 1;
  if(bestTier === 'abandon') return -Math.round(race.prestige * 1.1 * buzzMult);
  if(bestTier === 'forfait') return -Math.round(race.prestige * 0.5 * buzzMult); // forfait = moins grave qu'un abandon
  const tv = TIER_VALUE[bestTier]; // 0..4
  let raw = (tv - 1) * race.prestige * 0.9;
  if(raw > 0){
    /* Headroom non-linéaire : les gains de réputation ralentissent fortement
       à mesure qu'on approche de 100. En dessous de 40, plein gain.
       Entre 40 et 80, décroissance progressive. Au-delà de 80, très faible.
       Formule : headroom = ((100-rep)/100)^1.2, clampé entre 0.04 et 1 (le plancher
       ne joue qu'au-delà d'environ 93 de réputation, pour que le tout dernier palier
       reste vraiment rare, comme annoncé).
       Effets : rep=0→1.0, rep=40→0.54, rep=70→0.24, rep=85→0.10, rep=95→0.04 */
    const headroom = clamp(Math.pow((100 - rep) / 100, 1.2), 0.04, 1);
    raw *= headroom;
    // Bonus si la victoire correspond au rôle (leader gagnant une course de son registre)
    if(rider && rider.role && bestTier === 'victoire'){
      const roleTypes = ROLE_RECOMMENDED_TYPES[rider.role] || [];
      if(roleTypes.length > 0 && roleTypes.includes(race.type)){
        raw *= 1.25; // +25% de réputation sur une victoire dans son registre
      }
    }
  }
  /* Le multiplicateur buzz n'amplifie que la performance elle-même — pas les bonus
     fixes d'évènements mondiaux ajoutés plus bas, qui sont annoncés comme des valeurs
     fixes et ne doivent pas être gonflés en silence par une course très suivie. */
  raw *= buzzMult;
  /* Trajectoire globetrotter : +1 rep sur les courses hors spécialité — il est connu
     pour sa polyvalence et son palmarès éclectique. */
  if(rider && rider.trajectory === 'globetrotter' && race.type){
    const _raceProxyGlobe = {type: race.type};
    if(!raceMatchesStyle(_raceProxyGlobe, rider.styleId) && raw > 0) raw += 1;
  }
  /* Trajectoire leader : malus supplémentaire sur les contre-perfs (peloton/jourssans)
     sur les courses de prestige ≥ 3 — les attentes sont élevées. */
  if(rider && rider.trajectory === 'leader' && (bestTier === 'peloton' || bestTier === 'jourssans')){
    const race_prestige = (arguments[0] && arguments[0].prestige) || 0;
    if(race_prestige >= 3) raw -= 1;
  }
  const _wm2 = (typeof STATE !== 'undefined' && STATE && STATE.seasonWorldMods) || {};
  const _race = arguments[0] || {};
  /* Étoile recrutée : la moitié "contre-perfs plus visibles" de l'effet, en miroir du
     bonus sur les victoires ci-dessous — hors du bloc raw!==0 car une contre-perf
     "peloton" a justement raw=0 avant ce malus. */
  if(_wm2.teamSpotlight && (bestTier === 'peloton' || bestTier === 'jourssans')) raw -= 1;
  /* World events : bonus de réputation saisonniers */
  if(raw !== 0){
    if(bestTier === 'victoire'){
      if(_wm2.gtRepBonus && _race.type === 'grandtour') raw += _wm2.gtRepBonus;
      /* "Ton pays accueille un Grand Départ" : seulement si le coureur est bien de ce
         pays, pas n'importe quel vainqueur de grand tour. */
      if(_wm2.homeGrandDepart && _race.type === 'grandtour' && rider && _race.flag && COUNTRIES.find(c=>c.code===rider.countryCode)?.flag === _race.flag) raw += 5;
      if(_wm2.bigRaceRepBonus && (_race.type === 'grandtour' || _race.type === 'monument')) raw += _wm2.bigRaceRepBonus;
      if(_wm2.sprintRepBonus && (_race.type === 'classique' || _race.type === 'crit')) raw += _wm2.sprintRepBonus;
      if(_wm2.clmRepBonus && (_race.type === 'semitour')) raw += _wm2.clmRepBonus;
      if(_wm2.newRaceRepBonus) raw += _wm2.newRaceRepBonus;
      if(_wm2.teamSpotlight) raw += 2;
    }
    if(bestTier === 'top10' && _wm2.top10RepBonus) raw += _wm2.top10RepBonus;
    if(_wm2.moneyBonus && typeof STATE !== 'undefined' && STATE && STATE.rider){
      // Le bonus argent est géré dans la fonction de paiement, pas ici
    }
    if(_wm2.competitionUp && (bestTier === 'victoire' || bestTier === 'podium')){
      // La compétition accrue est simulée via un seuil relevé dans resolveEvent
      // pas via la réputation — rien à faire ici
    }
  }
  return Math.round(raw);
}

/* La confiance de l'équipe évolue avec chaque résultat, indépendamment du prestige
   de la course : elle reflète la régularité, pas la gloire. */
function confidenceDeltaFor(bestTier){
  const tv = TIER_VALUE[bestTier];
  return Math.round((tv - 1) * 2.2);
}

function statAgeDelta(key, age){
  const peak = STAT_PEAK_AGE[key];
  const diff = age - peak;
  if(key==='mental'){
    return diff<=0 ? 0.5 : -0.15;
  }
  if(diff<=-4) return 0.7;
  if(diff<=-1) return 0.4;
  if(diff<=1) return 0.05;
  if(diff<=5) return -0.35;
  return -1.3;
}

function endSeasonAging(rider, trainingFocus){
  rider.age += 1;
  const age = rider.age;
  STAT_KEYS.forEach(k=>{
    let delta = statAgeDelta(k, age);
    if(k===trainingFocus) delta += (age <= STAT_PEAK_AGE[k]+4 ? 1.4 : 0.4);
    rider.stats[k] = clamp(rider.stats[k]+delta, 8, 99);
  });
  // Repos hivernal : la part de fatigue non évacuée dépend de la récupération et de l'âge.
  // restFactor : fraction de fatigue qui survit à l'hiver. Plancher relevé à 0.14 (vs 0.05)
  // pour que l'accumulation saison après saison soit visible après 30 ans.
  const restFactor = clamp(0.38 - rider.stats.recuperation/300 + Math.max(0, age-32)*0.012, 0.14, 0.48);
  rider.fatigue = Math.round(rider.fatigue * restFactor);
  // Fatigue résiduelle minimale : un coureur de 32+ ans ne récupère jamais à zéro
  const ageFloor = age >= 34 ? 12 : age >= 32 ? 8 : age >= 30 ? 4 : 0;
  rider.fatigue = Math.max(rider.fatigue, ageFloor);
  // La confiance d'équipe se recentre légèrement vers la neutralité d'une saison à l'autre.
  rider.teamConfidence = Math.round(rider.teamConfidence + (55 - rider.teamConfidence)*0.15);
}
