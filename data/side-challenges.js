/* ---------- DÉFI SECONDAIRE OPTIONNEL ----------
   Un tirage parmi quelques mini-quêtes facultatives par saison, en plus du calendrier
   libre — une petite récompense à la clé, sans jamais rien imposer. */
const SIDE_CHALLENGES = [
  {id:'top5-classique', icon:'🚩', label:"Termine dans le top 5 d'une classique", labelEN:"Finish in the top 5 of a classic", check:(results)=>results.some(x=>(x.type==='classique'||x.type==='monument') && ['victoire','podium','top10'].includes(x.bestTier)), reward:{money:1500}},
  {id:'zero-blessure', icon:'🩹', label:"Termine la saison sans blessure", labelEN:"Finish the season without injury", check:(results, rider, hadInjury)=>!hadInjury, reward:{reputation:2}},
  {id:'une-victoire', icon:'🏆', label:"Remporte au moins une course cette saison", labelEN:"Win at least one race this season", check:(results)=>results.some(x=>x.bestTier==='victoire'), reward:{money:2000}},
  {id:'trois-podiums', icon:'🥈', label:"Décroche 3 podiums ou mieux cette saison", labelEN:"Land 3 podiums or better this season", check:(results)=>results.filter(x=>['victoire','podium'].includes(x.bestTier)).length>=3, reward:{reputation:2}},
  {id:'deux-grands-tours', icon:'🗺️', label:"Termine deux grands tours la même saison", labelEN:"Finish two grand tours in the same season", check:(results)=>results.filter(x=>x.type==='grandtour' && x.bestTier!=='abandon' && x.bestTier!=='forfait').length>=2, reward:{reputation:3}},
  {id:'fatigue-maitrisee', icon:'🧘', label:"Ne dépasse jamais 65 de fatigue toute la saison", labelEN:"Never exceed 65 fatigue all season", check:(results, rider)=>!(STATE&&STATE._seasonMaxFatigue&&STATE._seasonMaxFatigue>65), reward:{reputation:2}},
  {id:'top100-monde', icon:'🌍', label:"Termine la saison dans le top 100 mondial", labelEN:"Finish the season in the world top 100", check:(results, rider)=>rider.worldRank<=100, reward:{reputation:3}},
  {id:'cinq-courses', icon:'🗓️', label:"Course dans au moins 5 épreuves cette saison", labelEN:"Race in at least 5 events this season", check:(results)=>results.filter(x=>x.bestTier!=='forfait').length>=5, reward:{money:1000}},
  {id:'podium-monument', icon:'🥇', label:"Monte sur le podium d'un monument", labelEN:"Reach the podium of a monument", check:(results)=>results.some(x=>x.type==='monument' && ['victoire','podium'].includes(x.bestTier)), reward:{reputation:4}},
  {id:'zero-abandon', icon:'🛡️', label:"Termine toutes tes courses sans abandon ni forfait", labelEN:"Finish every race without abandonment or withdrawal", check:(results)=>!results.some(x=>x.bestTier==='abandon'||x.bestTier==='forfait'), reward:{reputation:2, money:500}},
  {id:'victoire-semitour', icon:'🚵', label:"Remporte un semi-tour cette saison", labelEN:"Win a semi-tour this season", check:(results)=>results.some(x=>x.type==='semitour' && x.bestTier==='victoire'), reward:{money:1500, reputation:2}},
  {id:'deux-victoires', icon:'🎯', label:"Remporte au moins 2 courses cette saison", labelEN:"Win at least 2 races this season", check:(results)=>results.filter(x=>x.bestTier==='victoire').length>=2, reward:{reputation:3, money:1000}},
  {id:'defi-rival', icon:'⚔️', label:"Bats un de tes rivaux au moins une fois cette saison", labelEN:"Beat one of your rivals at least once this season", check:(results)=>results.some(x=>x.rivalBeat), reward:{reputation:3, money:800}},
  {id:'defi-buzz', icon:'📣', label:"Monte sur le podium d'une course très suivie (📣)", labelEN:"Reach the podium of a hyped race (📣)", check:(results)=>results.some(x=>x.buzz && ['victoire','podium'].includes(x.bestTier)), reward:{reputation:3, money:1200}},
];
