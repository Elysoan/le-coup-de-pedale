/* ---------- PHASES NARRATIVES BONUS (Évolution 6) ----------
   Pool de moments tactiques injectés en début de course selon le prestige.
   Prestige 1 : 0-1 phase | Prestige 2-3 : 1-2 phases | Prestige 4-5 : 2-3 phases.
   Ces phases passent par resolveEvent() et influencent le score final. */

const BONUS_PHASE_POOL = [
  { focus:['resistance','mental'],
    variants:[
      {title:"Échauffement sous tension", titleEN:"Warm-up under pressure",
       desc:"Le peloton est nerveux dès le départ. Plusieurs équipes lancent des accélérations pour tester les jambes. Comment tu gères ces premiers kilomètres ?", descEN:"The peloton is nervous from the start. Several teams are testing the legs early. How do you handle these opening kilometres?"},
      {title:"Début de course chaotique", titleEN:"Chaotic race start",
       desc:"Chutes, contre-attaques, fanions dans tous les sens. La course part vite et fort. Tu dois placer tes premières cartes.", descEN:"Crashes, counter-attacks, fans everywhere. The race starts fast and hard. Time to play your opening cards."},
    ],
    choices:[
      {label:"Rester en sécurité dans le ventre du peloton", labelEN:"Stay safe in the bunch", risk:'sur', tilt:['recuperation']},
      {label:"Se placer dans les dix premières roues", labelEN:"Move up to the top ten wheels", risk:'equilibre', tilt:['mental','resistance']},
      {label:"Partir dans la première échappée", labelEN:"Jump in the first breakaway", risk:'audacieux', tilt:['resistance','mental']},
    ]
  },
  { focus:['mental','recuperation'],
    variants:[
      {title:"Ravitaillement raté", titleEN:"Missed feed zone",
       desc:"La zone de ravitaillement est bondée. Ton bidon t'échappe des mains. Tu dois gérer l'effort sans apport d'énergie suffisant.", descEN:"The feed zone is packed. Your bottle slips away. You have to manage without proper fuelling."},
      {title:"La gestion de l'effort", titleEN:"Pacing the effort",
       desc:"À mi-course, tu sens la fatigue pointer. Certains adversaires accélèrent pour provoquer des sélections. Quelle est ta stratégie ?", descEN:"Mid-race, you feel the fatigue creeping in. Rivals are accelerating to cause splits. What's your strategy?"},
    ],
    choices:[
      {label:"Économiser pour la fin, rester dans la roue", labelEN:"Save energy, stay on wheels", risk:'sur', tilt:['recuperation']},
      {label:"Maintenir le rythme imposé, sans forcer", labelEN:"Hold the pace without pushing", risk:'equilibre', tilt:['mental','recuperation']},
      {label:"Profiter de la confusion pour attaquer", labelEN:"Use the confusion to attack", risk:'audacieux', tilt:['mental','resistance']},
    ]
  },
  { focus:['sprint','mental'],
    variants:[
      {title:"La guerre des positions", titleEN:"The positioning battle",
       desc:"À 30 km de l'arrivée, les équipes de sprinteurs commencent à contrôler. Chaque roue compte. Le bordel commence.", descEN:"30km out, sprint teams are taking control. Every wheel counts. The chaos begins."},
      {title:"Tension dans le final", titleEN:"Tension in the finale",
       desc:"L'arrivée approche. Les nerfs lâchent dans le peloton. Un adversaire direct se colle à ta roue et ne te lâche plus.", descEN:"The finish is approaching. Nerves are fraying in the peloton. A direct rival is glued to your wheel."},
    ],
    choices:[
      {label:"Laisser le train se former, sprinter sur lancée", labelEN:"Let the lead-out form, sprint on speed", risk:'sur', tilt:['sprint']},
      {label:"Se glisser dans le train adverse", labelEN:"Slot into the rival train", risk:'equilibre', tilt:['sprint','mental']},
      {label:"Attaque surprise à 400 mètres", labelEN:"Surprise attack at 400 metres", risk:'audacieux', tilt:['sprint','mental']},
    ]
  },
  { focus:['montagne','resistance'],
    variants:[
      {title:"Le col décisif", titleEN:"The decisive climb",
       desc:"Le grand col du jour commence. L'allure s'emballe. Les groupes se forment. Tu dois choisir ton rythme maintenant.", descEN:"The main climb of the day begins. The pace explodes. Groups are forming. You must choose your rhythm now."},
      {title:"L'accélération dans la montée", titleEN:"The acceleration on the climb",
       desc:"Un grimpeur de renom sort des roues à mi-pente. Le peloton hésite. Tu as trois secondes pour décider.", descEN:"A top climber goes clear mid-climb. The peloton hesitates. You have three seconds to decide."},
    ],
    choices:[
      {label:"Tenir le groupe et gérer jusqu'au sommet", labelEN:"Stick with the group to the summit", risk:'sur', tilt:['resistance']},
      {label:"Suivre l'attaque, quitte à souffrir", labelEN:"Follow the attack, even if it hurts", risk:'equilibre', tilt:['montagne','mental']},
      {label:"Contre-attaquer au-dessus pour semer tout le monde", labelEN:"Counter-attack over the top to drop everyone", risk:'audacieux', tilt:['montagne','resistance']},
    ]
  },
  { focus:['classiques','mental'],
    variants:[
      {title:"Le secteur pavé", titleEN:"The cobbled sector",
       desc:"L'entrée dans les premiers secteurs pavés. Le bruit est assourdissant. Plusieurs coureurs crèvent. Tu dois choisir ta ligne.", descEN:"Entering the first cobbled sectors. The noise is deafening. Several riders puncture. You must pick your line."},
      {title:"L'éventail dans le vent", titleEN:"Wind echelons",
       desc:"Le vent de travers crée des éventails. Le peloton se casse. Tu dois trouver le bon groupe avant qu'il ne soit trop tard.", descEN:"Crosswinds are causing echelons. The peloton splits. You need to find the right group before it's too late."},
    ],
    choices:[
      {label:"Rouler au centre, position prudente", labelEN:"Ride in the middle, safe position", risk:'sur', tilt:['recuperation']},
      {label:"Coller aux favoris, gestion fine", labelEN:"Stick with the favourites, controlled riding", risk:'equilibre', tilt:['classiques','mental']},
      {label:"Partir à l'avant avant l'entrée du secteur", labelEN:"Go to the front before the sector", risk:'audacieux', tilt:['classiques','resistance']},
    ]
  },
  { focus:['clm','resistance'],
    variants:[
      {title:"Le contre-la-montre intermédiaire", titleEN:"The intermediate time check",
       desc:"Les chronos tombent. Tu es en selle depuis un moment. La gestion de l'effort sera décisive dans les 10 derniers kilomètres.", descEN:"The time checks are coming in. You've been riding a while. Pacing the last 10km will be crucial."},
      {title:"Le vent de face dans la montée finale", titleEN:"Headwind on the final climb",
       desc:"La route monte et le vent s'invite. L'effort est décuplé. Il faut choisir : conserver ou tout donner.", descEN:"The road climbs and the wind joins in. The effort multiplies. Choose: conserve or go all-in."},
    ],
    choices:[
      {label:"Doser l'effort, ne pas se griller", labelEN:"Pace the effort, don't burn out", risk:'sur', tilt:['clm']},
      {label:"Maintenir la puissance cible", labelEN:"Hold the target power", risk:'equilibre', tilt:['clm','resistance']},
      {label:"Tout envoyer dans le final", labelEN:"Give everything in the finale", risk:'audacieux', tilt:['clm','mental']},
    ]
  },
];
