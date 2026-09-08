function careerScore(entry){
  const WIN_PTS  = {grandtour:150, monument:100, champ:80, semitour:40, classique:25, crit:10};
  const POD_PTS  = {grandtour:40,  monument:30,  champ:25, semitour:12, classique:8,  crit:3};
  const DEFAULT_WIN = 10, DEFAULT_POD = 3;
  let score = 0;
  const wbt = entry.winsByType   || {};
  const pbt = entry.podiumsByType || {};
  for(const type in wbt) score += (wbt[type]||0) * (WIN_PTS[type] || DEFAULT_WIN);
  for(const type in pbt) score += (pbt[type]||0) * (POD_PTS[type] || DEFAULT_POD);
  score += (entry.stageWins || 0) * 15;
  score += Math.round(entry.finalReputation || 0);
  score += Math.max(0, 200 - (entry.bestRank || 450)) * 0.3;
  return Math.round(score);
}

/* Retourne uniquement la clé (pas le texte résolu) — utilisée pour le stockage dans
   l'historique de session (CAREER_HISTORY), afin que le titre reste traduisible même
   après un changement de langue survenu après la fin de cette carrière. */
function legacyTitleKey(rider){
  const wins = rider.palmares.filter(p=>p.tier==='victoire');
  const gtWins = wins.filter(p=>p.type==='grandtour').length;
  const monWins = wins.filter(p=>p.type==='monument').length;
  /* Titres exclusifs (déblocage entre carrières) : réservés à ceux qui possédaient déjà
     des trophées rares AVANT le début de cette carrière — rareTrophiesAtStart est figé
     à la création du coureur, donc insensible aux trophées gagnés pendant cette carrière. */
  const rareOwnedBefore = (rider.rareTrophiesAtStart||[]).length;
  if(rareOwnedBefore>=4 && rider.reputation>=50) return 'legacyLivingLegend';
  if(rareOwnedBefore>=2 && wins.length>=1) return 'legacyHeir';
  if(gtWins>=3) return 'legacyGrandTourLegend';
  if(monWins>=3) return 'legacyClassicsLord';
  if(gtWins>=1 && monWins>=1) return 'legacyCompleteRider';
  if(wins.length>=5) return 'legacyTirelessBreakaway';
  if(rider.reputation>=60) return 'legacyRespectedFigure';
  if(wins.length>=1) return 'legacyRespectedWinner';
  return 'legacyModestDomestique';
}
function legacyTitleText(key){
  /* Compatibilité ascendante : les sauvegardes antérieures à ce correctif stockaient le
     texte complet du titre (déjà résolu en français) plutôt qu'une clé — si la valeur
     ne correspond à aucune clé connue, on l'affiche telle quelle plutôt que de casser
     l'affichage. */
  if(LEGACY_TITLE_FR[key] === undefined) return key;
  return tf(key, LEGACY_TITLE_FR[key]);
}
function legacyTitle(rider){
  return legacyTitleText(legacyTitleKey(rider));
}
