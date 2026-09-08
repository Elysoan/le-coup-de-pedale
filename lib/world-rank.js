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
