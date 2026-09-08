function checkCareerCapCondition(rider, type){
  if(type==='grandtour') return rider.palmares.some(p=>p.type==='grandtour' && p.tier==='victoire');
  if(type==='monument') return rider.palmares.some(p=>p.type==='monument' && p.tier==='victoire');
  if(type==='top20') return rider.worldRank <= 20;
  if(type==='reputation70') return rider.reputation >= 70;
  if(type==='cinq-victoires') return rider.palmares.filter(p=>p.tier==='victoire').length >= 5;
  if(type==='top50-trois-saisons') return (rider._top50Seasons||0) >= 3;
  if(type==='fidelite-equipe'){
    /* Comparé au nombre de changements d'équipe au moment où le cap a été pris, pas au
       total depuis le tout début de la carrière — sinon un unique changement d'équipe
       bien avant de choisir ce cap le rendrait mathématiquement impossible pour le
       reste de la carrière, sans que rien ne le signale au joueur. */
    const baseline = (rider.careerCap && rider.careerCap.startTeamChanges) || 0;
    return (rider.teamChanges||0) - baseline === 0;
  }
  return false;
}
