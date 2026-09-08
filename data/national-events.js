/* ---------- ÉVÈNEMENTS PERSONNELS PAR NATIONALITÉ ----------
   3 évènements par pays, qui ne se déclenchent que pour un coureur de cette
   nationalité — viennent enrichir (pas remplacer) le vivier générique ci-dessus.
   Aucune référence à une vraie course ou un vrai évènement sportif réel. */
const NATIONAL_EVENTS = {
  FR: [
    {icon:'🇫🇷', title:"Une nation biberonnée au vélo", titleEN:"A nation raised on cycling", desc:"Tu as grandi dans un pays où le vélo fait partie du paysage culturel, entre les discussions de comptoir et les silhouettes croisées sur les petites routes du dimanche.", descEN:"You grew up in a country where cycling is part of the cultural landscape, between café conversations and silhouettes crossed on the back roads on a Sunday.",
      choices:[
        {label:"T'enorgueillir de cet héritage", labelEN:"Take pride in this heritage", effect:{reputation:1, stats:{mental:3}}},
        {label:"Relativiser, ce n'est qu'un sport parmi d'autres", labelEN:"Keep perspective, it's just one sport among many", effect:{stats:{mental:1}}},
      ]},
    {icon:'☕', title:"Le café du village", titleEN:"The village café", desc:"Les habitués du café du coin suivent ta carrière depuis tes débuts, aux nouvelles à chaque course, prêts à refaire le monde cycliste à ton sujet.", descEN:"The regulars at the local café have followed your career since the start, hungry for news after every race, ready to relitigate the cycling world on your behalf.",
      choices:[
        {label:"Passer les voir après une bonne saison", labelEN:"Drop by after a good season", effect:{stats:{mental:3}}},
        {label:"Rester loin de cette pression amicale", labelEN:"Stay away from this friendly pressure", effect:{stats:{mental:1}}},
      ]},
    {icon:'🎯', title:"Baroudeur dans l'âme", titleEN:"A breakaway artist at heart", desc:"L'attrait de l'échappée solitaire te tente régulièrement, quitte à sacrifier tes chances au classement pour le panache.", descEN:"The lure of the solo breakaway tempts you regularly, even at the cost of sacrificing your GC chances for panache.",
      choices:[
        {label:"Céder à cette tentation romantique", labelEN:"Give in to this romantic temptation", effect:{stats:{classiques:2}, fatigue:3}},
        {label:"Rester pragmatique, jouer collectif", labelEN:"Stay pragmatic, ride for the team", effect:{stats:{mental:1}}},
      ]},
  ],
  BE: [
    {icon:'🚵', title:"Les kermesses du dimanche", titleEN:"Sunday kermesses", desc:"Avant d'être pro, tu as fait tes armes sur les kermesses locales — ces courses de village disputées devant une poignée de connaisseurs, un rituel qui façonne encore aujourd'hui la dureté des coureurs belges.", descEN:"Before turning pro, you cut your teeth on local kermesses — village races contested in front of a handful of connoisseurs, a ritual that still shapes the toughness of Belgian riders today.",
      choices:[
        {label:"T'en inspirer pour rester simple et rugueux", labelEN:"Draw on it to stay simple and tough", effect:{stats:{mental:2}}},
        {label:"Reconnaître que ce folklore te manque un peu", labelEN:"Admit you miss that folklore a little", effect:{stats:{mental:1}}},
      ]},
    {icon:'🌧️', title:"Le pavé et la boue", titleEN:"Cobbles and mud", desc:"L'abnégation face aux conditions les plus rudes fait partie de ton éducation cycliste, héritée d'une longue tradition de classiques disputées sous la pluie.", descEN:"Toughing it out through the harshest conditions is part of your cycling upbringing, inherited from a long tradition of classics raced in the rain.",
      choices:[
        {label:"En faire une fierté à assumer", labelEN:"Wear it as a point of pride", effect:{stats:{classiques:2, resistance:1}}},
        {label:"Reconnaître que c'est un supplice qu'on endure sans grande joie", labelEN:"Admit it's an ordeal you endure without much joy", effect:{stats:{mental:1}}},
      ]},
    {icon:'🌅', title:"Debout avant l'aube", titleEN:"Up before dawn", desc:"La discipline d'entraînement fait partie du folklore, même sous une pluie fine et un ciel gris qui ne se lève jamais vraiment.", descEN:"Training discipline is part of the folklore, even under a fine drizzle and a grey sky that never quite lifts.",
      choices:[
        {label:"T'y tenir sans faillir", labelEN:"Stick to it without fail", effect:{stats:{resistance:2}, fatigue:2}},
        {label:"T'accorder une grasse matinée occasionnelle", labelEN:"Allow yourself an occasional lie-in", effect:{stats:{mental:2}}},
      ]},
  ],
  IT: [
    {icon:'📣', title:"La ferveur des tifosi", titleEN:"The tifosi's fervour", desc:"La passion du public italien peut être aussi galvanisante qu'envahissante, avec des supporters qui te suivent parfois jusque dans les hôtels d'étape.", descEN:"The passion of the Italian public can be as energising as it is overwhelming, with fans sometimes following you all the way to the stage hotels.",
      choices:[
        {label:"Puiser de l'énergie dans cette ferveur", labelEN:"Draw energy from this fervour", effect:{stats:{mental:3}}},
        {label:"Chercher un peu de calme malgré tout", labelEN:"Look for a bit of calm regardless", effect:{stats:{mental:1}}},
      ]},
    {icon:'🎨', title:"L'élégance avant tout", titleEN:"Elegance above all", desc:"Dans le cyclisme italien, il y a une vraie pression à \"bien faire les choses\" — jusqu'au style sur le vélo, scruté presque autant que les résultats.", descEN:"In Italian cycling, there's real pressure to \"do things properly\" — down to your style on the bike, scrutinised almost as much as your results.",
      choices:[
        {label:"Soigner chaque détail, jusqu'à l'allure sur le vélo", labelEN:"Take care of every detail, even your look on the bike", effect:{reputation:1, stats:{mental:1}}},
        {label:"Te moquer des convenances, rester toi-même", labelEN:"Ignore convention, stay yourself", effect:{stats:{mental:2}}},
      ]},
    {icon:'🚲', title:"Un vélo comme un bijou de famille", titleEN:"A bike like a family heirloom", desc:"L'artisanat du cyclisme italien fait qu'on te regarde parfois de travers si tu ne chouchoutes pas assez ton matériel.", descEN:"Italian cycling craftsmanship means you're sometimes side-eyed if you don't fuss over your equipment enough.",
      choices:[
        {label:"Chérir ton matériel comme un héritage", labelEN:"Cherish your equipment like an heirloom", effect:{stats:{mental:2}}},
        {label:"Le voir comme un simple outil de travail", labelEN:"See it as a simple work tool", effect:{stats:{resistance:1}}},
      ]},
  ],
  NL: [
    {icon:'💨', title:"Le vent de face permanent", titleEN:"The endless headwind", desc:"Grandir en luttant contre un vent plat et constant a façonné ta manière de rouler bien avant ta première course officielle.", descEN:"Growing up battling a flat, constant wind shaped the way you ride long before your first official race.",
      choices:[
        {label:"En faire ta spécialité", labelEN:"Make it your speciality", effect:{stats:{classiques:2, resistance:1}}},
        {label:"Continuer d'en pester malgré les années", labelEN:"Keep grumbling about it after all these years", effect:{stats:{mental:1}}},
      ]},
    {icon:'🚴', title:"Le vélo, un outil du quotidien", titleEN:"The bike, a daily tool", desc:"Dans ton pays, le vélo est autant un moyen de transport qu'un sport — une culture ancrée dès l'enfance, bien avant l'idée d'en faire un métier.", descEN:"In your country, the bike is as much a means of transport as a sport — a culture instilled from childhood, long before the idea of making a career of it.",
      choices:[
        {label:"Te rappeler que tout a commencé par de simples trajets", labelEN:"Remember it all started with simple errands", effect:{stats:{mental:2}}},
        {label:"Ne plus vraiment y penser, c'est devenu un métier", labelEN:"Not really think about it anymore, it's a job now", effect:{stats:{mental:1}}},
      ]},
    {icon:'⏱️', title:"L'art du contre-la-montre par équipes", titleEN:"The art of the team time trial", desc:"Une rigueur collective héritée de longue date, où chaque relais compte autant que la performance individuelle.", descEN:"A long-standing collective discipline, where every turn on the front matters as much as individual performance.",
      choices:[
        {label:"Investir à fond dans cet exercice collectif", labelEN:"Commit fully to this collective exercise", effect:{stats:{clm:2}, fatigue:2}},
        {label:"Préférer les efforts solitaires", labelEN:"Prefer solo efforts", effect:{stats:{mental:1}}},
      ]},
  ],
  ES: [
    {icon:'😴', title:"La sieste et l'entraînement", titleEN:"The siesta and training", desc:"Adapter sa préparation à un rythme de vie différent, entre chaleur de l'après-midi et sorties matinales, fait partie de l'apprentissage.", descEN:"Adapting your preparation to a different pace of life, between afternoon heat and early-morning rides, is part of the learning curve.",
      choices:[
        {label:"Adopter pleinement ce rythme", labelEN:"Fully adopt this rhythm", effect:{stats:{recuperation:2}}},
        {label:"Continuer sur un rythme plus classique", labelEN:"Stick to a more conventional schedule", effect:{stats:{mental:1}}},
      ]},
    {icon:'⛰️', title:"Les arrivées au sommet", titleEN:"Summit finishes", desc:"Tu as grandi au pied de cols exigeants, à rêver de les gravir un jour à vive allure plutôt qu'en balade familiale.", descEN:"You grew up at the foot of demanding passes, dreaming of climbing them fast one day rather than on a family outing.",
      choices:[
        {label:"Avoir passé ton enfance à les gravir en rêvant", labelEN:"Have spent your childhood climbing them while dreaming", effect:{stats:{montagne:2}}},
        {label:"Avoir préféré les terrains plus roulants", labelEN:"Have preferred flatter terrain", effect:{stats:{sprint:1}}},
      ]},
    {icon:'🏛️', title:"L'ombre des légendes espagnoles", titleEN:"The shadow of Spanish legends", desc:"Vivre avec l'héritage de glorieux prédécesseurs, dont on te rappelle sans cesse le nom dès que tu approches d'un bon résultat.", descEN:"Living with the legacy of illustrious predecessors, whose names keep coming up the moment you approach a good result.",
      choices:[
        {label:"T'en inspirer sans complexe", labelEN:"Draw inspiration from them without complex", effect:{reputation:1, stats:{mental:2}}},
        {label:"Tracer ta propre route, loin des comparaisons", labelEN:"Chart your own path, far from comparisons", effect:{stats:{mental:2}}},
      ]},
  ],
  DE: [
    {icon:'📐', title:"La rigueur avant tout", titleEN:"Rigour above all", desc:"Une préparation méthodique, presque scientifique, où chaque séance est pensée et mesurée avec précision.", descEN:"A methodical, almost scientific preparation, where every session is planned and measured with precision.",
      choices:[
        {label:"T'investir à fond dans cette approche", labelEN:"Commit fully to this approach", effect:{stats:{clm:1, resistance:1}}},
        {label:"Garder une part d'instinct malgré tout", labelEN:"Keep a share of instinct regardless", effect:{stats:{mental:1}}},
      ]},
    {icon:'🚴‍♂️', title:"L'héritage du vélodrome", titleEN:"The velodrome legacy", desc:"Tes racines cyclistes viennent en partie de la piste, un monde à part avec ses propres codes et sa propre intensité.", descEN:"Your cycling roots partly come from the track, a world apart with its own codes and its own intensity.",
      choices:[
        {label:"Revenir t'entraîner sur piste de temps en temps", labelEN:"Go back and train on the track from time to time", effect:{stats:{sprint:2}}},
        {label:"Rester exclusivement sur route désormais", labelEN:"Stay exclusively on the road from now on", effect:{stats:{resistance:1}}},
      ]},
    {icon:'👥', title:"Le poids d'une génération", titleEN:"The weight of a generation", desc:"La pression de faire aussi bien que les glorieux anciens pèse parfois plus lourd que celle de tes adversaires du jour.", descEN:"The pressure to match the great riders of the past sometimes weighs heavier than that of your rivals on the day.",
      choices:[
        {label:"Accepter cette comparaison comme un moteur", labelEN:"Accept the comparison as motivation", effect:{stats:{mental:2}}},
        {label:"T'en détacher complètement", labelEN:"Detach yourself from it completely", effect:{stats:{mental:2}}},
      ]},
  ],
  AU: [
    {icon:'🌵', title:"Les kilomètres du bush", titleEN:"Miles through the bush", desc:"Des sorties solitaires interminables loin de tout, sur des routes désertes où le silence est parfois plus éprouvant que la distance elle-même.", descEN:"Endless solo rides far from anything, on empty roads where the silence is sometimes harder to bear than the distance itself.",
      choices:[
        {label:"Chérir cette solitude formatrice", labelEN:"Cherish this formative solitude", effect:{stats:{resistance:2, mental:1}}},
        {label:"Reconnaître que ça a été difficile à vivre", labelEN:"Admit it was hard to live through", effect:{stats:{resistance:1}}},
      ]},
    {icon:'✈️', title:"Un long voyage vers l'Europe", titleEN:"A long journey to Europe", desc:"L'exil a été une étape nécessaire pour percer, à des milliers de kilomètres de tes proches et de tes repères.", descEN:"The move abroad was a necessary step to break through, thousands of kilometres from your loved ones and everything familiar.",
      choices:[
        {label:"T'y être fait avec le temps", labelEN:"Have gotten used to it over time", effect:{stats:{mental:2}}},
        {label:"Ressentir encore parfois le mal du pays", labelEN:"Still sometimes feel homesick", effect:{fatigue:2}},
      ]},
    {icon:'🧭', title:"Forgé par l'isolement", titleEN:"Forged by isolation", desc:"Une abnégation propre aux coureurs déracinés, qui doivent souvent se construire une carrière loin de tout soutien familier.", descEN:"A resilience unique to uprooted riders, who often have to build a career far from any familiar support.",
      choices:[
        {label:"En avoir tiré une vraie force de caractère", labelEN:"Have drawn real strength of character from it", effect:{stats:{mental:3}}},
        {label:"Rester marqué par ces années difficiles", labelEN:"Still carry the mark of those difficult years", effect:{stats:{mental:1}}},
      ]},
  ],
  GB: [
    {icon:'🚴‍♀️', title:"De la piste à la route", titleEN:"From the track to the road", desc:"Ton parcours a été façonné par le vélodrome avant que tu ne bascules définitivement sur route.", descEN:"Your path was shaped by the velodrome before you moved permanently onto the road.",
      choices:[
        {label:"Garder des automatismes de pistard", labelEN:"Keep some track-honed reflexes", effect:{stats:{sprint:2}}},
        {label:"T'être complètement réinventé sur route", labelEN:"Have completely reinvented yourself on the road", effect:{stats:{resistance:1}}},
      ]},
    {icon:'🔬', title:"L'obsession du détail", titleEN:"The obsession with detail", desc:"Une culture des petites optimisations marginales imprègne ta manière de préparer chaque course, jusqu'au moindre réglage.", descEN:"A culture of small marginal gains runs through the way you prepare for every race, down to the smallest adjustment.",
      choices:[
        {label:"Adopter cette philosophie à fond", labelEN:"Fully embrace this philosophy", effect:{stats:{clm:1, mental:1}}},
        {label:"Juger que ça complique inutilement les choses", labelEN:"Feel it complicates things needlessly", effect:{stats:{mental:1}}},
      ]},
    {icon:'📈', title:"Un sport en pleine explosion", titleEN:"A sport on the rise", desc:"Tu as grandi dans un pays où le statut du cyclisme change à vue d'œil, passant d'un sport de niche à un vrai phénomène populaire.", descEN:"You grew up in a country where cycling's status is changing before your eyes, going from a niche sport to a real popular phenomenon.",
      choices:[
        {label:"Profiter de cette vague porteuse", labelEN:"Ride this rising wave", effect:{reputation:2}},
        {label:"Rester détaché de cet engouement soudain", labelEN:"Stay detached from the sudden hype", effect:{stats:{mental:1}}},
      ]},
  ],
  CO: [
    {icon:'🏔️', title:"Nées dans l'altitude", titleEN:"Born at altitude", desc:"Tes poumons se sont formés à plus de 2500 mètres bien avant que tu ne montes sur un vélo de course — un avantage silencieux que peu de rivaux peuvent reproduire.", descEN:"Your lungs developed above 2,500 metres long before you ever got on a racing bike — a quiet advantage few rivals can replicate.",
      choices:[
        {label:"En faire une fierté, revendiquer cet atout", labelEN:"Wear it with pride, claim this edge", effect:{stats:{montagne:2}}},
        {label:"Rester humble face à un don qu'on ne choisit pas", labelEN:"Stay humble about a gift you didn't choose", effect:{stats:{mental:2}}},
      ]},
    {icon:'🐞', title:"Le surnom d'escarabajo", titleEN:"The escarabajo nickname", desc:"L'affection populaire pour les grimpeurs colombiens t'a valu ce surnom affectueux, porté par des générations de coureurs avant toi.", descEN:"The public's affection for Colombian climbers earned you this fond nickname, carried by generations of riders before you.",
      choices:[
        {label:"Assumer ce surnom avec le sourire", labelEN:"Embrace the nickname with a smile", effect:{reputation:1, stats:{mental:2}}},
        {label:"Le trouver un peu réducteur", labelEN:"Find it a little reductive", effect:{stats:{mental:1}}},
      ]},
    {icon:'🎉', title:"La ferveur qui déborde", titleEN:"Fervour overflowing", desc:"Des routes noires de monde à chaque passage, une ferveur populaire qui n'a que peu d'équivalents ailleurs dans le peloton.", descEN:"Roads packed with people every time you pass, a popular fervour with few equivalents elsewhere in the peloton.",
      choices:[
        {label:"Puiser dans cette énergie collective", labelEN:"Draw on this collective energy", effect:{stats:{mental:3}}},
        {label:"Trouver ça parfois oppressant", labelEN:"Sometimes find it overwhelming", effect:{stats:{montagne:1}}},
      ]},
  ],
  DK: [
    {icon:'🎓', title:"Une filière jeunes exemplaire", titleEN:"An exemplary youth system", desc:"Un système de formation très structuré t'a accompagné dès tes débuts, avec une rigueur qui a payé sur le long terme.", descEN:"A highly structured development system has been with you since your early days, with a rigour that has paid off over the long run.",
      choices:[
        {label:"En reconnaître tous les bienfaits", labelEN:"Recognise all its benefits", effect:{stats:{resistance:1, mental:1}}},
        {label:"Regretter un certain manque de spontanéité", labelEN:"Miss a certain lack of spontaneity", effect:{stats:{mental:1}}},
      ]},
    {icon:'🌬️', title:"Le vent du Jutland", titleEN:"The wind of Jutland", desc:"T'endurcir sur des routes plates et constamment balayées par le vent a construit une bonne partie de ton mental de rouleur.", descEN:"Toughening up on flat roads constantly swept by the wind built a good part of your rouleur's mindset.",
      choices:[
        {label:"T'y être forgé un vrai mental de rouleur", labelEN:"Have forged a real rouleur's mentality from it", effect:{stats:{clm:2}}},
        {label:"Continuer de trouver ça éprouvant", labelEN:"Still find it gruelling", effect:{stats:{resistance:1}}},
      ]},
    {icon:'🧘', title:"La discipline scandinave", titleEN:"Scandinavian discipline", desc:"Une rigueur tranquille, sans esbroufe, qui imprègne ta façon d'aborder chaque saison sans grand discours.", descEN:"A quiet rigour, without fuss, that shapes the way you approach every season without much fanfare.",
      choices:[
        {label:"Cultiver cette sobriété", labelEN:"Cultivate this sobriety", effect:{stats:{mental:2}}},
        {label:"Avoir parfois besoin de sortir du cadre", labelEN:"Sometimes need to break out of the mould", effect:{stats:{mental:1}}},
      ]},
  ],
  CH: [
    {icon:'🗣️', title:"Jongler avec plusieurs langues", titleEN:"Juggling several languages", desc:"Évoluer dans un environnement multilingue dès l'enfance a façonné ta capacité à t'adapter à des équipes internationales.", descEN:"Growing up in a multilingual environment shaped your ability to adapt to international teams.",
      choices:[
        {label:"Voir ça comme un atout d'adaptation", labelEN:"See it as an asset for adaptation", effect:{stats:{mental:2}}},
        {label:"Trouver ça parfois fatigant", labelEN:"Sometimes find it tiring", effect:{fatigue:2}},
      ]},
    {icon:'🏔️', title:"Les montagnes à la porte", titleEN:"Mountains on your doorstep", desc:"Un terrain d'entraînement démesurément accessible, avec des cols exigeants à quelques kilomètres de chez toi.", descEN:"An outrageously accessible training ground, with demanding passes just a few kilometres from home.",
      choices:[
        {label:"En avoir profité à fond dès le plus jeune âge", labelEN:"Have made the most of it from a young age", effect:{stats:{montagne:2}}},
        {label:"Avoir aussi cherché d'autres types de terrain", labelEN:"Have also sought out other kinds of terrain", effect:{stats:{classiques:1}}},
      ]},
    {icon:'⚙️', title:"La précision suisse", titleEN:"Swiss precision", desc:"Une réputation de sérieux à tenir, où chaque détail de ta préparation semble scruté avec une exigence particulière.", descEN:"A reputation for seriousness to live up to, where every detail of your preparation seems scrutinised with particular rigour.",
      choices:[
        {label:"Vouloir toujours être à la hauteur de cette image", labelEN:"Always want to live up to that image", effect:{reputation:1, stats:{mental:1}}},
        {label:"Trouver cette étiquette un peu lourde à porter", labelEN:"Find that label a bit heavy to carry", effect:{stats:{mental:1}}},
      ]},
  ],
  SI: [
    {icon:'🇸🇮', title:"Un petit pays, de grands champions", titleEN:"A small country, great champions", desc:"Porter les espoirs d'une nation entière, malgré sa taille modeste, est une responsabilité que peu de coureurs ailleurs connaissent aussi intensément.", descEN:"Carrying the hopes of an entire nation, despite its modest size, is a responsibility few riders elsewhere know so intensely.",
      choices:[
        {label:"Accepter cette responsabilité avec fierté", labelEN:"Accept this responsibility with pride", effect:{reputation:1, stats:{mental:2}}},
        {label:"Chercher à t'en détacher pour rester libre", labelEN:"Try to distance yourself from it to stay free", effect:{stats:{mental:2}}},
      ]},
    {icon:'🤝', title:"Une communauté soudée", titleEN:"A tight-knit community", desc:"Le microcosme du cyclisme de ton pays fait que tout le monde se connaît, se croise, se soutient — pour le meilleur et parfois pour la pression que ça ajoute.", descEN:"The small world of cycling in your country means everyone knows, crosses paths with, and supports each other — for better, and sometimes for the added pressure.",
      choices:[
        {label:"Rester proche de ce petit monde", labelEN:"Stay close to this small world", effect:{stats:{mental:2}}},
        {label:"Prendre volontairement un peu de distance", labelEN:"Deliberately keep a little distance", effect:{stats:{mental:1}}},
      ]},
    {icon:'🌟', title:"Prouver que ce n'est pas un hasard", titleEN:"Proving it's no fluke", desc:"L'ombre d'autres champions nationaux récents plane sur ta propre carrière, comme une comparaison permanente à assumer ou à fuir.", descEN:"The shadow of other recent national champions hangs over your own career, a constant comparison to embrace or escape.",
      choices:[
        {label:"Vouloir montrer que le pays sait en former d'autres", labelEN:"Want to show the country can produce more", effect:{stats:{mental:3}}},
        {label:"Refuser cette pression comparative", labelEN:"Refuse this comparative pressure", effect:{stats:{mental:1}}},
      ]},
  ],
  US: [
    {icon:'🏈', title:"Un sport de niche à la maison", titleEN:"A niche sport back home", desc:"Tu as grandi dans un pays où le cyclisme reste relativement confidentiel, loin de l'attention réservée à d'autres disciplines.", descEN:"You grew up in a country where cycling remains relatively under the radar, far from the attention given to other sports.",
      choices:[
        {label:"Cultiver ta passion sans validation extérieure", labelEN:"Nurture your passion without outside validation", effect:{stats:{mental:2}}},
        {label:"Regretter ce manque de reconnaissance locale", labelEN:"Regret this lack of local recognition", effect:{stats:{mental:1}}},
      ]},
    {icon:'🌍', title:"Convaincre loin de chez soi", titleEN:"Proving yourself far from home", desc:"L'obligation de faire tes preuves en Europe, loin de ton pays, a demandé une adaptation supplémentaire à ta carrière.", descEN:"Having to prove yourself in Europe, far from your home country, demanded an extra layer of adaptation in your career.",
      choices:[
        {label:"Relever ce défi avec détermination", labelEN:"Take on this challenge with determination", effect:{stats:{mental:2, resistance:1}}},
        {label:"Trouver ça éprouvant psychologiquement", labelEN:"Find it psychologically draining", effect:{fatigue:2}},
      ]},
    {icon:'💼', title:"Chercher des sponsors envers et contre tout", titleEN:"Chasing sponsors against the odds", desc:"Un financement moins évident à trouver que dans les nations cyclistes historiques, demandant un vrai sens du contact.", descEN:"Funding is harder to find than in the historic cycling nations, requiring a real knack for networking.",
      choices:[
        {label:"Devenir habile à ce jeu-là aussi", labelEN:"Become skilled at that game too", effect:{reputation:2}},
        {label:"Préférer laisser ça à ton entourage", labelEN:"Prefer to leave it to those around you", effect:{stats:{mental:1}}},
      ]},
  ],
  NO: [
    {icon:'❄️', title:"Une saison d'entraînement raccourcie", titleEN:"A shortened training season", desc:"Composer avec un hiver interminable a demandé une organisation particulière pour optimiser la courte fenêtre disponible.", descEN:"Dealing with an endless winter required particular organisation to make the most of the short window available.",
      choices:[
        {label:"Optimiser à fond la fenêtre disponible", labelEN:"Make the most of the available window", effect:{stats:{resistance:2}}},
        {label:"Compenser par d'autres disciplines l'hiver", labelEN:"Make up for it with other sports in winter", effect:{stats:{mental:1}}},
      ]},
    {icon:'🚲', title:"Le home-trainer, fidèle compagnon", titleEN:"The turbo trainer, a faithful companion", desc:"Des mois entiers passés à rouler entre quatre murs, le regard fixé sur un écran, en attendant le retour des beaux jours.", descEN:"Whole months spent riding within four walls, eyes fixed on a screen, waiting for better days to return.",
      choices:[
        {label:"En faire une force mentale", labelEN:"Turn it into mental strength", effect:{stats:{mental:2, clm:1}}},
        {label:"Avoir hâte que ça se termine chaque année", labelEN:"Look forward to it ending every year", effect:{stats:{mental:1}}},
      ]},
    {icon:'⛷️', title:"Venu du ski de fond", titleEN:"Came from cross-country skiing", desc:"Une reconversion sportive qui a fait ses preuves, avec une endurance héritée d'une autre discipline exigeante.", descEN:"A sporting switch that has proven its worth, with endurance inherited from another demanding discipline.",
      choices:[
        {label:"Garder cette endurance héritée comme un atout", labelEN:"Keep this inherited endurance as an asset", effect:{stats:{resistance:2}}},
        {label:"T'être recentré uniquement sur le vélo depuis", labelEN:"Have refocused solely on cycling since", effect:{stats:{mental:1}}},
      ]},
  ],
  LU: [
    {icon:'🏅', title:"Une fierté disproportionnée", titleEN:"A disproportionate pride", desc:"L'attention d'un pays entier repose sur si peu de coureurs professionnels, ce qui démultiplie le poids de chaque résultat.", descEN:"An entire country's attention rests on so few professional riders, which multiplies the weight of every result.",
      choices:[
        {label:"Porter ça avec le sourire", labelEN:"Carry it with a smile", effect:{reputation:1, stats:{mental:2}}},
        {label:"Trouver ce poids parfois lourd à porter", labelEN:"Sometimes find the weight heavy to bear", effect:{stats:{mental:1}}},
      ]},
    {icon:'👨‍👩‍👦', title:"Une histoire de famille", titleEN:"A family story", desc:"Des lignées de coureurs se sont transmises à travers les générations dans ton entourage, un héritage qui te précède.", descEN:"Lines of riders have passed the torch through the generations around you, a legacy that precedes you.",
      choices:[
        {label:"T'inscrire fièrement dans cette lignée", labelEN:"Proudly join this lineage", effect:{stats:{mental:2}}},
        {label:"Vouloir tracer ton propre chemin", labelEN:"Want to chart your own path", effect:{stats:{mental:2}}},
      ]},
    {icon:'🇱🇺', title:"Le poids d'un petit pays qui y croit", titleEN:"The weight of a small country's belief", desc:"L'attente collective d'une nation entière se fait sentir à chaque grand rendez-vous, même à échelle modeste.", descEN:"The collective expectation of an entire nation is felt at every big occasion, even on a modest scale.",
      choices:[
        {label:"Te dire que chaque résultat compte double", labelEN:"Tell yourself every result counts double", effect:{stats:{mental:2}}},
        {label:"Essayer de ne pas trop y penser", labelEN:"Try not to think about it too much", effect:{stats:{mental:1}}},
      ]},
  ],
  PT: [
    {icon:'🌊', title:"Des routes sinueuses en bord d'Atlantique", titleEN:"Winding roads along the Atlantic", desc:"Un terrain technique et changeant, entre reliefs côtiers et vents marins, a façonné ta capacité d'adaptation.", descEN:"Technical, ever-changing terrain, between coastal relief and sea winds, shaped your ability to adapt.",
      choices:[
        {label:"Devenir redoutable sur ce genre de terrain", labelEN:"Become formidable on this kind of terrain", effect:{stats:{classiques:2}}},
        {label:"Préférer les longues lignes droites", labelEN:"Prefer long straight roads", effect:{stats:{clm:1}}},
      ]},
    {icon:'⛰️', title:"Grimpeur dans l'âme", titleEN:"A climber at heart", desc:"Une tradition ancrée de purs grimpeurs t'a précédé, et tu t'y reconnais pleinement dans ta manière de courir.", descEN:"A deep-rooted tradition of pure climbers came before you, and you fully recognise yourself in it in the way you race.",
      choices:[
        {label:"T'inscrire dans cette lignée", labelEN:"Join this lineage", effect:{stats:{montagne:2}}},
        {label:"Vouloir élargir ta palette de qualités", labelEN:"Want to broaden your range of qualities", effect:{stats:{sprint:1}}},
      ]},
    {icon:'📻', title:"Une passion locale, peu exportée", titleEN:"A local passion, rarely exported", desc:"L'envie de faire connaître le cyclisme de ton pays au-delà de ses frontières t'habite depuis tes débuts.", descEN:"The desire to make your country's cycling known beyond its borders has driven you since your early days.",
      choices:[
        {label:"Te sentir investi d'une mission", labelEN:"Feel invested with a mission", effect:{reputation:1, stats:{mental:2}}},
        {label:"Rester concentré sur ta seule carrière", labelEN:"Stay focused solely on your own career", effect:{stats:{mental:1}}},
      ]},
  ],
  PL: [
    {icon:'📈', title:"Une scène en pleine ascension", titleEN:"A scene on the rise", desc:"Tu fais partie d'une génération qui structure et fait progresser le cyclisme de ton pays, saison après saison.", descEN:"You're part of a generation building and advancing your country's cycling, season after season.",
      choices:[
        {label:"Te sentir pionnier de cet essor", labelEN:"Feel like a pioneer of this rise", effect:{reputation:1, stats:{mental:2}}},
        {label:"Simplement vouloir bien courir, sans grand récit", labelEN:"Simply want to race well, without a grand narrative", effect:{stats:{mental:1}}},
      ]},
    {icon:'🪨', title:"Viser enfin une classique", titleEN:"Finally aiming for a classic", desc:"Une ambition encore neuve dans ton pays, où décrocher une victoire sur les pavés ou les monuments reste un rêve à concrétiser.", descEN:"A still-new ambition in your country, where winning on the cobbles or at a monument remains a dream yet to come true.",
      choices:[
        {label:"En faire un objectif personnel fort", labelEN:"Make it a strong personal goal", effect:{stats:{classiques:2}}},
        {label:"Rester réaliste sur tes chances actuelles", labelEN:"Stay realistic about your current chances", effect:{stats:{mental:1}}},
      ]},
    {icon:'🌗', title:"Sortir de l'ombre", titleEN:"Stepping out of the shadow", desc:"Un pays qui commence tout juste à être respecté dans le peloton, après des années à devoir prouver sa légitimité.", descEN:"A country only just starting to earn respect in the peloton, after years of having to prove its legitimacy.",
      choices:[
        {label:"Vouloir changer ce regard par tes résultats", labelEN:"Want to change that perception through your results", effect:{stats:{mental:3}}},
        {label:"Laisser les résultats parler d'eux-mêmes, sans forcer", labelEN:"Let results speak for themselves, without forcing it", effect:{stats:{mental:1}}},
      ]},
  ],
  IE: [
    {icon:'🍀', title:"La dureté comme héritage", titleEN:"Toughness as a legacy", desc:"Une tradition de coureurs increvables précède ta génération, forgée par des décennies de conditions peu clémentes.", descEN:"A tradition of indestructible riders came before your generation, forged by decades of unforgiving conditions.",
      choices:[
        {label:"T'inscrire dans cette réputation", labelEN:"Live up to this reputation", effect:{stats:{resistance:2}}},
        {label:"Vouloir montrer une autre facette de ton talent", labelEN:"Want to show another side of your talent", effect:{stats:{montagne:1}}},
      ]},
    {icon:'🌧️', title:"Les routes battues par la pluie", titleEN:"Roads battered by rain", desc:"T'endurcir dès le plus jeune âge sous une météo rarement clémente a construit une bonne partie de ton mental de course.", descEN:"Toughening up from a young age under rarely forgiving weather built a good part of your racing mindset.",
      choices:[
        {label:"Ne plus jamais vraiment craindre le mauvais temps", labelEN:"Never really fear bad weather again", effect:{stats:{resistance:2, mental:1}}},
        {label:"Continuer d'espérer un rayon de soleil de temps en temps", labelEN:"Keep hoping for the occasional ray of sunshine", effect:{stats:{mental:1}}},
      ]},
    {icon:'🎭', title:"Le syndrome de l'outsider", titleEN:"The underdog syndrome", desc:"Jouer les trouble-fêtes plutôt que les favoris fait partie de ton identité de coureur, assumée avec un certain plaisir.", descEN:"Playing the spoiler rather than the favourite is part of your identity as a rider, embraced with a certain pleasure.",
      choices:[
        {label:"Cultiver ce statut avec plaisir", labelEN:"Cultivate this status with pleasure", effect:{stats:{mental:2}}},
        {label:"Vouloir enfin être pris au sérieux comme favori", labelEN:"Finally want to be taken seriously as a favourite", effect:{reputation:1, stats:{mental:1}}},
      ]},
  ],
  ER: [
    {icon:'📯', title:"Une ferveur populaire immense", titleEN:"Immense popular fervour", desc:"Des foules disproportionnées par rapport à la taille du pays se massent à chaque passage, portées par une passion cycliste intense.", descEN:"Crowds disproportionate to the size of the country gather every time you pass, driven by intense cycling passion.",
      choices:[
        {label:"Te nourrir de cette ferveur unique", labelEN:"Feed off this unique fervour", effect:{stats:{mental:3}}},
        {label:"En ressentir aussi parfois le poids", labelEN:"Also sometimes feel its weight", effect:{fatigue:2}},
      ]},
    {icon:'💪', title:"Peu de moyens, beaucoup de talent", titleEN:"Few resources, plenty of talent", desc:"Percer malgré des ressources limitées demande une détermination particulière, loin des infrastructures des nations cyclistes historiques.", descEN:"Breaking through despite limited resources takes particular determination, far from the infrastructure of the historic cycling nations.",
      choices:[
        {label:"En tirer une vraie force de caractère", labelEN:"Draw real strength of character from it", effect:{stats:{mental:3}}},
        {label:"Espérer que les moyens s'améliorent pour la relève", labelEN:"Hope resources improve for the next generation", effect:{stats:{mental:1}}},
      ]},
    {icon:'🌍', title:"Ouvrir la voie", titleEN:"Blazing a trail", desc:"Représenter un continent encore trop peu présent dans le peloton mondial ajoute une dimension particulière à chacune de tes courses.", descEN:"Representing a continent still too rarely present in the world peloton adds a particular dimension to every one of your races.",
      choices:[
        {label:"Porter fièrement ce rôle de pionnier", labelEN:"Proudly carry this pioneering role", effect:{reputation:2, stats:{mental:2}}},
        {label:"Vouloir simplement être jugé sur tes résultats", labelEN:"Simply want to be judged on your results", effect:{stats:{mental:1}}},
      ]},
  ],
  RW: [
    {icon:'⛰️', title:"Le pays aux mille collines", titleEN:"The land of a thousand hills", desc:"Un relief brutal et omniprésent a naturellement forgé tes qualités de grimpeur, bien avant ta première course officielle.", descEN:"Relentless, ever-present terrain naturally forged your climbing qualities, long before your first official race.",
      choices:[
        {label:"En faire ta plus grande force", labelEN:"Make it your greatest strength", effect:{stats:{montagne:3}}},
        {label:"Reconnaître que ça a aussi été un apprentissage rude", labelEN:"Acknowledge it was also a tough learning experience", effect:{stats:{mental:1, montagne:1}}},
      ]},
    {icon:'🌍', title:"Représenter l'essor du cyclisme africain", titleEN:"Representing the rise of African cycling", desc:"Tu fais partie d'un mouvement plus large qui dépasse ta seule carrière individuelle, porté par tout un continent en pleine progression cycliste.", descEN:"You're part of a bigger movement beyond your own individual career, carried by a whole continent on the rise in cycling.",
      choices:[
        {label:"Embrasser pleinement ce rôle", labelEN:"Fully embrace this role", effect:{reputation:2, stats:{mental:2}}},
        {label:"Préférer rester concentré sur ta propre trajectoire", labelEN:"Prefer to stay focused on your own path", effect:{stats:{mental:1}}},
      ]},
    {icon:'🎗️', title:"Porter un symbole", titleEN:"Carrying a symbol", desc:"Bien plus qu'une simple carrière individuelle est en jeu à chaque grand rendez-vous, et tu le sens à chaque fois un peu plus.", descEN:"Far more than a simple individual career is at stake at every big occasion, and you feel it a little more each time.",
      choices:[
        {label:"Accepter cette responsabilité avec fierté", labelEN:"Accept this responsibility with pride", effect:{stats:{mental:3}}},
        {label:"Essayer de ne pas laisser ce poids t'écraser", labelEN:"Try not to let the weight crush you", effect:{stats:{mental:1}}},
      ]},
  ],
};
