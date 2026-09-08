function leaderboardConfigured(){
  return typeof LEADERBOARD_API_URL === 'string' && /^https?:\/\//.test(LEADERBOARD_API_URL);
}

/* Détecte le profil émergent du coureur selon ses résultats récents et ses stats dominantes. */
function detectRiderProfile(rider){
  // On ne propose que si le profil actuel semble confirmé OU si les résultats divergent
  const results = (rider.palmares||[]).filter(p=>p.season===rider.season||p.season===rider.season-1);
  if(results.length < 2) return null; // pas assez de données
  const stats = rider.stats;
  // Profil suggéré basé sur la stat dominante
  // Scores normalisés : chaque profil est évalué sur sa stat principale uniquement
  // pour éviter que les profils mixtes (puncheur, rouleur) ne surpassent les purs spécialistes
  const statScores = {
    grimpeur: stats.montagne,
    sprinteur: stats.sprint,
    rouleur: stats.clm,
    puncheur: stats.classiques,
    polyvalent: (stats.montagne+stats.sprint+stats.clm+stats.classiques+stats.resistance)/5,
  };
  const best = Object.entries(statScores).reduce((a,b)=>b[1]>a[1]?b:a)[0];
  // Ne proposer que si le profil détecté diffère du style actuel (vrais ajustements uniquement)
  return best !== rider.styleId ? best : rider.styleId;
}

function interviewReaction(choice){
  const pool = (SETTINGS.lang==='en' ? INTERVIEW_REACTIONS_EN : INTERVIEW_REACTIONS_FR)[choice] || [];
  return pool[Math.floor(Math.random()*pool.length)] || '';
}
