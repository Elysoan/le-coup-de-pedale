function currentTeam(rider){
  return TEAMS.find(t=>t.id===rider.teamId) || TEAMS[0];
}

/* ProTeam et WorldTour sont de vraies catégories UCI, jamais traduites même dans la
   presse cycliste francophone — seuls "Continentale" et "Équipe de légende" (fictif)
   ont besoin d'un équivalent anglais. */
function teamTierLabel(tier){
  if(tier==='Continentale') return tf('tierContinental','Continentale');
  if(tier==='Équipe de légende') return tf('tierLegend','Équipe de légende');
  return tier;
}

function riderRole(rider){
  const rep = rider.reputation;
  if(rep >= 82) return tf('roleSuperstar','Superstar mondiale');
  if(rep >= 60) return tf('roleLeader','Leader désigné');
  if(rep >= 35) return tf('roleCoLeader','Co-leader');
  if(rep >= 16) return tf('roleDeluxe','Équipier de luxe');
  return tf('roleDomestique','Équipier / jeune espoir');
}

/* ---------- MOTEUR DE COURSE ---------- */

/* Les grands tours, monuments et championnats reviennent chaque saison (comme dans la
   réalité). Le reste du calendrier (courses par étapes secondaires, classiques mineures,
   critériums) tourne : une sélection aléatoire différente est proposée chaque saison. */
/* Les JO n'apparaissent que lors d'une "année olympique" (tous les 4 ans de carrière) et
   seulement si le coureur est sélectionné par sa fédération : la barre est haute, surtout
   pour une première sélection (les nations ont peu de dossards et misent sur les valeurs
   sûres). Une fois sélectionné une première fois, la barre redescend un peu pour les
   suivantes (la fédération connaît et fait confiance au coureur), mais rien n'est jamais
   garanti à 100% — même au-dessus du seuil, la sélection reste un tirage. */
function isOlympicSeason(rider){
  return rider.season % 4 === 0;
}
function olympicSelectionThreshold(rider){
  const prior = rider.olympicSelections || 0;
  return clamp(68 - prior*7, 40, 68);
}
function olympicSelectionChance(rider){
  const threshold = olympicSelectionThreshold(rider);
  if(rider.reputation < threshold) return 0;
  const margin = rider.reputation - threshold;
  return clamp(0.3 + margin*0.025, 0.3, 0.92);
}

/* ---------- ACCÈS AUX GRANDS TOURS ET MONUMENTS ----------
   Fidèle à la réalité UCI : les équipes WorldTour (et le niveau fictif "légende" au-dessus)
   sont automatiquement invitées à toutes les grandes courses. Les ProTeams doivent
   espérer une invitation au cas par cas — représenté ici par la confiance d'équipe, qui
   reflète si le staff est prêt à te pousser pour un dossard. Les équipes Continentales,
   elles, n'y participent quasiment jamais dans la réalité — verrouillé tant qu'on n'a
   pas progressé vers un meilleur contrat. Les championnats (national/mondial) restent
   à part : ce sont des sélections fédérales, pas liées à l'équipe trade. */
function raceAccessCheck(race, rider){
  if(race.type!=='grandtour' && race.type!=='monument') return {allowed:true};
  const team = currentTeam(rider);
  if(team.tier==='WorldTour' || team.tier==='Équipe de légende') return {allowed:true};
  if(team.tier==='Continentale') return {allowed:false, reason:'continental'};
  // ProTeam : l'invitation dépend de la confiance que l'équipe a en toi.
  if(rider.teamConfidence >= 50) return {allowed:true};
  return {allowed:false, reason:'confidence'};
}
