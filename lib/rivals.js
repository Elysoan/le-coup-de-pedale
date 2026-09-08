/* Un seul rival, réutilisé à la fois pour le trio initial et pour le remplaçant généré
   quand l'un d'eux prend sa retraite (cf. finishSeason()) — même logique de génération,
   juste un point d'appui pour l'âge et la force de départ. */
function makeRival(countryCode, usedNames, opts){
  opts = opts || {};
  let name, tries = 0;
  do { name = generateRiderName(countryCode); tries++; } while(usedNames.has(name) && tries<30);
  usedNames.add(name);
  // Courses de prestige >= 3 (celles où les rivaux se montrent)
  const prestigeRaces = RACE_DEFS().filter(r=>r.prestige>=3 && r.id!=='champnat' && !r.olympic).map(r=>r.id);
  const rivalRaces = shuffleArr(prestigeRaces).slice(0, 4 + Math.floor(Math.random()*3));
  return {
    name,
    countryCode,
    styleId: STYLES[Math.floor(Math.random()*STYLES.length)].id,
    strength: clamp((opts.strengthBase!=null?opts.strengthBase:42) + Math.random()*16, 25, opts.strengthMax||90),
    raceIds: rivalRaces,
    age: opts.age!=null ? opts.age : (19 + Math.floor(Math.random()*8)),
  };
}

function generateRivals(rider){
  const others = COUNTRIES.filter(c=>c.code!==rider.countryCode);
  const picks = shuffleArr(others).slice(0,3);
  const usedNames = new Set([rider.name]);
  return picks.map(c=>makeRival(c.code, usedNames));
}

function rivalTierLabel(strength){
  if(strength>=75) return tf('rivalEliteTier','élite mondiale');
  if(strength>=55) return tf('rivalStrongTier','solide généraliste');
  if(strength>=35) return tf('rivalPromiseTier','jeune espoir');
  return tf('rivalNewcomerTier','débutant prometteur');
}

/* IA des rivaux réactive : quand plusieurs rivaux sont présents dans la même course,
   celui qui se présente vraiment au joueur (duel direct ou simple confrontation aux
   résultats) n'est plus tiré uniformément — un rival plus fort a davantage de chances
   d'être celui qui se manifeste, comme s'il cherchait le joueur plus activement. */
function pickReactiveRival(candidates){
  if(!candidates || candidates.length===0) return null;
  if(candidates.length===1) return candidates[0];
  const weights = candidates.map(rv=>Math.pow(Math.max(1, rv.strength||1), 1.6));
  const total = weights.reduce((a,b)=>a+b, 0);
  let roll = Math.random()*total;
  for(let i=0;i<candidates.length;i++){
    roll -= weights[i];
    if(roll<=0) return candidates[i];
  }
  return candidates[candidates.length-1];
}

/* Seuil de performance à atteindre pour l'emporter dans un duel/confrontation face à un
   rival donné, désormais fonction de sa force réelle plutôt qu'un seuil fixe de 65 pour
   tout le monde : un débutant prometteur (force ~30) se bat plus facilement, une pointure
   mondiale (force ~85) exige une bien meilleure performance pour être battue. */
function rivalDuelThreshold(strength){
  return clamp(50 + ((strength!=null?strength:50) - 50) * 0.4, 38, 68);
}

/* ---------- RIVALITÉ AVEC ARC NARRATIF ----------
   Le rival avec qui le plus d'accrochages ont eu lieu (victoires + défaites cumulées)
   obtient sa propre petite trajectoire narrative, plutôt que de rester un simple nom
   croisé en course. Le dernier évènement (moment fort) ne se propose qu'au-delà d'un
   seuil d'accrochages, comme un vrai point culminant de rivalité. */
function mostRivaledName(rivalRecords){
  let best = null, bestTotal = 0;
  Object.keys(rivalRecords||{}).forEach(name=>{
    const rec = rivalRecords[name];
    const total = (rec.wins||0) + (rec.losses||0);
    if(total > bestTotal){ bestTotal = total; best = name; }
  });
  return {name:best, total:bestTotal};
}
