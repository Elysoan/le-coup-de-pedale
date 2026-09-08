function offersForRider(rider){
  const current = currentTeam(rider);
  /* Globetrotter : sa visibilité internationale lui ouvre les portes plus vite.
     Évènement mondial "Équipe rivale en crise" : +1 rang de recrutement supplémentaire
     pour la saison, comme annoncé par son texte. */
  const _wmRecruit = (typeof STATE !== 'undefined' && STATE && STATE.seasonWorldMods && STATE.seasonWorldMods.recruitmentBonus) || 0;
  const tierBonus = (rider.trajectory === 'globetrotter' ? 2 : 1) + _wmRecruit;
  const maxTierIdx = TEAM_TIER_ORDER[current.tier] + tierBonus;
  const eligible = TEAMS.filter(t=> t.minRep <= rider.reputation + 10 && TEAM_TIER_ORDER[t.tier] <= maxTierIdx);
  const renewed = rider.teamConfidence >= 28 && eligible.includes(current);
  let offers = renewed ? [current] : [];
  const others = shuffleArr(eligible.filter(t=>t.id!==current.id)).sort((a,b)=>b.minRep-a.minRep);
  for(const t of others){
    if(offers.length>=3) break;
    offers.push(t);
  }
  if(offers.length===0) offers.push(TEAMS[0]);
  return offers.slice(0,3);
}
