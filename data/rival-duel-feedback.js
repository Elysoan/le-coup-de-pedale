/* ---------- FEEDBACK NARRATIF DUEL RIVAL ----------
   Affiché après le choix du joueur sur un event _isRivalEvent.
   Segmenté selon le résultat (bon/mauvais) et le risk choisi. */
const RIVAL_DUEL_FEEDBACK = {
  good: {
    sur: [
      {fr:"Tu gères. {name} a tenté de faire l'écart mais tu as su placer tes relayeurs au bon moment — l'écart est resté contenu.", en:"{name} tried to break clear but your positioning was perfect. The gap never opened."},
      {fr:"Lecture impeccable de la course. Tu n'as pas cédé à la provocation de {name}, et ça t'a payé.", en:"Flawless race reading. You didn't take {name}'s bait — and it paid off."},
      {fr:"La prudence avait du sens ici. {name} avait l'air fort, mais tu l'as bien contenu.", en:"Caution made sense here. {name} looked strong, but you kept them in check."},
    ],
    equilibre: [
      {fr:"Bon timing. Tu es resté dans la roue de {name} juste ce qu'il fallait — ni trop tôt, ni trop tard.", en:"Good timing. You stayed on {name}'s wheel just long enough — not too early, not too late."},
      {fr:"Jeu d'équilibriste réussi. Tu as su doser ton effort face à {name} sans te découvrir.", en:"Perfectly balanced move. You measured your effort against {name} without overcommitting."},
      {fr:"Décision équilibrée, résultat clair. {name} n'a pas réussi à t'isoler.", en:"Balanced call, clear result. {name} couldn't isolate you."},
    ],
    audacieux: [
      {fr:"Pari gagnant. Tu as pris le contre-pied de {name} au moment où personne ne s'y attendait.", en:"Bold move, right call. You caught {name} off guard at exactly the right moment."},
      {fr:"{name} ne t'a pas vu venir. L'audace a payé — le peloton va en parler.", en:"{name} didn't see it coming. The gamble paid off — the peloton will be talking about this."},
      {fr:"Tu as pris le risque, et c'est passé. Face à {name}, il fallait oser.", en:"You took the risk, and it landed. Against {name}, you had to be bold."},
    ],
  },
  bad: {
    sur: [
      {fr:"Trop sage, peut-être. {name} a pris de l'avance pendant que tu gérais — la prudence a un coût.", en:"Too cautious, maybe. {name} built a gap while you managed — caution has a price."},
      {fr:"Tu t'es protégé, mais {name} en a profité pour prendre le large. L'écart va être difficile à combler.", en:"You protected yourself, but {name} used it to pull away. That gap will be hard to close."},
      {fr:"Jouer la sécurité avait l'air raisonnable — mais {name} s'en est sorti mieux que toi.", en:"Playing it safe seemed reasonable — but {name} came out of it better than you."},
    ],
    equilibre: [
      {fr:"La bonne intention, mais pas le bon moment. {name} avait une longueur d'avance sur toi dans cette séquence.", en:"Right instinct, wrong timing. {name} was a step ahead of you in this sequence."},
      {fr:"L'équilibre n'a pas suffi. {name} a su faire la différence là où tu espérais limiter les dégâts.", en:"Balance wasn't enough. {name} made the difference exactly where you hoped to limit the damage."},
      {fr:"Tu as bien essayé de tenir le cap, mais {name} t'a débordé sur cette phase.", en:"You tried to hold the line, but {name} got past you on this one."},
    ],
    audacieux: [
      {fr:"L'audace ne passe pas à tous les coups. Cette fois-ci, {name} l'a vu venir et en a profité.", en:"Boldness doesn't always pay off. This time, {name} saw it coming and took advantage."},
      {fr:"Trop risqué. Tu t'es découvert face à {name} et ça t'a coûté de l'énergie sans contrepartie.", en:"Too risky. You overcommitted against {name} and it cost you energy for nothing."},
      {fr:"{name} t'attendait sur ce coup-là. L'attaque n'a pas surpris — elle a juste fatigué.", en:"{name} was waiting for that move. The attack didn't surprise — it just tired you out."},
    ],
  },
};
