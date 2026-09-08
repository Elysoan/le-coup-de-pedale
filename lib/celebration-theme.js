function gtJerseys(raceId){
  const j = GT_JERSEYS[raceId] || GT_JERSEYS.tdf;
  if(SETTINGS.lang!=='en') return j;
  return {
    kom:{icon:j.kom.icon, label:j.kom.labelEN},
    points:{icon:j.points.icon, label:j.points.labelEN},
  };
}

function emojiToHex(e){
  const map = {'🔴':'#E5534B', '🟢':'#3CB878', '🔵':'#3E8EF7', '🟣':'#9B6BF2'};
  return map[e] || '#FF8A3D';
}
function celebrationTheme(race, bestTier, jersey){
  if(bestTier !== 'victoire') return {hex:'#FF8A3D', emoji:'🏆'};
  const GC_COLORS = {tdf:{hex:'#FFD34D', emoji:'🟡'}, giro:{hex:'#FF8FC7', emoji:'🎀'}, vuelta:{hex:'#E5534B', emoji:'🔴'}};
  if(jersey && jersey.tier==='victoire'){
    const jerseys = gtJerseys(race.id);
    if(jersey.type==='grimpeur') return {hex: emojiToHex(jerseys.kom.icon), emoji: jerseys.kom.icon};
    if(jersey.type==='sprinteur') return {hex: emojiToHex(jerseys.points.icon), emoji: jerseys.points.icon};
    if(jersey.type==='jeune') return {hex:'#D8D2C0', emoji:'⚪'};
  }
  if(race.type==='grandtour' && GC_COLORS[race.id]) return GC_COLORS[race.id];
  return {hex:'#FF8A3D', emoji:'🏆'};
}
