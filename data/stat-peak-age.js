/* Âge de pic propre à chaque qualité physique (calibré sur des données réelles de
   cyclisme pro, puis reculé d'un an sur demande) : le sprint pur culmine tôt et décline
   vite, l'endurance/contre-la-montre culmine plus tard et décline plus doucement, le
   mental ne décline quasiment jamais (l'expérience compense la physiologie). */
const STAT_PEAK_AGE = {
  sprint:26, montagne:28, classiques:28, clm:30, resistance:30, recuperation:30, mental:34,
};
