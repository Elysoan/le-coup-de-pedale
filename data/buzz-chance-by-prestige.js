/* Calendrier du buzz : chaque saison, quelques courses (rarement plus de 3, plus
   probable sur les grosses épreuves) sont marquées comme très suivies — un risque et
   une récompense de réputation amplifiés (cf. repGainFor), pour donner un intérêt
   stratégique de plus au choix du calendrier au-delà du seul prestige fixe des courses. */
const BUZZ_CHANCE_BY_PRESTIGE = {1:0.03, 2:0.08, 3:0.16, 4:0.28, 5:0.42};
