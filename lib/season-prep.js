function pickRaceOffers(){
  const all = RACES_DATA();
  const rider = STATE.rider;
  const core = all.filter(r => (r.type==='grandtour' || r.type==='monument' || r.type==='champ') && !r.olympic);
  core.forEach(r=>{
    const access = raceAccessCheck(r, rider);
    r.locked = !access.allowed;
    r.lockReason = access.reason;
  });
  const rotatingPool = all.filter(r => r.type==='semitour' || r.type==='crit' || r.type==='classique');
  let offered = core.concat(rotatingPool); // toutes les courses disponibles chaque saison
  if(isOlympicSeason(rider) && Math.random() < olympicSelectionChance(rider)){
    const jo = all.find(r=>r.olympic);
    if(jo){
      offered.push(jo);
      rider.olympicSelections = (rider.olympicSelections||0) + 1;
    }
  }
  return offered.sort((a,b)=>a.month-b.month);
}
function assignSeasonBuzz(pool){
  pool.forEach(race=>{ race.buzz = false; });
  const eligible = pool
    .filter(race=>!race.locked)
    .map(race=>({race, roll:Math.random()}))
    .filter(({race, roll})=>roll < (BUZZ_CHANCE_BY_PRESTIGE[race.prestige]||0.03));
  eligible
    .sort((a,b)=>(b.race.prestige-a.race.prestige) || (b.roll-a.roll))
    .slice(0,3)
    .forEach(({race})=>{ race.buzz = true; });
}

function statFocusAverage(rider, focus){
  const vals = focus.map(k=>rider.stats[k]);
  return vals.reduce((a,b)=>a+b,0)/vals.length;
}
