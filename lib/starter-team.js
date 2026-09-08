function totalCareerWins(){
  return CAREER_HISTORY.reduce((sum,c)=>sum+(c.wins||0), 0);
}
function starterTeamFor(styleId){
  const total = totalCareerWins();
  let tier = null;
  if(total>=60) tier = 'WorldTour';
  else if(total>=25) tier = 'ProTeam';
  if(!tier) return TEAMS.find(t=>t.id==='velo-passion');
  const pool = TEAMS.filter(t=>t.tier===tier);
  const specialty = STYLE_TEAM_SPECIALTY[styleId] || null;
  return (specialty && pool.find(t=>t.specialty===specialty)) || pool.find(t=>!t.specialty) || pool[0];
}
