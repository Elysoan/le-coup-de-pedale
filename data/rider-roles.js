/* ---------- RÔLES CONTRACTUELS ---------- */
/* Un rôle est proposé à chaque signature de contrat selon le style du coureur,
   la spécialité de l'équipe, et son niveau de réputation.
   Il est stocké sur rider.role et influence salaire, courses suggérées, objectifs. */

const RIDER_ROLES = [
  {id:'leader-gc',   name:'Leader GC',            nameEN:'GC Leader',             icon:'👑', styles:['grimpeur','rouleur'],        specialties:['montagne','resistance',null]},
  {id:'leader-clas', name:'Leader Classiques',     nameEN:'Classics Leader',       icon:'🏆', styles:['puncheur','baroudeur'],      specialties:['classiques',null]},
  {id:'leader-spr',  name:'Leader Sprint',         nameEN:'Sprint Leader',         icon:'⚡', styles:['sprinteur'],                 specialties:['sprint',null]},
  {id:'leader-clm',  name:'Leader CLM',            nameEN:'TT Leader',             icon:'⏱️', styles:['rouleur'],                   specialties:['clm',null]},
  {id:'equip-mont',  name:'Équipier Montagne',     nameEN:'Mountain Domestique',   icon:'⛰️', styles:['grimpeur','polyvalent'],     specialties:['montagne','resistance']},
  {id:'equip-poly',  name:'Équipier Polyvalent',   nameEN:'All-round Domestique',  icon:'🔧', styles:['polyvalent','rouleur','puncheur','sprinteur','grimpeur'], specialties:['classiques','sprint','clm','resistance','montagne',null]},
];
