/* ---------- INTERVIEW D'APRÈS-COURSE ----------
   Après une victoire marquante, un bref échange avec un journaliste fictif — le ton
   choisi a un vrai effet différé : l'humilité rassure sans grand risque, la confiance
   paie plus aujourd'hui mais se retourne contre le coureur si la course suivante n'est
   pas au moins un podium (voir finalizeRace), et la pique enflamme un peu plus le
   duel avec le rival croisé sur cette course, s'il y en avait un. */
const INTERVIEW_REACTIONS_FR = {
  humble: [
    "Les commentateurs saluent ton humilité — « un vrai exemple pour la jeune génération ».",
    "Le public apprécie ta modestie, même si certains regrettent un peu plus de panache.",
    "Peu de bruit sur les réseaux, mais une sympathie tranquille qui s'installe durablement.",
  ],
  confiant: [
    "Tes propos font le tour des réseaux — certains y voient de l'assurance, d'autres de la provocation.",
    "Le ton confiant divise les commentateurs, mais personne ne reste indifférent.",
    "Les paris s'enflamment sur les réseaux après cette déclaration osée.",
  ],
  piquant: [
    "La pique fait immédiatement le buzz — les comptes rivaux s'en donnent à cœur joie dans les réponses.",
    "Le milieu du cyclisme s'agite, entre ceux qui apprécient le culot et ceux qui s'en offusquent.",
    "Tes mots enflamment la toile — pour le meilleur ou pour le pire.",
  ],
};
const INTERVIEW_REACTIONS_EN = {
  humble: [
    "Commentators praise your humility — \"a real example for the younger generation\".",
    "The public appreciates your modesty, though some wish for a bit more flair.",
    "Not much noise online, but a quiet, lasting sympathy builds up.",
  ],
  confiant: [
    "Your words spread fast online — some read confidence, others provocation.",
    "The confident tone divides the commentators, but nobody stays indifferent.",
    "Betting odds shift online after that bold statement.",
  ],
  piquant: [
    "The jab instantly goes viral — rival accounts have a field day in the replies.",
    "The cycling world stirs, split between those who admire the nerve and those offended by it.",
    "Your words set social media alight — for better or worse.",
  ],
};
