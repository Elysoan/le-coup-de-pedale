function pickVariant(def){
  const v = def.variants[Math.floor(Math.random()*def.variants.length)];
  const event = {focus:def.focus};
  Object.defineProperty(event, 'title', {enumerable:true, get(){ return (SETTINGS.lang==='en' && v.titleEN) ? v.titleEN : v.title; }});
  Object.defineProperty(event, 'desc', {enumerable:true, get(){ return (SETTINGS.lang==='en' && v.descEN) ? v.descEN : v.desc; }});
  event.choices = def.choices.map(c => {
    const choice = {risk:c.risk, tilt:c.tilt};
    Object.defineProperty(choice, 'label', {enumerable:true, get(){ return (SETTINGS.lang==='en' && c.labelEN) ? c.labelEN : c.label; }});
    return choice;
  });
  return event;
}

function RACES_DATA(){
  return RACE_DEFS().map(r => {
    let defs = r.eventDefs;
    if(r.sampleWeeks && defs.length > r.sampleWeeks){
      defs = shuffleArr(defs.slice()).slice(0, r.sampleWeeks);
    }
    const race = {...r, events: defs.map(pickVariant)};
    const frName = race.name;
    Object.defineProperty(race, 'name', {enumerable:true, get(){ const v = t('race_'+race.id); return v!==null ? v : frName; }});
    return race;
  });
}
