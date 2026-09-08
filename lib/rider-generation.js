function generateRiderName(countryCode){
  const pool = NAME_POOLS[countryCode] || NAME_POOLS.FR;
  const f = pool.first[Math.floor(Math.random()*pool.first.length)];
  const l = pool.last[Math.floor(Math.random()*pool.last.length)];
  return `${f} ${l}`;
}
function generateTeammate(){
  const archetype = TEAMMATE_ARCHETYPES[Math.floor(Math.random()*TEAMMATE_ARCHETYPES.length)];
  const country = COUNTRIES[Math.floor(Math.random()*COUNTRIES.length)];
  return {name: generateRiderName(country.code), countryCode: country.code, archetype, bond:50};
}
function computeBaseStats(styleId){
  const style = STYLES.find(s=>s.id===styleId);
  const base = {montagne:40, sprint:40, clm:40, classiques:40, resistance:45, recuperation:45, mental:50};
  const stats = {};
  STAT_KEYS.forEach(k=>{
    stats[k] = clamp(base[k] + (style.bonus[k]||0), 15, 90);
  });
  return stats;
}

function newRider(name, countryCode, styleId){
  const stats = computeBaseStats(styleId);
  return {
    name: name || 'Coureur inconnu',
    countryCode, styleId,
    age: 19 + Math.floor(Math.random()*3),
    stats,
    reputation: 8,
    teamId: starterTeamFor(styleId).id,
    rareTrophiesAtStart: Array.from(UNLOCKED).filter(id=>{ const a=ACHIEVEMENTS.find(x=>x.id===id); return a && a.rare; }),
    teamConfidence: 55,
    contractYearsLeft: 2,
    teamChanges: 0,
    fatigue: 0,
    season: 1,
    money: 1500,
    palmares: [],
    careerFlags: {},
    trajectory: null,
    seasonLog: [],
    retired: false,
    isNationalChampion: false,
    nationalTitles: 0,
    olympicGold: 0,
    stageWins: 0,
    sponsor: null,
    pendingConfidentBet: false,
    teammate: null,
    journal: [],
    isMentor: false,
    mentorOfferDeclined: false,
    worldRank: 450,
    fame: 20,
    olympicSilver: 0,
    olympicBronze: 0,
    olympicSelections: 0,
    role: null,
  };
}
