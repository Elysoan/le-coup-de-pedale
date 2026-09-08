const TEAMMATE_EVENTS = {
  domestique: [
    {icon:'🤝', title:"{name}, toujours au front pour toi", titleEN:"{name}, always at the front for you", desc:"{name} a une fois de plus sacrifié ses propres chances pour te protéger dans le peloton et te ramener aux avant-postes.", descEN:"{name} has once again sacrificed his own chances to protect you in the peloton and bring you back to the front.",
      choices:[
        {label:"Le remercier publiquement pour son travail de l'ombre", labelEN:"Thank him publicly for his behind-the-scenes work", effect:{reputation:1, stats:{mental:2}}, bond:8},
        {label:"Considérer que ça fait partie de son rôle, sans plus", labelEN:"Consider it's just part of his role, nothing more", effect:{stats:{mental:1}}, bond:-3},
      ]},
    {icon:'😮‍💨', title:"Une fatigue partagée", titleEN:"A shared exhaustion", desc:"{name} montre des signes d'épuisement à force de rouler pour toi course après course.", descEN:"{name} is showing signs of exhaustion after riding for you race after race.",
      choices:[
        {label:"Proposer qu'il lève un peu le pied la prochaine fois", labelEN:"Suggest he eases off a little next time", effect:{}, bond:6},
        {label:"Continuer de compter sur lui à fond", labelEN:"Keep relying on him fully", effect:{stats:{mental:1}}, bond:-2},
      ]},
    {payoff:true, icon:'🎽', title:"Une ligne droite offerte", titleEN:"A finish line handed over", desc:"Sur une petite course sans enjeu pour ton classement, tu ralentis légèrement pour laisser {name} lever les bras — en reconnaissance de tous ses sacrifices.", descEN:"On a small race with nothing at stake for your standings, you ease off slightly to let {name} raise his arms — in recognition of all his sacrifices.",
      choices:[
        {label:"Le laisser savourer pleinement ce moment", labelEN:"Let him savour the moment fully", effect:{reputation:1}, bond:15},
        {label:"Reprendre l'avantage au dernier moment, l'occasion était trop belle", labelEN:"Take it back at the last moment, the chance was too good", effect:{stats:{mental:1}}, bond:-15},
      ]},
  ],
  espoir: [
    {icon:'🧑‍🏫', title:"{name} sollicite tes conseils", titleEN:"{name} asks for your advice", desc:"Impressionné par ton expérience, {name} vient chercher tes conseils pour progresser plus vite.", descEN:"Impressed by your experience, {name} comes to you for advice to progress faster.",
      choices:[
        {label:"Prendre le temps de le former", labelEN:"Take the time to mentor him", effect:{stats:{mental:2}, fatigue:2}, bond:8},
        {label:"Rester concentré sur tes propres objectifs", labelEN:"Stay focused on your own goals", effect:{}, bond:-3},
      ]},
    {icon:'📈', title:"{name} progresse vite", titleEN:"{name} is improving fast", desc:"Les performances de {name} s'améliorent course après course, au point de commencer à te talonner.", descEN:"{name}'s performances keep improving race after race, to the point of starting to breathe down your neck.",
      choices:[
        {label:"T'en réjouir sincèrement", labelEN:"Be genuinely happy for him", effect:{stats:{mental:2}}, bond:6},
        {label:"Ressentir une pointe de rivalité naissante", labelEN:"Feel a hint of budding rivalry", effect:{stats:{mental:1}}, bond:-4},
      ]},
    {payoff:true, icon:'🌅', title:"Le jour où {name} te dépasse", titleEN:"The day {name} overtakes you", desc:"Sur une course sans grand enjeu pour toi, {name} s'impose pour la première fois devant toi au sprint final.", descEN:"In a race with little at stake for you, {name} beats you for the first time in the final sprint.",
      choices:[
        {label:"L'accueillir avec fierté, la relève est là", labelEN:"Welcome it with pride, the next generation has arrived", effect:{reputation:2}, bond:15},
        {label:"Ravaler une déception difficile à cacher totalement", labelEN:"Swallow a disappointment hard to hide completely", effect:{}, bond:-8},
      ]},
  ],
  veteran: [
    {icon:'🎓', title:"{name} partage son expérience", titleEN:"{name} shares his experience", desc:"Des années de peloton ont donné à {name} un regard précieux, qu'il partage volontiers avec toi.", descEN:"Years in the peloton have given {name} a valuable perspective, which he happily shares with you.",
      choices:[
        {label:"Écouter attentivement ses conseils", labelEN:"Listen closely to his advice", effect:{stats:{mental:2}}, bond:8},
        {label:"Suivre avant tout ta propre intuition", labelEN:"Trust your own instincts above all", effect:{stats:{mental:1}}, bond:-3},
      ]},
    {icon:'👋', title:"Les adieux approchent", titleEN:"The farewell draws near", desc:"La retraite de {name} se profile, et une certaine mélancolie gagne discrètement le groupe.", descEN:"{name}'s retirement is looming, and a quiet melancholy is settling over the group.",
      choices:[
        {label:"L'aider à préparer cette transition", labelEN:"Help him prepare for this transition", effect:{stats:{mental:1}}, bond:8},
        {label:"Rester pudique, ne pas trop en parler", labelEN:"Stay discreet, not dwell on it too much", effect:{}, bond:2},
      ]},
    {payoff:true, icon:'🏁', title:"La dernière course de {name}", titleEN:"{name}'s last race", desc:"Pour sa dernière saison, {name} dispute ce qui sera sa toute dernière course professionnelle à tes côtés.", descEN:"For his final season, {name} rides what will be his very last professional race by your side.",
      choices:[
        {label:"Tout faire pour l'aider à briller une dernière fois", labelEN:"Do everything to help him shine one last time", effect:{reputation:2, fatigue:3}, bond:15},
        {label:"Rester concentré sur ton propre résultat du jour", labelEN:"Stay focused on your own result for the day", effect:{}, bond:-10},
      ]},
  ],
};
