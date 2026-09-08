/* ---------- EVENTS RIVAL EN COURSE ----------
   Déclenchés quand un rival est présent dans la course.
   Injectés comme phase bonus supplémentaire si un rival figure dans race.raceIds.
   Format identique aux bonus phases : focus, title, desc, choices. */
const RIVAL_RACE_EVENTS = [
  {
    focus: ['mental','classiques'],
    variants: [
      {title:"Dans la roue du rival", titleEN:"On the rival's wheel",
       desc:"Dans le final, {name} se retrouve juste devant toi. Tu peux rester dans sa roue et profiter de son travail, ou tenter de le surprendre.",
       descEN:"{name} is right ahead of you in the finale. You can sit on their wheel and benefit from their pace, or try to surprise them."},
      {title:"Le regard du rival", titleEN:"The rival's glance",
       desc:"{name} t'a repéré dans le groupe de tête. Un bref regard s'échange — les deux équipes savent que la course va se jouer entre vous.",
       descEN:"{name} has spotted you in the lead group. A brief glance is exchanged — both teams know the race will be decided between you."},
    ],
    choices: [
      {label:"Rester dans sa roue, sprinter au bon moment", labelEN:"Stay on their wheel, sprint at the right moment", risk:'equilibre', tilt:['sprint','mental']},
      {label:"Attaquer en premier, le prendre de vitesse", labelEN:"Attack first, catch them off guard", risk:'audacieux', tilt:['classiques','mental']},
      {label:"Couvrir ses mouvements, laisser l'équipe travailler", labelEN:"Cover their moves, let the team work", risk:'sur', tilt:['resistance']},
    ]
  },
  {
    focus: ['montagne','mental'],
    variants: [
      {title:"Duel au sommet", titleEN:"Summit duel",
       desc:"{name} accélère dans la montée finale. C'est le moment de vérité : sa grimpe contre la tienne.",
       descEN:"{name} accelerates on the final climb. This is the moment of truth: their climbing against yours."},
      {title:"La contre-attaque du rival", titleEN:"The rival's counterattack",
       desc:"Tu croyais avoir lâché {name}, mais il revient dans ta roue à 2 km du sommet. Il n'est pas encore éliminé.",
       descEN:"You thought you'd dropped {name}, but they come back to your wheel 2km from the summit. They're not done yet."},
    ],
    choices: [
      {label:"Accélérer pour le craquer définitivement", labelEN:"Accelerate to crack them once and for all", risk:'audacieux', tilt:['montagne','mental']},
      {label:"Maintenir ton rythme et gérer la distance", labelEN:"Hold your pace and manage the gap", risk:'equilibre', tilt:['montagne','resistance']},
      {label:"Feindre la faiblesse pour mieux repartir", labelEN:"Feign weakness to recover and strike later", risk:'sur', tilt:['mental']},
    ]
  },
  {
    focus: ['classiques','resistance'],
    variants: [
      {title:"Manœuvre d'équipe contre le rival", titleEN:"Team tactics against the rival",
       desc:"Ton équipe a repéré que {name} est seul en tête. C'est le moment de rouler pour te mettre en position idéale.",
       descEN:"Your team has spotted {name} alone at the front. Time to ride and put you in the perfect position."},
      {title:"Le piège du rival", titleEN:"The rival's trap",
       desc:"{name} envoie son équipier en échappée — une provocation pour t'obliger à dépenser de l'énergie sur ses termes.",
       descEN:"{name} sends a teammate in the break — a provocation to force you to spend energy on their terms."},
    ],
    choices: [
      {label:"Laisser partir l'équipier, contrôler depuis le peloton", labelEN:"Let the teammate go, control from the peloton", risk:'sur', tilt:['resistance','mental']},
      {label:"Envoyer un équipier à ta place pour répondre", labelEN:"Send your own teammate to respond", risk:'equilibre', tilt:['resistance']},
      {label:"Partir toi-même, montrer que tu ne te laisses pas manipuler", labelEN:"Go yourself, show you won't be manipulated", risk:'audacieux', tilt:['classiques','mental']},
    ]
  },
  {
    focus: ['sprint','mental'],
    variants: [
      {title:"Le sprint face au rival", titleEN:"The sprint against the rival",
       desc:"La ligne arrive. {name} est à ta hauteur, les mâchoires serrées. Tout va se jouer dans les 200 derniers mètres.",
       descEN:"The line is coming. {name} is right beside you, jaw set. Everything will be decided in the final 200 metres."},
      {title:"La relance explosive du rival", titleEN:"The rival's explosive surge",
       desc:"{name} se lève sur les pédales à 300m. Tu dois répondre maintenant ou le laisser filer.",
       descEN:"{name} jumps out of the saddle at 300m. You have to respond now or let them go."},
    ],
    choices: [
      {label:"Partir en même temps, s'appuyer sur ta pointe de vitesse", labelEN:"Go at the same time, rely on your top speed", risk:'audacieux', tilt:['sprint']},
      {label:"Partir 50m après lui, profiter de son élan", labelEN:"Go 50m after them, use their momentum", risk:'equilibre', tilt:['sprint','mental']},
      {label:"Attendre le dernier moment pour déborder", labelEN:"Wait for the last moment to come around", risk:'sur', tilt:['sprint','mental']},
    ]
  },
  {
    focus: ['resistance','mental'],
    variants: [
      {title:"Une course de harcèlement", titleEN:"A race of attrition",
       desc:"{name} et toi vous vous rendez coup pour coup depuis le départ. C'est une guerre d'usure — qui craquera en premier ?",
       descEN:"{name} and you have been trading blows since the start. It's a war of attrition — who will crack first?"},
      {title:"L'accélération surprise du rival", titleEN:"The rival's surprise acceleration",
       desc:"{name} place une attaque dans un faux-plat montant, là où personne ne l'attendait. Le peloton est surpris.",
       descEN:"{name} attacks on a false flat climb, where nobody expected it. The peloton is caught off guard."},
    ],
    choices: [
      {label:"Répondre immédiatement, ne pas laisser d'écart", labelEN:"Respond immediately, don't let a gap open", risk:'audacieux', tilt:['resistance','mental']},
      {label:"Gérer depuis le peloton, reprendre plus tard", labelEN:"Manage from the peloton, chase back later", risk:'equilibre', tilt:['resistance']},
      {label:"Laisser partir, économiser pour le final", labelEN:"Let them go, save energy for the finale", risk:'sur', tilt:['mental']},
    ]
  },
];
