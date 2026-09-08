/* ---------- ÉVÈNEMENTS PERSONNELS ---------- */

const PERSONAL_EVENTS = [
  {icon:'🩹', title:"Chute à l'entraînement hivernal", titleEN:"A fall during winter training", desc:"Une glissade sur route mouillée pendant un stage d'hiver. Rien de grave, mais le corps est marqué.", descEN:"A slip on a wet road during a winter training camp. Nothing serious, but the body feels it.",
    choices:[
      {label:"Repousser la reprise, jouer la prudence", labelEN:"Delay the restart, play it safe", effect:{fatigue:-8, stats:{resistance:0.3}}},
      {label:"Serrer les dents et reprendre tout de suite", labelEN:"Grit your teeth and get straight back to it", effect:{fatigue:8, stats:{mental:-2}}},
    ]},
  {icon:'👶', title:"Devenir parent", titleEN:"Becoming a parent", desc:"Une naissance dans la famille, entre bonheur et nuits courtes à l'approche de la saison.", descEN:"A birth in the family, between joy and short nights as the season approaches.",
    choices:[
      {label:"Prendre du recul et savourer ce moment", labelEN:"Step back and savour this moment", effect:{stats:{mental:4}, fatigue:4}},
      {label:"Rester focus sur la préparation malgré tout", labelEN:"Stay focused on preparation regardless", effect:{stats:{mental:-2, resistance:1}}},
    ]},
  {icon:'📰', title:"Un article critique dans la presse spécialisée", titleEN:"A critical article in the specialist press", desc:"Un journaliste spécialisé doute publiquement du niveau du coureur après plusieurs contre-performances récentes.", descEN:"A specialist journalist publicly questions the rider's level after several recent poor performances.",
    choices:[
      {label:"Répondre par la performance, en silence", labelEN:"Answer with performance, in silence", effect:{stats:{mental:3}}},
      {label:"Réagir publiquement et créer la polémique", labelEN:"React publicly and stir up controversy", effect:{reputation:-3, stats:{mental:1}}},
    ]},
  {icon:'🤝', title:"Un sponsor personnel propose un partenariat", titleEN:"A personal sponsor offers a partnership", desc:"Une marque locale propose un contrat d'image en dehors de l'équipe.", descEN:"A local brand offers an image contract outside the team.",
    choices:[
      {label:"Accepter, la sérénité financière aide à courir libéré", labelEN:"Accept — financial peace of mind helps you race freely", effect:{stats:{mental:4}}},
      {label:"Décliner, rester concentré uniquement sur le vélo", labelEN:"Decline, stay focused solely on the bike", effect:{stats:{mental:1, resistance:1}}},
    ]},
  {icon:'🏔️', title:"Installation dans un centre d'altitude", titleEN:"Moving to an altitude training centre", desc:"L'occasion de déménager plusieurs semaines en altitude pour préparer la saison.", descEN:"The chance to relocate for several weeks at altitude to prepare for the season.",
    choices:[
      {label:"Investir pleinement dans ce stage exigeant", labelEN:"Commit fully to this demanding camp", effect:{stats:{montagne:2}, fatigue:6}},
      {label:"Rester dans ses habitudes, plus rassurant", labelEN:"Stick to your habits, it feels safer", effect:{stats:{mental:2}}},
    ]},
  {icon:'🧠', title:"Une période de doute après une contre-performance", titleEN:"A period of doubt after a poor result", desc:"Le doute s'installe après une course manquée. Certains coureurs traversent ce cap en carrière.", descEN:"Doubt creeps in after a missed race. Many riders go through this at some point in their career.",
    choices:[
      {label:"En parler avec un préparateur mental", labelEN:"Talk it through with a mental coach", effect:{stats:{mental:5}}},
      {label:"Faire profil bas et gérer ça seul", labelEN:"Keep a low profile and handle it alone", effect:{stats:{mental:-3, resistance:1}}},
    ]},
  {icon:'❤️', title:"Le soutien de la famille dans les moments difficiles", titleEN:"Family support in difficult times", desc:"Après une saison compliquée, les proches se montrent particulièrement présents.", descEN:"After a tough season, loved ones show up in a particularly strong way.",
    choices:[
      {label:"Puiser de la force dans ce soutien", labelEN:"Draw strength from this support", effect:{stats:{mental:4}}},
      {label:"Rester pudique, garder ses distances", labelEN:"Stay reserved, keep some distance", effect:{stats:{mental:0}}},
    ]},
  {icon:'🛌', title:"Une coupure prolongée s'offre avant la reprise", titleEN:"An extended break before the restart", seasonStartOnly:true, desc:"Le calendrier laisse un vide inhabituel avant le début de saison.", descEN:"The calendar leaves an unusually long gap before the season begins.",
    choices:[
      {label:"Profiter pleinement de cette coupure", labelEN:"Make the most of this break", effect:{fatigue:-15, stats:{recuperation:0.5}}},
      {label:"Continuer à s'entraîner malgré tout", labelEN:"Keep training regardless", effect:{fatigue:-4, stats:{resistance:1}}},
    ]},
  {icon:'💥', title:"Une chute collective marque la reprise", titleEN:"A group crash marks the restart", seasonStartOnly:true, desc:"Lors d'une sortie de groupe en stage hivernal, une chute implique plusieurs coéquipiers — un classique des reprises de saison dans le peloton.", descEN:"During a group ride at winter camp, a crash involves several teammates — a classic of early-season returns in the peloton.",
    choices:[
      {label:"Aider un coéquipier à s'en remettre moralement", labelEN:"Help a teammate recover mentally", effect:{stats:{mental:3}}},
      {label:"Se concentrer sur sa propre récupération", labelEN:"Focus on your own recovery", effect:{stats:{resistance:1, mental:-1}}},
    ]},
  {icon:'🌧️', title:"Un hiver maussade, stages sous la pluie", titleEN:"A gloomy winter, training camps in the rain", seasonStartOnly:true, desc:"Les conditions d'entraînement hivernales sont dégradées plusieurs semaines de suite — une réalité bien connue des coureurs du nord de l'Europe.", descEN:"Winter training conditions are poor for several weeks in a row — a well-known reality for riders from northern Europe.",
    choices:[
      {label:"S'endurcir et rouler quand même", labelEN:"Toughen up and ride anyway", effect:{fatigue:5, stats:{resistance:2}}},
      {label:"Privilégier le home-trainer et le repos", labelEN:"Favour the home trainer and rest", effect:{stats:{recuperation:1, mental:1}}},
    ]},
  {icon:'🔧', title:"Un souci technique récurrent avec le nouveau matériel", titleEN:"A recurring technical issue with the new equipment", desc:"Le changement d'équipementier en début de saison impose une période d'adaptation, entre réglages et petits ennuis mécaniques.", descEN:"The change of equipment supplier at the start of the season brings an adjustment period, between fine-tuning and small mechanical headaches.",
    choices:[
      {label:"Passer du temps en atelier pour s'adapter", labelEN:"Spend time in the workshop to adapt", effect:{fatigue:2, stats:{mental:2}}},
      {label:"Faire confiance au staff et rester concentré sur le vélo", labelEN:"Trust the staff and stay focused on riding", effect:{stats:{mental:1}}},
    ]},
  {icon:'💸', title:"Rumeurs autour du sponsor principal", titleEN:"Rumours around the title sponsor", desc:"Des bruits circulent sur la solidité financière du sponsor titre — une inquiétude récurrente dans le peloton professionnel, où plusieurs équipes ont déjà disparu faute de budget.", descEN:"Talk is circulating about the financial health of the title sponsor — a recurring worry in the professional peloton, where several teams have already folded for lack of budget.",
    choices:[
      {label:"Rassurer publiquement le groupe", labelEN:"Reassure the group publicly", effect:{stats:{mental:3}, reputation:1}},
      {label:"Ne rien dire et rester concentré sur le sport", labelEN:"Say nothing and stay focused on the sport", effect:{stats:{mental:1}, reputation:-1}},
    ]},
  {icon:'🎙️', title:"Une interview qui dérape", titleEN:"An interview that goes off the rails", desc:"Un journaliste pousse la question sur une polémique du peloton pendant une interview d'avant-course.", descEN:"A journalist pushes a question about a peloton controversy during a pre-race interview.",
    choices:[
      {label:"Rester diplomate, éviter la polémique", labelEN:"Stay diplomatic, avoid controversy", effect:{stats:{mental:2}}},
      {label:"Répondre franchement, quitte à faire des vagues", labelEN:"Answer honestly, even if it stirs things up", effect:{stats:{mental:2}, reputation:-2}},
    ]},
  {icon:'🧪', title:"Contrôle antidopage inopiné au petit matin", titleEN:"Surprise doping control early in the morning", desc:"Un contrôle hors compétition, tôt le matin — une routine bien connue du métier, encadrée par le système de localisation des coureurs professionnels.", descEN:"An out-of-competition test, early in the morning — a well-known routine in the sport, part of the location tracking system for professional riders.",
    choices:[
      {label:"Prendre ça avec philosophie, ça fait partie du métier", labelEN:"Take it with philosophy, it's part of the job", effect:{stats:{mental:2}}},
      {label:"S'agacer de la contrainte matinale", labelEN:"Get irritated by the early-morning intrusion", effect:{stats:{mental:-2}, reputation:-1}},
    ]},
  {icon:'👥', title:"Tension avec un coéquipier ambitieux", titleEN:"Tension with an ambitious teammate", desc:"Un coéquipier revendique lui aussi le statut de leader pour la saison — une dynamique classique dans les équipes qui alignent plusieurs coureurs de talent.", descEN:"A teammate also claims leadership status for the season — a classic dynamic in teams that field several talented riders.",
    choices:[
      {label:"Accepter de temporiser pour l'harmonie du groupe", labelEN:"Agree to step back for the sake of team harmony", effect:{stats:{mental:2}}},
      {label:"Revendiquer fermement son propre rôle de leader", labelEN:"Firmly assert your own leadership role", effect:{stats:{mental:3}, reputation:-1}},
    ]},
  {icon:'🎓', title:"Un vétéran de l'équipe raccroche le vélo", titleEN:"A team veteran hangs up the bike", desc:"Un coéquipier expérimenté annonce sa retraite en fin de saison précédente — la fin d'un repère pour tout le groupe.", descEN:"An experienced teammate announces his retirement at the end of the previous season — the end of a reference point for the whole group.",
    choices:[
      {label:"Prendre le temps de lui rendre hommage", labelEN:"Take the time to pay tribute to him", effect:{stats:{mental:3}}},
      {label:"Se concentrer sur sa propre trajectoire", labelEN:"Focus on your own trajectory", effect:{stats:{resistance:1}}},
    ]},
  {icon:'📱', title:"Une vague de réactions sur les réseaux sociaux", titleEN:"A wave of reactions on social media", desc:"Une prise de position ou un résultat récent fait beaucoup parler en ligne, en bien comme en mal — le lot quotidien des coureurs pros à l'ère des réseaux sociaux.", descEN:"A recent stance or result gets a lot of attention online, for better or worse — the daily lot of pro riders in the social media era.",
    choices:[
      {label:"Interagir avec les fans, ça fait du bien au moral", labelEN:"Interact with the fans, it lifts morale", effect:{stats:{mental:3}}},
      {label:"Couper les réseaux pour rester concentré", labelEN:"Log off to stay focused", effect:{stats:{mental:1, resistance:1}}},
    ]},
  {icon:'✊', title:"Un mouvement de protestation des coureurs pour la sécurité", titleEN:"A rider protest movement over safety", desc:"Le peloton professionnel se mobilise collectivement pour réclamer de meilleures conditions de sécurité en course — un sujet régulièrement porté par les coureurs eux-mêmes ces dernières années.", descEN:"The professional peloton mobilises collectively to demand better safety conditions in races — an issue regularly raised by the riders themselves in recent years.",
    choices:[
      {label:"Se joindre pleinement à la mobilisation", labelEN:"Join the movement wholeheartedly", effect:{stats:{mental:2}, reputation:1}},
      {label:"Rester en retrait, concentré sur sa préparation", labelEN:"Stay on the sidelines, focused on your preparation", effect:{stats:{resistance:1}}},
    ]},
  {icon:'🪒', title:"Le rituel du rasage des jambes", titleEN:"The leg-shaving ritual", desc:"Une tradition unique au cyclisme, entre aérodynamisme, entretien de la peau et soin plus facile des éventuelles plaies après une chute.", descEN:"A tradition unique to cycling, between aerodynamics, skin care, and easier treatment of any wounds after a crash.",
    choices:[
      {label:"S'y plier scrupuleusement avant chaque course", labelEN:"Stick to it scrupulously before every race", effect:{stats:{mental:1, resistance:1}}},
      {label:"S'en moquer et rester comme on est", labelEN:"Not bother, and stay as you are", effect:{stats:{mental:2}}},
    ]},
  {icon:'🔢', title:"La peur du dossard 13", titleEN:"The fear of race number 13", desc:"Une superstition tenace circule dans le peloton autour du dossard numéro 13, que certains coureurs évitent à tout prix.", descEN:"A stubborn superstition circulates in the peloton around race number 13, which some riders avoid at all costs.",
    choices:[
      {label:"Demander à l'organisation un échange de dossard", labelEN:"Ask the organisers to swap your number", effect:{stats:{mental:2}}},
      {label:"Ignorer superbement la superstition", labelEN:"Proudly ignore the superstition", effect:{stats:{mental:1, resistance:1}}},
    ]},
  {icon:'🚩', title:"La hantise de la flamme rouge", titleEN:"Haunted by the red kite", desc:"Un souvenir de fin de course ratée sous la flamme rouge du dernier kilomètre, où l'hésitation a coûté cher, continue de te travailler avant cette nouvelle saison.", descEN:"A memory of a botched finish under the red kite of the final kilometre, where hesitation cost dearly, keeps nagging at you ahead of this new season.",
    choices:[
      {label:"Te promettre d'attaquer sans plus hésiter cette fois", labelEN:"Promise yourself to attack without hesitation this time", effect:{stats:{mental:2}}},
      {label:"Retravailler ta gestion tactique de fin de course avec le staff", labelEN:"Rework your late-race tactical management with the staff", effect:{stats:{mental:1, resistance:1}}},
    ]},
  {icon:'🔴', title:"La lanterne rouge, un rôle à part", titleEN:"The lanterne rouge, a role apart", desc:"La saison dernière, un coéquipier a terminé lanterne rouge (dernier du classement général) d'un grand tour et en a fait une vraie tradition médiatique, entre autodérision et sourire — un folklore bien connu du peloton.", descEN:"Last season, a teammate finished lanterne rouge (dead last overall) of a grand tour and turned it into a real media tradition, with self-deprecation and a smile — a well-known piece of peloton folklore.",
    choices:[
      {label:"T'inspirer de cet état d'esprit si jamais ça t'arrive", labelEN:"Draw inspiration from that mindset if it ever happens to you", effect:{stats:{mental:2}}},
      {label:"Te dire que ce rôle n'est vraiment pas pour toi", labelEN:"Tell yourself that role really isn't for you", effect:{stats:{mental:1}}},
    ]},
  {icon:'📺', title:"Une échappée sans lendemain, pour les caméras", titleEN:"A breakaway going nowhere, for the cameras", desc:"Certains matins, le peloton laisse filer un groupe matinal loin devant, surtout pour la visibilité télé des sponsors, avant de tout reprendre en fin de course — une pratique bien connue du peloton professionnel.", descEN:"Some mornings, the peloton lets a small group ride far off the front, mostly for the sponsors' TV visibility, before reeling it all back in late in the race — a well-known practice in the professional peloton.",
    choices:[
      {label:"Te dire que tu jouerais volontiers ce rôle à l'occasion", labelEN:"Tell yourself you'd gladly play that role sometime", effect:{stats:{mental:2}, reputation:1}},
      {label:"Préférer rester sagement à l'abri dans le peloton", labelEN:"Prefer to stay safely sheltered in the peloton", effect:{stats:{recuperation:1}}},
    ]},
  {icon:'🥂', title:"Le toast de la dernière étape", titleEN:"The final-stage toast", desc:"La tradition veut que le leader d'un grand tour trinque avec ses coéquipiers lors de l'étape d'apparat qui clôt la course, dans une ambiance bon enfant.", descEN:"Tradition has it that the leader of a grand tour toasts with his teammates during the ceremonial stage that closes the race, in a good-natured atmosphere.",
    choices:[
      {label:"Te projeter avec impatience vers ce genre de moment", labelEN:"Look forward to that kind of moment", effect:{stats:{mental:3}}},
      {label:"Te rappeler qu'une course n'est jamais vraiment finie avant la ligne", labelEN:"Remind yourself a race is never truly over before the line", effect:{stats:{mental:1, resistance:1}}},
    ]},
  {icon:'🚦', title:"Le souvenir d'un passage à niveau fermé au pire moment", titleEN:"The memory of a level crossing closing at the worst moment", desc:"Une course a été coupée en deux l'an dernier par un passage à niveau qui s'est refermé juste devant le peloton, scindant la course en deux groupes totalement inégaux — un incident bien connu du calendrier professionnel.", descEN:"A race was split in two last year by a level crossing that closed right in front of the peloton, dividing the race into two hopelessly unequal groups — a well-known incident on the professional calendar.",
    choices:[
      {label:"Te dire que ce genre d'aléa fait partie du jeu", labelEN:"Tell yourself that kind of mishap is part of the game", effect:{stats:{mental:2}}},
      {label:"Ressasser l'injustice possible d'une telle situation", labelEN:"Dwell on the possible unfairness of such a situation", effect:{stats:{mental:-1, resistance:1}}},
    ]},
  {icon:'🎒', title:"Un ravitaillement mal négocié dans le peloton", titleEN:"A badly handled feed zone in the peloton", desc:"Le souvenir d'un sac de musette resté accroché au bras d'un coureur, provoquant une chute en cascade juste derrière lui — un classique redouté des zones de ravitaillement.", descEN:"The memory of a musette bag left snagged on a rider's arm, causing a chain-reaction crash right behind him — a dreaded classic of feed zones.",
    choices:[
      {label:"Retravailler ta technique de ravitaillement avec le staff", labelEN:"Rework your feed-zone technique with the staff", effect:{stats:{mental:1, resistance:1}}},
      {label:"Faire confiance à ton expérience sans plus y penser", labelEN:"Trust your experience and not dwell on it", effect:{stats:{mental:2}}},
    ]},
  {icon:'⛈️', title:"Une averse de grêle a transformé une étape estivale en chaos", titleEN:"A hailstorm turned a summer stage into chaos", desc:"L'an dernier, une averse de grêle soudaine en plein été a surpris tout le monde en pleine étape, organisateurs compris — un souvenir marquant pour qui l'a vécu.", descEN:"Last year, a sudden hailstorm in the middle of summer caught everyone off guard mid-stage, organisers included — a striking memory for anyone who lived through it.",
    choices:[
      {label:"Investir dans un équipement toutes conditions, au cas où", labelEN:"Invest in all-weather gear, just in case", effect:{stats:{resistance:1, recuperation:1}}},
      {label:"Te dire que ça ne t'arrivera probablement pas à toi", labelEN:"Tell yourself it probably won't happen to you", effect:{stats:{mental:1}}},
    ]},
  {icon:'🚴', title:"Le souvenir d'une échappée solitaire légendaire", titleEN:"The memory of a legendary solo breakaway", desc:"Une course reste dans les mémoires pour une échappée en solitaire lancée à plus de 100 km de l'arrivée, contre toute logique tactique, et pourtant victorieuse jusqu'au bout — un mythe régulièrement réécrit dans l'histoire du cyclisme.", descEN:"One race is remembered for a solo breakaway launched from more than 100km out, against all tactical logic, yet victorious all the way to the line — a myth regularly retold in cycling history.",
    choices:[
      {label:"Rêver de tenter ce genre de coup un jour", labelEN:"Dream of trying that kind of move yourself one day", effect:{stats:{mental:3}}},
      {label:"Te dire que ce serait de la folie pure sur le plan tactique", labelEN:"Tell yourself it would be pure tactical madness", effect:{stats:{mental:1, resistance:1}}},
    ]},
  {icon:'🏍️', title:"L'épisode du mauvais aiguillage", titleEN:"The wrong-turn episode", desc:"Une moto ouvreuse s'était un jour trompée de route, entraînant un coureur en tête avec elle et lui coûtant potentiellement la victoire d'un monument — un épisode resté dans les mémoires du peloton.", descEN:"A lead motorbike once took a wrong turn, dragging a leading rider along with it and potentially costing him a monument victory — an episode that stuck in the peloton's memory.",
    choices:[
      {label:"Redoubler de vigilance sur le tracé, quoi qu'il arrive", labelEN:"Redouble your vigilance on the route, whatever happens", effect:{stats:{mental:2}}},
      {label:"Faire une confiance totale à l'organisation", labelEN:"Trust the organisers completely", effect:{stats:{mental:1}}},
    ]},
  {icon:'⚙️', title:"La casse de dérailleur à quelques mètres de la ligne", titleEN:"The derailleur failure metres from the line", desc:"Un coureur a dû un jour courir avec son vélo à la main pour franchir l'arrivée d'un monument après une casse mécanique à quelques mètres du but — une image restée gravée dans l'histoire du cyclisme.", descEN:"One rider once had to run with his bike in hand to cross the finish of a monument after a mechanical failure just metres from the goal — an image etched into cycling history.",
    choices:[
      {label:"Te promettre de ne jamais lâcher, quoi qu'il arrive", labelEN:"Promise yourself never to give up, whatever happens", effect:{stats:{mental:3}}},
      {label:"Vérifier ton matériel avec un soin redoublé avant chaque course", labelEN:"Check your equipment with extra care before every race", effect:{stats:{resistance:1, mental:1}}},
    ]},
  {icon:'🤝', title:"Le geste de fair-play resté dans les mémoires", titleEN:"The fair-play gesture that stayed in memory", desc:"Un coureur a un jour attendu un rival tombé au sol plutôt que d'en profiter, quitte à perdre la course pour quelques secondes — un principe non-écrit mais bien réel du peloton.", descEN:"One rider once waited for a rival who had crashed rather than take advantage, even at the cost of losing the race by a few seconds — an unwritten but very real principle of the peloton.",
    choices:[
      {label:"T'inspirer de cette éthique, même si ça devait te coûter cher", labelEN:"Draw inspiration from that ethic, even if it were to cost you dearly", effect:{stats:{mental:3}, reputation:1}},
      {label:"Te dire que la compétition doit rester impitoyable", labelEN:"Tell yourself competition should stay ruthless", effect:{stats:{mental:2}}},
    ]},
  {icon:'😤', title:"La disqualification pour un geste d'humeur en plein sprint", titleEN:"Disqualified for a moment of anger mid-sprint", desc:"Une victoire tenue au bout des doigts, puis retirée après un geste jugé trop agressif envers un rival en plein sprint — un rappel que le fair-play est scruté de près dans le peloton.", descEN:"A victory held within reach, then taken away after a gesture deemed too aggressive towards a rival in a sprint — a reminder that fair play is closely watched in the peloton.",
    choices:[
      {label:"Te jurer de toujours garder ton sang-froid dans les moments chauds", labelEN:"Swear to always keep your cool in heated moments", effect:{stats:{mental:2}}},
      {label:"Reconnaître que l'adrénaline peut faire déraper n'importe qui", labelEN:"Acknowledge that adrenaline can make anyone slip up", effect:{stats:{mental:1}}},
    ]},
  {icon:'🌟', title:"L'exploit inattendu d'un néo-pro", titleEN:"A neo-pro's unexpected feat", desc:"Une première saison professionnelle a un jour suffi à un jeune coureur pour remporter un monument presque par surprise, créant la sensation dans tout le peloton — ça arrive plus souvent qu'on ne le pense.", descEN:"A first professional season once proved enough for a young rider to win a monument almost by surprise, sending shockwaves through the whole peloton — it happens more often than you'd think.",
    choices:[
      {label:"Te dire que ton tour viendra peut-être plus vite que prévu", labelEN:"Tell yourself your turn might come sooner than expected", effect:{stats:{mental:3}, reputation:1}},
      {label:"Rester réaliste sur ta propre progression, étape par étape", labelEN:"Stay realistic about your own progress, step by step", effect:{stats:{mental:1, resistance:1}}},
    ]},
  {icon:'📱', title:"Une communauté grandissante sur les réseaux", titleEN:"A growing community on social media", desc:"Tes résultats récents t'attirent de plus en plus d'abonnés — et avec eux, une attention à laquelle tu n'étais pas préparé.", descEN:"Your recent results are attracting more and more followers — and with them, attention you weren't quite prepared for.",
    choices:[
      {label:"Jouer le jeu, partager les coulisses de ta préparation", labelEN:"Play along, share behind-the-scenes of your preparation", effect:{reputation:2, stats:{mental:-1}}},
      {label:"Garder ta vie privée à l'écart de tout ça", labelEN:"Keep your private life away from all that", effect:{stats:{mental:2}}},
    ]},
  {icon:'🚲', title:"Un souci technique récurrent en plein stage", titleEN:"A recurring technical issue mid-camp", desc:"Ton vélo présente un défaut agaçant qui revient sans qu'on en trouve vraiment la cause, en pleine période de préparation.", descEN:"Your bike has an annoying fault that keeps coming back without anyone finding the real cause, right in the middle of a preparation camp.",
    choices:[
      {label:"Insister auprès du service technique jusqu'à la résolution", labelEN:"Push the technical staff until it's resolved", effect:{stats:{mental:2}, fatigue:3}},
      {label:"T'adapter et rouler avec, sans faire d'histoires", labelEN:"Adapt and ride with it, without making a fuss", effect:{stats:{resistance:1, mental:-1}}},
    ]},
  {icon:'🗣️', title:"Une intégration linguistique difficile", titleEN:"A difficult language transition", desc:"Ton nouvel environnement d'équipe ne parle pas ta langue, et les premières semaines sont plus isolantes que prévu.", descEN:"Your new team environment doesn't speak your language, and the first few weeks are more isolating than expected.",
    choices:[
      {label:"Te plonger dans l'apprentissage de la langue", labelEN:"Throw yourself into learning the language", effect:{stats:{mental:3}, fatigue:2}},
      {label:"Te reposer sur les gestes et l'entraide sur le vélo", labelEN:"Rely on gestures and mutual support on the bike", effect:{stats:{mental:1, classiques:1}}},
    ]},
  {icon:'🧪', title:"Contrôle antidopage inopiné tard le soir", titleEN:"Surprise doping control late at night", desc:"Les officiels frappent à la porte bien après le dîner, comme le veut la procédure standard de localisation des coureurs.", descEN:"Officials knock on the door well after dinner, as standard rider location procedure dictates.",
    choices:[
      {label:"Le prendre avec philosophie, ça fait partie du métier", labelEN:"Handle it calmly, it's routine", effect:{stats:{mental:1}}},
      {label:"Râler intérieurement contre l'heure tardive", labelEN:"Feel your patience wearing thin at the late hour", effect:{fatigue:2}},
    ]},
  {icon:'🎥', title:"Une caméra suit l'équipe pendant une saison", titleEN:"A camera crew follows the team for a season", desc:"Un projet de documentaire s'installe dans le quotidien de l'équipe, jusque dans les moments les plus intimes de la préparation.", descEN:"A documentary team is granted access to the team for a season — an unusual level of exposure into the group's daily life.",
    choices:[
      {label:"Te livrer sincèrement devant la caméra", labelEN:"Play along naturally in front of the camera", effect:{reputation:2, stats:{mental:-1}}},
      {label:"Rester en retrait, préférer parler par les jambes", labelEN:"Stay guarded, uncomfortable with the exposure", effect:{stats:{mental:2}}},
    ]},
  {icon:'💍', title:"Un mariage à préparer en pleine saison", titleEN:"A wedding to plan mid-season", desc:"Un heureux événement personnel tombe en plein calendrier de courses, entre essayages et entraînements.", descEN:"A wedding date falls right in the middle of the competitive calendar, between organisation and divided attention.",
    choices:[
      {label:"Prendre le temps qu'il faut pour en profiter pleinement", labelEN:"Take the time needed, the season can wait a little", effect:{stats:{mental:4}, fatigue:3}},
      {label:"Déléguer un maximum pour ne rien sacrifier à la préparation", labelEN:"Delegate as much as possible to stay focused on racing", effect:{stats:{resistance:1, mental:1}}},
    ]},
  {icon:'🧑‍🏫', title:"Un jeune coéquipier demande à être coaché", titleEN:"A young teammate asks to be coached", desc:"Un néo-pro de l'équipe vient chercher tes conseils, impressionné par ton expérience du peloton.", descEN:"A promising rookie comes to you for advice, impressed by your experience in the peloton.",
    choices:[
      {label:"Prendre le temps de le former, quitte à te fatiguer un peu", labelEN:"Take the time to pass on what you know", effect:{stats:{mental:3}, fatigue:2}},
      {label:"Rester concentré sur tes propres objectifs", labelEN:"Stay focused on your own objectives", effect:{stats:{mental:1}}},
    ]},
  {icon:'🌡️', title:"Un stage en altitude qui tourne mal", titleEN:"An altitude camp that goes wrong", desc:"Le mal aigu des montagnes frappe plus fort que prévu lors d'un stage en haute altitude, perturbant toute la préparation.", descEN:"Poor logistics turn a training camp meant to be decisive into a source of frustration.",
    choices:[
      {label:"Redescendre immédiatement, la santé avant tout", labelEN:"Make the best of a difficult situation", effect:{fatigue:-4, stats:{resistance:-1}}},
      {label:"Serrer les dents et rester malgré l'inconfort", labelEN:"Voice your frustration to the staff", effect:{fatigue:6, stats:{montagne:1}}},
    ]},
  {icon:'📬', title:"Une pile de courrier de supporters", titleEN:"A pile of fan mail", desc:"Des lettres de jeunes passionnés de cyclisme s'accumulent, pleines d'admiration et de questions sur ta carrière.", descEN:"Letters pile up at the team office, from young fans hoping for a reply.",
    choices:[
      {label:"Prendre le temps de répondre à chacune", labelEN:"Take the time to answer a few of them", effect:{reputation:1, stats:{mental:2}}},
      {label:"Confier ça au staff de communication de l'équipe", labelEN:"Leave it to the team's press office", effect:{stats:{mental:0}}},
    ]},
  {icon:'🔄', title:"Des rumeurs de transfert circulent", titleEN:"Transfer rumours are circulating", desc:"La presse spécialisée évoque ton possible départ vers une autre équipe, sans que rien ne soit encore officiel.", descEN:"Your name is mentioned in the press as a target for another team, without you having said anything.",
    choices:[
      {label:"Démentir publiquement pour calmer le jeu", labelEN:"Let it play out, it can only help your market value", effect:{reputation:1, stats:{mental:1}}},
      {label:"Laisser dire, sans donner d'importance aux rumeurs", labelEN:"Reassure your current team of your loyalty", effect:{stats:{mental:-1}}},
    ]},
  {icon:'🎗️', title:"Une sollicitation pour une cause caritative", titleEN:"A request to support a charitable cause", desc:"Une association te propose de devenir ambassadeur d'une cause qui te tient à cœur, en marge de ta carrière sportive.", descEN:"An association asks you to lend your image to a cause close to your heart.",
    choices:[
      {label:"T'engager pleinement, quitte à y consacrer du temps", labelEN:"Get involved, it feels meaningful", effect:{reputation:2, fatigue:2}},
      {label:"Décliner poliment, rester focalisé sur le vélo", labelEN:"Decline politely, stay focused on the season", effect:{stats:{mental:1}}},
    ]},
  {icon:'🧳', title:"Un imprévu logistique avant un déplacement", titleEN:"A logistical mishap before travelling", desc:"Un souci de dernière minute complique sérieusement le trajet vers une course à l'étranger.", descEN:"A last-minute issue seriously complicates the trip to a race abroad.",
    choices:[
      {label:"Gérer le stress avec calme, arriver reposé malgré tout", labelEN:"Handle the stress calmly, arrive rested despite it all", effect:{stats:{mental:2}}},
      {label:"Arriver tendu, la fatigue du voyage encore dans les jambes", labelEN:"Arrive tense, travel fatigue still in the legs", effect:{fatigue:4, stats:{mental:-1}}},
    ]},
  {icon:'💼', title:"Une offre de reconversion précoce", titleEN:"An early retirement offer", desc:"Une marque te propose un pont d'or pour arrêter dès maintenant et devenir ambassadeur — une tentation à laquelle peu de coureurs peuvent résister sereinement.", descEN:"A brand offers you a golden bridge to stop now and become an ambassador — a temptation few riders can shrug off calmly.",
    choices:[
      {label:"Décliner fermement, la carrière sportive avant tout", labelEN:"Decline firmly, the sporting career comes first", effect:{stats:{mental:2}}},
      {label:"Prendre le temps d'y réfléchir sérieusement", labelEN:"Take some time to seriously think it over", effect:{stats:{mental:1}, fatigue:2}},
    ]},
  {icon:'📢', title:"Un désaccord tactique en course", titleEN:"A tactical disagreement mid-race", desc:"Le directeur sportif donne une consigne par oreillette que tu juges mauvaise, en pleine étape, sans le temps de vraiment en discuter.", descEN:"The team director gives an instruction over the radio that you think is wrong, mid-stage, with no time to really discuss it.",
    choices:[
      {label:"Suivre la consigne malgré tes doutes", labelEN:"Follow the instruction despite your doubts", effect:{stats:{mental:1}}},
      {label:"Improviser à ta façon, quitte à en payer le prix ensuite", labelEN:"Improvise your own way, even if it costs you later", effect:{stats:{mental:2}, reputation:-1}},
    ]},
  {icon:'👶', title:"La naissance d'un enfant", titleEN:"The birth of a child", desc:"Un heureux événement familial vient bouleverser ton quotidien en pleine saison.", descEN:"A joyful family event turns your daily life upside down right in the middle of the season.",
    choices:[
      {label:"Prendre le temps qu'il faut, quitte à lever un peu le pied", labelEN:"Take all the time you need, even if it means easing off a little", effect:{stats:{mental:4}, fatigue:3}},
      {label:"Reprendre l'entraînement très vite malgré tout", labelEN:"Get back to training very quickly regardless", effect:{stats:{mental:1}, fatigue:2}},
    ]},
  {icon:'🚲', title:"Un vol de matériel", titleEN:"A theft of equipment", desc:"Ton vélo ou tes affaires personnelles disparaissent juste avant une course importante, semant la panique dans l'équipe.", descEN:"Your bike or personal belongings go missing right before an important race, causing panic within the team.",
    choices:[
      {label:"Garder ton calme, le matériel de secours suffira", labelEN:"Stay calm, the backup equipment will do", effect:{stats:{mental:2}}},
      {label:"Rester perturbé toute la journée par cet incident", labelEN:"Stay rattled by the incident all day", effect:{fatigue:2, stats:{mental:-1}}},
    ]},
  {icon:'🎬', title:"Une invitation à un gala people", titleEN:"An invitation to a celebrity gala", desc:"Le monde du cyclisme croise soudain celui des célébrités, avec une invitation inattendue à un évènement mondain.", descEN:"The world of cycling suddenly crosses paths with that of celebrities, with an unexpected invitation to a glamorous event.",
    choices:[
      {label:"Y aller, profiter de cette parenthèse insolite", labelEN:"Go along, enjoy this unusual break", effect:{reputation:2, fatigue:2}},
      {label:"Décliner poliment, préférer le calme avant course", labelEN:"Decline politely, prefer calm before racing", effect:{stats:{mental:1}}},
    ]},
  {icon:'🔁', title:"Un ancien coéquipier devient adversaire", titleEN:"A former teammate becomes a rival", desc:"Des retrouvailles amères t'attendent dans le peloton, face à un ancien coéquipier parti sous une autre tunique après un transfert houleux.", descEN:"A bittersweet reunion awaits you in the peloton, facing a former teammate now riding under different colours after a stormy transfer.",
    choices:[
      {label:"Rester professionnel, sans animosité inutile", labelEN:"Stay professional, no unnecessary animosity", effect:{stats:{mental:2}}},
      {label:"Laisser transparaître une rivalité non digérée", labelEN:"Let a lingering rivalry show through", effect:{stats:{mental:1}, reputation:1}},
    ]},
  {icon:'🧑‍🏫', title:"Une reconversion vers le coaching en parallèle", titleEN:"A side move into coaching", desc:"Tu commences à conseiller de jeunes coureurs amateurs sur ton temps libre, une activité qui te prend un peu plus que prévu.", descEN:"You start advising young amateur riders in your spare time, an activity that takes up a bit more of your time than expected.",
    choices:[
      {label:"Continuer, ça te fait aussi progresser toi-même", labelEN:"Keep at it, it helps you improve too", effect:{stats:{mental:2}, fatigue:1}},
      {label:"Lever le pied sur cette activité annexe", labelEN:"Ease off on this side activity", effect:{stats:{mental:1}}},
    ]},
  {icon:'🔧', title:"Un contrôle technique qui tourne mal", titleEN:"A technical check that goes wrong", desc:"Un souci mécanique inattendu est découvert sur ton vélo juste avant le départ, semant la panique dans le camion technique.", descEN:"An unexpected mechanical issue is discovered on your bike right before the start, causing panic in the team truck.",
    choices:[
      {label:"Garder ton sang-froid pendant la réparation d'urgence", labelEN:"Keep your cool during the emergency repair", effect:{stats:{mental:2}}},
      {label:"Monter sur la ligne de départ encore agacé", labelEN:"Line up still visibly irritated", effect:{stats:{mental:-1}, fatigue:1}},
    ]},
  {icon:'🎥', title:"Une proposition de biopic", titleEN:"A biopic proposal", desc:"Un réalisateur s'intéresse à ta carrière et souhaite en tirer un film — une perspective aussi flatteuse qu'intimidante.", descEN:"A filmmaker is interested in your career and wants to turn it into a film — a prospect as flattering as it is daunting.",
    choices:[
      {label:"Te prêter au jeu avec enthousiasme", labelEN:"Embrace it enthusiastically", effect:{reputation:2, stats:{mental:1}}},
      {label:"Rester réservé, pas certain de vouloir cette exposition", labelEN:"Stay reserved, unsure you want that exposure", effect:{stats:{mental:1}}},
    ]},
  {icon:'🩹', title:"Le retour d'une ancienne blessure", titleEN:"The return of an old injury", desc:"Une douleur familière refait surface sans prévenir, réveillant le souvenir d'une blessure passée.", descEN:"A familiar pain resurfaces without warning, reviving the memory of a past injury.",
    choices:[
      {label:"Consulter immédiatement par précaution", labelEN:"See a doctor immediately as a precaution", effect:{fatigue:-2, stats:{mental:1}}},
      {label:"Serrer les dents et continuer comme si de rien n'était", labelEN:"Grit your teeth and carry on as if nothing happened", effect:{fatigue:3, stats:{resistance:-1}}},
    ]},
];
