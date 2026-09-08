/* Couleurs réelles des maillots annexes par grand tour (vérifiées) :
   Tour de Gaule (TDF) : pois rouges (grimpeur) / vert (points) / blanc (jeune)
   Giro dell'Impero (Giro) : bleu (grimpeur, maglia azzurra) / cyclamen (points, maglia ciclamino) / blanc (jeune)
   Vuelta a Iberia (Vuelta) : pois bleus (grimpeur) / vert (points) / blanc (jeune)
   Le maillot du meilleur jeune est blanc sur les 3 grands tours réels — pas de variation à faire dessus. */
const GT_JERSEYS = {
  tdf:    {kom:{icon:'🔴', label:'maillot à pois', labelEN:'polka dot jersey'},    points:{icon:'🟢', label:'maillot vert', labelEN:'green jersey'}},
  giro:   {kom:{icon:'🔵', label:'maillot bleu', labelEN:'blue jersey'},       points:{icon:'🟣', label:'maillot cyclamen', labelEN:'cyclamen jersey'}},
  vuelta: {kom:{icon:'🔵', label:'maillot à pois bleus', labelEN:'blue polka dot jersey'}, points:{icon:'🟢', label:'maillot vert', labelEN:'green jersey'}},
};
