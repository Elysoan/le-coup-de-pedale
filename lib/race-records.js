function recordGlobalRaceResult(race, tier, rider){
  const existing = RACE_RECORDS[race.id];
  if(!existing || TIER_VALUE[tier] > TIER_VALUE[existing.tier]){
    RACE_RECORDS[race.id] = {tier, riderName: rider.name, season: rider.season};
  }
}
