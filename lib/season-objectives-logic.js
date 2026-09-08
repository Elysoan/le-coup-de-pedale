function availableObjectives(rider){
  const rep = rider.reputation;
  const season = rider.season || 1;
  const recentSeasons = (rider.palmares||[]).filter(p=>p.season===rider.season-1||p.season===rider.season);
  const hadMonumentWin = recentSeasons.some(p=>p.prestige>=4 && p.tier==='victoire');
  const hadGTWin = recentSeasons.some(p=>p.type==='grandtour' && p.tier==='victoire');
  const hadPodium = recentSeasons.some(p=>p.prestige>=3 && (p.tier==='victoire'||p.tier==='podium'));
  const hadTop10 = recentSeasons.some(p=>p.prestige>=3 && (p.tier==='victoire'||p.tier==='podium'||p.tier==='top10'));
  const hadNoAbandon = !recentSeasons.some(p=>p.tier==='abandon'||p.tier==='forfait');

  return SEASON_OBJECTIVES.filter(o=>{
    if(o.id==='aucun') return true;
    if(rep < o.minRep || rep > o.maxRep) return false;
    if(season < (o.minSeason||1)) return false;
    // Ne pas reproposer un objectif déjà accompli facilement
    if(o.id==='survive' && hadNoAbandon && rep > 10) return false;
    if(o.id==='top10' && hadTop10 && rep > 30) return false;
    if(o.id==='podium' && hadPodium && rep > 50) return false;
    if(o.id==='monument' && (hadMonumentWin || hadGTWin)) return false;
    return true;
  });
}
