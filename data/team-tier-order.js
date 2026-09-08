/* Fidèle à la réalité : on ne saute jamais un palier d'équipe d'un coup, même avec une
   réputation qui le permettrait largement. Continentale -> ProTeam -> WorldTour ->
   Équipe de légende, un cran à la fois — chaque transfert ne peut viser qu'au maximum
   le palier juste au-dessus de l'équipe actuelle. */
const TEAM_TIER_ORDER = {'Continentale':0, 'ProTeam':1, 'WorldTour':2, 'Équipe de légende':3};
