function rollWeather(month, southernHemisphere){
  let m = month;
  if(southernHemisphere) m = ((month + 5) % 12) + 1;
  /* Distance en mois au cœur de l'été (juillet) et de l'hiver (janvier), 0 à 6.
     Un facteur qui retombe à quasi 0 dès qu'on s'éloigne de 3 mois du pic —
     plus de canicule "résiduelle" au printemps ou en automne. */
  const distFromJul = Math.min(Math.abs(m-7), 12-Math.abs(m-7));
  const distFromJan = Math.min(Math.abs(m-1), 12-Math.abs(m-1));
  const summerFactor = clamp(1 - distFromJul/3, 0.02, 1);
  const winterFactor = clamp(1 - distFromJan/3, 0.02, 1);
  const weights = WEATHER_TYPES.map(w=>{
    let wt = w.weight;
    if(w.id==='canicule') wt = wt * summerFactor;
    if(w.id==='froid') wt = wt * winterFactor;
    return wt;
  });
  const total = weights.reduce((a,b)=>a+b, 0);
  let r = Math.random()*total;
  for(let i=0;i<WEATHER_TYPES.length;i++){ if(r<weights[i]) return WEATHER_TYPES[i]; r-=weights[i]; }
  return WEATHER_TYPES[0];
}
function weatherPerfModifier(weatherId, focus){
  if(weatherId==='pluie') return focus.includes('classiques') ? 3 : -2;
  if(weatherId==='vent') return (focus.includes('clm')||focus.includes('resistance')) ? 3 : -2;
  if(weatherId==='froid') return focus.includes('resistance') ? 1 : -1;
  return 0;
}
function weatherFatigueMult(weatherId){
  if(weatherId==='canicule') return 1.18;
  if(weatherId==='froid') return 1.06;
  return 1;
}
function weatherCrashMult(weatherId){
  return weatherId==='pluie' ? 1.5 : 1;
}
