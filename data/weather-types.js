/* ---------- MÉTÉO ----------
   Une condition tirée à chaque évènement de course, qui vient nuancer le résultat sans
   jamais dominer les stats/choix — un facteur stratégique de plus, pas un nouveau
   système à part entière à maîtriser. */
const WEATHER_TYPES = [
  {id:'soleil', label:'Grand soleil', icon:'☀️', weight:40},
  {id:'pluie', label:'Pluie battante', icon:'🌧️', weight:20},
  {id:'vent', label:'Vent fort', icon:'💨', weight:15},
  {id:'canicule', label:'Canicule', icon:'🥵', weight:15},
  {id:'froid', label:'Froid mordant', icon:'🥶', weight:10},
];
