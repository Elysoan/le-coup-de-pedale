function salaryForSeason(rider){
  const tierBase = {'Continentale':8000, 'ProTeam':18000, 'WorldTour':38000, 'Équipe de légende':70000}[currentTeam(rider).tier] || 8000;
  const repBonus = Math.pow(rider.reputation / 100, 1.6) * 80000;
  const roleMult = ROLE_SALARY_MULT[rider.role] || 1.0;
  return Math.round((tierBase + repBonus) * roleMult);
}

/* Prime individuelle de course selon le prestige de l'épreuve et le résultat obtenu. */
function prizeForResult(race, bestTier){
  const tv = Math.max(0, TIER_VALUE[bestTier] ?? 0);
  return Math.round(race.prestige * tv * 350);
}

/* Prime de classement par équipes : existe sur (presque) toutes les courses par étapes,
   mais compte moins sur les grands tours (où la gloire individuelle domine) que sur les
   courses secondaires. Dépend de la forme collective (confiance d'équipe). */
function checkTeamVictory(race, bestTier){
  if(bestTier==='abandon' || bestTier==='forfait') return 0;
  if(race.type==='monument' || race.type==='classique' || race.type==='crit' || race.type==='champ') return 0; // pas de classement par equipes sur les courses d'un jour / championnats
  const baseChance = race.type==='grandtour' ? 0.10 : 0.22;
  const teamFactor = 0.5 + (STATE.rider.teamConfidence/100);
  if(Math.random() >= baseChance*teamFactor) return 0;
  const _moneyMult = (STATE.seasonWorldMods && STATE.seasonWorldMods.moneyBonus) || 1;
  const bonus = Math.round((race.type==='grandtour' ? 2200 : 1000) * (0.7+Math.random()*0.6) * _moneyMult);
  STATE.rider.money += bonus;
  return bonus;
}
