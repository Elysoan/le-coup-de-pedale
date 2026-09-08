/* Calcule le rôle que propose une équipe à un coureur donné */
/* Score de prestige qualitatif du palmarès :
   Pondère les victoires par type de course pour distinguer
   un coureur avec 60 rep en petites courses d'un avec 60 rep en monuments. */
function palmaresPrestigeScore(rider){
  const weights = {grandtour:5, monument:4, semitour:2, classique:1, crit:0.5, champ:1};
  let score = 0;
  (rider.palmares||[]).forEach(p=>{
    if(p.tier === 'victoire') score += (weights[p.type]||0.5) * 2;
    else if(p.tier === 'podium') score += (weights[p.type]||0.5) * 0.8;
    else if(p.tier === 'top10') score += (weights[p.type]||0.5) * 0.2;
  });
  return Math.round(score);
}

/* Étiquette qualitative du profil palmares */
function palmaresPrestigeLabel(score, lang){
  if(score >= 30) return {label: lang ? 'Grand Tour pedigree' : 'Palmarès de Grand Tour', color:'var(--pink)'};
  if(score >= 18) return {label: lang ? 'Monument hunter' : 'Chasseur de monuments', color:'var(--yellow)'};
  if(score >= 10) return {label: lang ? 'Stage race specialist' : 'Spécialiste courses à étapes', color:'var(--blue)'};
  if(score >= 4)  return {label: lang ? 'Solid classics rider' : 'Classicman solide', color:'var(--green-dark)'};
  if(score >= 1)  return {label: lang ? 'Rising talent' : 'Talent en devenir', color:'var(--text-soft)'};
  return null;
}

function computeOfferedRole(rider, team){
  const tierThresholds = {'Continentale':15,'ProTeam':30,'WorldTour':50,'Équipe de légende':70};
  let leaderThreshold = tierThresholds[team.tier] || 15;
  /* Palmarès qualitatif : un coureur avec des victoires en GT/monuments accède
     au statut de leader plus facilement — la réputation "brute" seule ne suffit pas
     à distinguer un sprinteur de critériums d'un vainqueur de Monument. */
  const _prestige = palmaresPrestigeScore(rider);
  if(_prestige >= 18) leaderThreshold = Math.max(10, leaderThreshold - 10); // pedigree monument/GT
  else if(_prestige >= 8) leaderThreshold = Math.max(10, leaderThreshold - 5); // solide
  const isLeader = rider.reputation >= leaderThreshold;
  const style = rider.styleId;
  const spec = team.specialty;

  if(!isLeader){
    // Équipier : choisir le plus adapté
    if(['grimpeur'].includes(style) && ['montagne','resistance'].includes(spec)) return RIDER_ROLES.find(r=>r.id==='equip-mont');
    return RIDER_ROLES.find(r=>r.id==='equip-poly');
  }

  // Leader : selon style + spécialité équipe
  if(style==='grimpeur' || (style==='rouleur' && spec!=='clm')){
    if(spec==='montagne' || spec==='resistance' || spec===null) return RIDER_ROLES.find(r=>r.id==='leader-gc');
  }
  if(style==='rouleur' && spec==='clm') return RIDER_ROLES.find(r=>r.id==='leader-clm');
  if(style==='sprinteur') return RIDER_ROLES.find(r=>r.id==='leader-spr');
  if(style==='puncheur' || style==='baroudeur'){
    if(spec==='classiques' || spec===null) return RIDER_ROLES.find(r=>r.id==='leader-clas');
  }
  if(style==='polyvalent'){
    if(spec==='sprint') return RIDER_ROLES.find(r=>r.id==='leader-spr');
    if(spec==='clm') return RIDER_ROLES.find(r=>r.id==='leader-clm');
    if(spec==='classiques') return RIDER_ROLES.find(r=>r.id==='leader-clas');
    return RIDER_ROLES.find(r=>r.id==='leader-gc');
  }
  return RIDER_ROLES.find(r=>r.id==='leader-gc');
}
