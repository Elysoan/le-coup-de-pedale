function tierNarrative(tier){
  const arr = TIER_NARRATIVE[tier] || [''];
  return arr[Math.floor(Math.random()*arr.length)];
}

function injuryReason(cause){
  const arr = INJURY_REASONS[cause] || [''];
  return arr[Math.floor(Math.random()*arr.length)];
}

/* Classement final indicatif, purement narratif (n'a aucune incidence sur le jeu) —
   juste pour donner une idée concrète de la place occupée dans le peloton ce jour-là. */
/* Position numérique brute dans une course, dérivée du tier et de la perf réelle —
   séparée de l'affichage pour pouvoir aussi servir de base au classement mondial. */
function placementNumber(tier, perf){
  if(tier==='victoire') return 1;
  if(tier==='abandon' || tier==='forfait') return null;
  const ranges = {
    podium: {min:72, max:87, posMin:2, posMax:3},
    top10: {min:55, max:71, posMin:4, posMax:10},
    peloton: {min:32, max:54, posMin:11, posMax:80},
    jourssans: {min:0, max:31, posMin:60, posMax:150},
  };
  const r = ranges[tier];
  if(!r) return null;
  const p = clamp(perf==null ? (r.min+r.max)/2 : perf, r.min, r.max);
  const frac = (p - r.min) / ((r.max - r.min) || 1);
  const pos = Math.round(r.posMax - frac*(r.posMax-r.posMin));
  const noise = Math.floor(Math.random()*3) - 1;
  return clamp(pos+noise, r.posMin, r.posMax);
}

function estimatePlacement(tier, perf){
  if(tier==='abandon') return tf('placementDNF','Non classé (abandon)');
  if(tier==='forfait') return tf('placementDNS','Non partant');
  const pos = placementNumber(tier, perf);
  if(pos===1) return tf('placement1st','1er');
  return pos+'e';
}
