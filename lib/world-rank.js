/* Un numéro 1 mondial sans la moindre victoire marquante n'existe pas dans la réalité —
   même une accumulation de podiums/top10 sur des dizaines de courses ne suffit jamais à
   elle seule à atteindre le sommet. Ce plancher empêche le classement de descendre
   au-delà d'un certain seuil tant qu'aucune victoire suffisamment prestigieuse n'a été
   décrochée, quel que soit le nombre de bons résultats accumulés par ailleurs. */
function worldRankFloor(rider){
  const wins = (rider.palmares || []).filter(p=>p.tier==='victoire');
  if(wins.length===0) return 15;
  const bestPrestige = Math.max(...wins.map(w=>w.prestige || 1));
  if(bestPrestige>=5) return 1;
  if(bestPrestige===4) return 2;
  if(bestPrestige===3) return 4;
  if(bestPrestige===2) return 7;
  return 10; // uniquement des victoires sur de petites courses (prestige 1)
}

/* Plancher symétrique côté chute : un coureur qui a déjà décroché une victoire
   suffisamment prestigieuse ne devrait pas pouvoir s'effondrer jusqu'au fin fond du
   classement après une mauvaise série — sans ça, le mot "plancher" ne protège que la
   montée et jamais la chute, ce qui n'a pas de sens pour un palmarès déjà acquis. */
function worldRankCeiling(rider){
  const wins = (rider.palmares || []).filter(p=>p.tier==='victoire');
  if(wins.length===0) return 900;
  const bestPrestige = Math.max(...wins.map(w=>w.prestige || 1));
  if(bestPrestige>=5) return 60;
  if(bestPrestige===4) return 120;
  if(bestPrestige===3) return 220;
  if(bestPrestige===2) return 350;
  return 500; // uniquement des victoires sur de petites courses (prestige 1)
}

function updateWorldRank(rider, bestTier, racePrestige, perf){
  if(typeof rider.worldRank !== 'number') rider.worldRank = 450;
  if(typeof rider.peakWorldRank !== 'number') rider.peakWorldRank = rider.worldRank;
  if(bestTier==='forfait') return;
  const prestigeMult = 1 + (racePrestige-1)*0.35;
  if(bestTier==='abandon'){
    rider.worldRank = clamp(Math.round(rider.worldRank + 5*prestigeMult), 1, 900);
    rider.worldRank = Math.min(rider.worldRank, worldRankCeiling(rider));
    rider.peakWorldRank = Math.min(rider.peakWorldRank, rider.worldRank);
    return;
  }
  const pos = placementNumber(bestTier, perf);
  if(pos!==null && pos <= 29){
    /* La victoire compte à part : un gain plein, jamais partagé avec les places
       suivantes. Du 2e au 29e, la progression est dégressive mais plafonnée à un peu
       plus de la moitié du gain d'une victoire — fidèle aux vrais barèmes UCI, où le
       vainqueur touche largement plus que le 2e ou 3e (pas un simple partage linéaire). */
    const improvementFactor = pos===1 ? 1.0 : 0.55 * (30 - pos) / 29;
    const maxSwing = 38;
    const delta = Math.round(maxSwing * improvementFactor * prestigeMult);
    rider.worldRank = clamp(rider.worldRank - delta, 1, 900);
    rider.worldRank = Math.max(rider.worldRank, worldRankFloor(rider));
  } else if(pos!==null && pos >= 60){
    /* Au-delà de la 30e place, plus aucune amélioration possible — mais un très mauvais
       résultat peut quand même coûter un peu de terrain, comme une contre-performance
       qui n'échappe pas aux observateurs. */
    rider.worldRank = clamp(Math.round(rider.worldRank + 2*prestigeMult), 1, 900);
    rider.worldRank = Math.min(rider.worldRank, worldRankCeiling(rider));
  }
  // Entre la 30e et la 59e place : zone neutre, aucun mouvement dans un sens ou l'autre.
  rider.peakWorldRank = Math.min(rider.peakWorldRank, rider.worldRank);
}

function riderFormStatus(rider){
  const results = STATE.seasonSummary ? STATE.seasonSummary.results : [];
  const last = results[results.length-1];
  /* Même pondération que "forme" dans resolveEvent (100 - fatigue*0.75) — pour que le
     libellé affiché reflète vraiment ce qui compte dans le calcul de performance. */
  let score = 100 - rider.fatigue*0.75;
  if(last){
    if(last.bestTier==='victoire') score += 12;
    else if(last.bestTier==='podium') score += 6;
    else if(last.bestTier==='jourssans' || last.bestTier==='abandon') score -= 10;
  }
  if(score>=75) return {icon:'💪', label:tf('formGreat','En pleine forme')};
  if(score>=50) return {icon:'🙂', label:tf('formOk','Jambes correctes')};
  if(score>=25) return {icon:'😓', label:tf('formHeavy','Jambes lourdes')};
  return {icon:'🥵', label:tf('formExhausted','Épuisé')};
}
