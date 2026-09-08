/* Pondération pour la note globale : les qualités les plus décisives pour gagner
   (montagne, résistance, clm, classiques) comptent plus que le sprint (utile sur moins
   de courses) ou la récupération/mental (effets plus indirects sur la performance brute). */
const GLOBAL_RATING_WEIGHTS = {montagne:0.18, clm:0.15, classiques:0.15, resistance:0.16, sprint:0.12, recuperation:0.10, mental:0.14};
