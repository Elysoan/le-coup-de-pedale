function causeLabelFor(cause){
  return cause==='chute' ? `💥 ${tf('fallWord','Chute')}` : `🥵 ${tf('overexertionWord','Surmenage')}`;
}

function handleInjury(cause, race, precomputedEntry){
  STATE.hadInjuryThisSeason = true;
  const causeLabel = causeLabelFor(cause);
  const entry = precomputedEntry || {
    title:causeLabel, choiceLabel:tf('bodyDoneRest','Corps à bout, le staff médical impose le repos'),
    risk:'sur', tier:'abandon', perf:0, trained:null
  };
  STATE.runRaceAccum.push(entry);
  STATE.rider.fatigue = clamp(STATE.rider.fatigue + (cause==='chute' ? 12 : 6), 0, 100);
  STATE.pendingInjury = {severity: injurySeverity(STATE.rider, cause), cause, causeLabel};
  finalizeRace();
}
