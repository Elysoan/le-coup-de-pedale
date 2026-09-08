/* Le coût en fatigue dépend du cumul RÉEL de jours de course déjà disputés cette saison
   (pas d'un total figé calculé au calendrier), de l'intensité de la course (un grand tour
   pèse plus lourd, jour pour jour, qu'une accumulation de courses courtes), et maintenant
   aussi du niveau de risque pris sur le choix : attaquer à fond (audacieux) coûte
   nettement plus cher physiquement que gérer sagement son effort (sûr). */
const RISK_FATIGUE_MULT = {sur:0.75, equilibre:1, audacieux:1.65, loufoque:1};
