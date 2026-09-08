const RIVAL_EVENTS = [
  {icon:'⚔️', title:"Un bilan face-à-face qui s'équilibre", titleEN:"An evenly balanced head-to-head record", desc:"Tes chemins croisent sans cesse ceux de {name} en course — un duel qui commence à avoir une vraie histoire.", descEN:"Your paths keep crossing with {name}'s in races — a duel that's starting to have a real history.",
    choices:[
      {label:"Savourer cette rivalité, elle te tire vers le haut", labelEN:"Savour this rivalry, it pushes you to improve", effect:{stats:{mental:2}}},
      {label:"Vouloir en finir, la comparaison permanente pèse", labelEN:"Want it to end, the constant comparison weighs on you", effect:{stats:{mental:1}}},
    ]},
  {icon:'🤝', title:"Des retrouvailles inattendues", titleEN:"An unexpected reunion", desc:"Un hasard de calendrier te fait croiser {name} en dehors des courses — une rencontre plus cordiale que prévu.", descEN:"A quirk of the calendar has you cross paths with {name} outside of racing — a friendlier encounter than expected.",
    choices:[
      {label:"Discuter sincèrement, au-delà de la rivalité sportive", labelEN:"Talk honestly, beyond the sporting rivalry", effect:{stats:{mental:2}, reputation:1}},
      {label:"Rester poli mais distant, la rivalité reste la rivalité", labelEN:"Stay polite but distant, rivalry is rivalry", effect:{stats:{mental:1}}},
    ]},
  {icon:'📰', title:"La presse monte le duel en épingle", titleEN:"The press blows the duel out of proportion", desc:"Les journaux spécialisés ne parlent plus que de ta rivalité avec {name}, parfois plus que de tes propres résultats.", descEN:"The specialist press talks of nothing but your rivalry with {name}, sometimes more than your own results.",
    choices:[
      {label:"Jouer le jeu médiatique autour de ce duel", labelEN:"Play along with the media narrative around this duel", effect:{reputation:2}},
      {label:"Rester en retrait, préférer parler par les jambes", labelEN:"Stay in the background, prefer to let your legs speak", effect:{stats:{mental:1}}},
    ]},
  {icon:'🏆', title:"Une victoire contestée par un rival", titleEN:"A contested victory", desc:"Un adversaire remet publiquement en question ta victoire lors de la dernière course, évoquant une irrégularité de parcours. Les médias s'emparent de l'affaire.", descEN:"A rival publicly questions your last victory, citing a course irregularity. The media pick up the story.",
    choices:[
      {label:"Garder le silence, laisser les commissaires trancher", labelEN:"Stay silent, let the stewards decide", effect:{stats:{mental:-1}}},
      {label:"Répondre vivement pour défendre ta victoire", labelEN:"Respond sharply to defend your win", effect:{reputation:-2, stats:{mental:2}}},
      {label:"Proposer un geste sportif envers le rival", labelEN:"Offer a sporting gesture to the rival", effect:{reputation:2, stats:{mental:1}}},
    ]},
  {icon:'📱', title:"Une sortie malheureuse sur les réseaux", titleEN:"An ill-judged social media post", desc:"Un post publié dans un moment d'agacement crée une polémique inattendue dans le peloton. Certains sponsors appellent ton agent.", descEN:"A post published in a moment of irritation creates unexpected controversy in the peloton. Some sponsors are calling your agent.",
    choices:[
      {label:"Supprimer le post et présenter des excuses publiques", labelEN:"Delete the post and issue a public apology", effect:{reputation:-1, stats:{mental:-1}}},
      {label:"Assumer et défendre ta position jusqu'au bout", labelEN:"Own it and defend your position to the end", effect:{reputation:-4, stats:{mental:3}}},
      {label:"Mettre le compte en pause et laisser passer l'orage", labelEN:"Put the account on pause and let the storm pass", effect:{stats:{mental:-2}}},
    ]},
];
const RIVAL_PAYOFF_EVENT = {payoff:true, icon:'🏆', title:"Un face-à-face historique", titleEN:"A historic rivalry", desc:"Après tant d'accrochages, ce duel avec {name} est devenu l'un des fils rouges de ta carrière — les suiveurs du peloton en parlent comme d'une vraie histoire.", descEN:"After so many clashes, this duel with {name} has become one of the recurring threads of your career — peloton followers talk about it as a real story.",
  choices:[
    {label:"En faire une fierté, un moteur pour la suite", labelEN:"Wear it with pride, a driving force going forward", effect:{stats:{mental:3}, reputation:2}},
    {label:"Espérer enfin tourner la page un jour", labelEN:"Hope to finally turn the page one day", effect:{stats:{mental:1}}},
  ]};
