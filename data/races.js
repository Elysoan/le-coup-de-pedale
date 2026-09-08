/* type: grandtour | monument | semitour | champ | crit
   prestige: 1-5 (poids réputation)
   fatCost: coût de fatigue de base par évènement
   events: liste d'évènements bespoke {title, desc, focus:[stat,stat], choices:[{label, risk, tilt:[stat...]}]} */

function RACE_DEFS(){ return [
  {id:'tdu', name:'Le Tour au Bout du Monde', type:'semitour', month:1, prestige:1, fatCost:5, days:6,flag:'🇦🇺',
    eventDefs:[
      {focus:['resistance','recuperation'], choices:[
          {label:"Rester au chaud dans le peloton", labelEN:"Stay sheltered in the peloton", risk:'sur', tilt:['recuperation']},
          {label:"Se placer devant pour éviter les chutes", labelEN:"Move to the front to avoid crashes", risk:'equilibre', tilt:['mental','resistance']},
          {label:"Tenter une échappée matinale", labelEN:"Try an early breakaway", risk:'audacieux', tilt:['resistance','mental']},
        ], variants:[
          {title:"Étape d'ouverture, chaleur australienne", titleEN:"Opening stage, Australian heat", desc:"Le peloton roule sous 38°C. La gestion de l'effort compte autant que les jambes.", descEN:"The peloton rides in 38°C heat. Managing your effort matters as much as your legs."},
          {title:"Étape de la côte mythique", titleEN:"Stage on the legendary climb", desc:"La côte mythique de cette course d'ouverture, où les leaders se jaugent pour la première fois de la saison.", descEN:"The legendary climb of this season-opening race, where the leaders size each other up for the first time of the year."},
          {title:"Étape sous une chaleur australienne écrasante", titleEN:"Stage under crushing Australian heat", desc:"Un tracé exigeant qui teste la gestion de l'effort dès les premiers jours de saison.", descEN:"A demanding route that tests effort management right from the first days of the season."},
          {title:"Circuit côtier balayé par les embruns", titleEN:"Coastal circuit swept by sea spray", desc:"Une étape roulante en bord de mer, entre vent et paysages spectaculaires.", descEN:"A rolling seaside stage, between wind and spectacular scenery."},
        ]}
    ]},
  {id:'paris-nice', name:'La Course au Soleil', type:'semitour', month:3, prestige:2, fatCost:6, days:8,flag:'🇫🇷',
    eventDefs:[
      {focus:['montagne','clm','mental'], choices:[
          {label:"Suivre les meilleurs sans attaquer", labelEN:"Follow the best riders without attacking", risk:'sur', tilt:['mental']},
          {label:"Placer une attaque à 2km de l'arrivée", labelEN:"Launch an attack 2km from the finish", risk:'equilibre', tilt:['montagne']},
          {label:"Partir seul dès le pied de la côte", labelEN:"Go solo from the foot of the climb", risk:'audacieux', tilt:['montagne','mental']},
        ], variants:[
          {title:"Étape à l'arrivée en côte", titleEN:"Stage with an uphill finish", desc:"La course au soleil sort les premiers vrais leaders de la saison sur une arrivée en côte.", descEN:"The race to the sun reveals the season's first real leaders on an uphill finish."},
          {title:"Contre-la-montre final avant l'arrivée sur la Côte d'Azur", titleEN:"Final time trial before the finish on the Riviera", desc:"Souvent l'exercice qui scelle le classement général de cette course.", descEN:"Often the exercise that seals the general classification of this race."},
          {title:"Étape dans l'arrière-pays niçois", titleEN:"Stage in the hinterland behind the Riviera", desc:"Un final vallonné qui referme cette semaine de mise en jambes avant le printemps.", descEN:"A rolling finale that closes out this leg-opening week ahead of spring."},
          {title:"Étape sous la neige en Haute-Provence", titleEN:"Stage under snow in the high country", desc:"Un contraste saisissant avec le soleil promis par le nom de la course.", descEN:"A striking contrast with the sunshine promised by the race's name."},
        ]},
    ]},
  {id:'tirreno', name:"D'une Mer à l'Autre", type:'semitour', month:3, prestige:2, fatCost:6, days:7,flag:'🇮🇹',
    eventDefs:[
      {focus:['classiques','mental'], choices:[
          {label:"Se cacher au milieu du peloton", labelEN:"Hide in the middle of the peloton", risk:'sur', tilt:['recuperation']},
          {label:"Se battre pour être dans la bonne échelle", labelEN:"Fight to be in the right echelon", risk:'equilibre', tilt:['classiques','mental']},
          {label:"Lancer la bordure soi-même en tête", labelEN:"Launch the echelon yourself at the front", risk:'audacieux', tilt:['classiques','mental']},
        ], variants:[
          {title:"Étape des Marches, vent de travers", titleEN:"Marche stage, crosswind", desc:"Le vent souffle depuis la mer Adriatique : le peloton se scinde en bordures.", descEN:"The wind blows in off the Adriatic Sea: the peloton splits into echelons."},
          {title:"Étape d'altitude décisive", titleEN:"Decisive summit finish", desc:"Une arrivée en altitude qui sépare déjà les prétendants au général.", descEN:"A summit finish that already separates the GC contenders."},
          {title:"Étape côtière entre deux mers italiennes", titleEN:"Coastal stage between two Italian seas", desc:"Un parcours qui traverse la péninsule d'un rivage à l'autre en une semaine.", descEN:"A route that crosses the peninsula from one shore to the other in a week."},
          {title:"Contre-la-montre final au bord de l'Adriatique", titleEN:"Final time trial on the Adriatic coast", desc:"Le classement général se joue souvent lors de ce chrono conclusif.", descEN:"The general classification is often decided in this closing time trial."},
        ]}
    ]},
  {id:'sanremo', name:'La Primavera', type:'monument', month:3, prestige:4, fatCost:10, days:1,flag:'🇮🇹',
    eventDefs:[
      {focus:['classiques','sprint'], choices:[
          {label:"Attendre le sprint massif sur le front de mer", labelEN:"Wait for the bunch sprint on the seafront", risk:'sur', tilt:['sprint']},
          {label:"Suivre la première attaque dans la descente", labelEN:"Follow the first attack on the descent", risk:'equilibre', tilt:['classiques','mental']},
          {label:"Attaquer soi-même au sommet du Poggio", labelEN:"Attack yourself at the top of the Poggio", risk:'audacieux', tilt:['classiques','mental']},
        ], variants:[
          {title:"Le Poggio, à quelques encablures de la ligne", titleEN:"The Poggio, a stone's throw from the line", desc:"La classique la plus longue de la saison se joue en quelques secondes sur cette dernière difficulté.", descEN:"The longest classic of the season is decided in a matter of seconds on this final climb."},
          {title:"La Cipressa, avant-dernière difficulté", titleEN:"The Cipressa, second-to-last climb", desc:"Beaucoup de courses se sont jouées ici avant même d'attaquer le Poggio.", descEN:"Many races have been decided here, even before tackling the Poggio."},
          {title:"Ascension du Poggio avant la descente finale", titleEN:"Climbing the Poggio before the final descent", desc:"Le dernier piège avant un sprint massif sur la promenade en bord de mer.", descEN:"The last trap before a bunch sprint along the seafront promenade."},
          {title:"Longue étape ligure sous le soleil printanier", titleEN:"Long Ligurian stage under the spring sun", desc:"Près de 300 km, l'une des plus longues classiques du calendrier professionnel.", descEN:"Nearly 300km — one of the longest classics on the professional calendar."},
        ]}
    ]},
  {id:'catalunya', name:'Le Tour de Catalogne', type:'semitour', month:3, prestige:2, fatCost:6, days:7,flag:'🇪🇸',
    eventDefs:[
      {focus:['montagne','resistance'], choices:[
          {label:"Rouler pour l'équipe, sans ambition perso", labelEN:"Ride for the team, no personal ambitions", risk:'sur', tilt:['resistance']},
          {label:"Jouer sa carte dans le final", labelEN:"Play your own card in the finale", risk:'equilibre', tilt:['montagne']},
          {label:"Tenter le tout pour le tout en échappée", labelEN:"Go all-in on a breakaway", risk:'audacieux', tilt:['montagne','mental']},
        ], variants:[
          {title:"Étape pyrénéo-catalane", titleEN:"Catalan-Pyrenean stage", desc:"Une étape accidentée dans l'arrière-pays de Gérone, loin des regards mais formatrice.", descEN:"A hilly stage in the Girona hinterland, far from the spotlight but a great learning ground."},
          {title:"Étape d'arrivée au sommet", titleEN:"Summit finish stage", desc:"Une arrivée au sommet dans les Pyrénées catalanes, loin des médias mais décisive pour le classement.", descEN:"A summit finish in the Catalan Pyrenees, far from the media spotlight but decisive for the standings."},
          {title:"Étape dans l'arrière-pays catalan", titleEN:"Stage in the Catalan hinterland", desc:"Un tracé accidenté typique du relief du nord-est espagnol.", descEN:"A hilly route typical of the terrain in north-eastern Spain."},
          {title:"Circuit final dans une grande ville catalane", titleEN:"Final circuit in a major Catalan city", desc:"Une étape urbaine et nerveuse pour clôturer la semaine.", descEN:"An urban, nervy stage to close out the week."},
        ]}
    ]},
  {id:'strade-bianche', name:'Les Chemins Blancs de Toscane', type:'classique', month:3, prestige:3, fatCost:9, days:1,flag:'🇮🇹',
    eventDefs:[
      {focus:['classiques','resistance'], choices:[
          {label:"Rouler prudemment sur les chemins de terre", labelEN:"Ride cautiously on the dirt roads", risk:'sur', tilt:['resistance']},
          {label:"Se placer en tête avant les secteurs blancs", labelEN:"Get to the front before the white-road sectors", risk:'equilibre', tilt:['classiques']},
          {label:"Attaquer sur un secteur de gravier", labelEN:"Attack on a gravel sector", risk:'audacieux', tilt:['classiques','mental']},
        ], variants:[
          {title:"Les strade bianche de Toscane", titleEN:"The strade bianche of Tuscany", desc:"Les chemins blancs et poussiéreux de Toscane transforment la course en épreuve quasi tout-terrain.", descEN:"The dusty white roads of Tuscany turn the race into something close to an off-road event."},
          {title:"L'ultime secteur blanc avant l'arrivée", titleEN:"The last white-road sector before the finish", desc:"Le dernier chemin de terre avant l'arrivée sur la place centrale de Sienne.", descEN:"The last dirt road before the finish on Siena's main square."},
          {title:"Secteur de gravier toscan", titleEN:"Tuscan gravel sector", desc:"La poussière blanche colle aux jambes et au visage, un décor unique dans le calendrier.", descEN:"White dust clings to legs and faces — a setting unlike anything else on the calendar."},
          {title:"Montée finale sur les chemins blancs", titleEN:"Final climb on the white roads", desc:"Les derniers kilomètres sur la poussière blanche d'une cité médiévale toscane, une lutte contre la pente et le gravier.", descEN:"The final kilometres on white gravel dust through a Tuscan medieval hilltop city — a fight against the slope and the loose surface."},
        ]}
    ]},
  {id:'gp-littoral', name:'Grand Prix du Littoral', type:'classique', month:3, prestige:2, fatCost:6, days:1, flag:'🇳🇱',
    eventDefs:[
      {focus:['sprint','resistance'], choices:[
          {label:"Rester bien calé dans le peloton jusqu'au dernier kilomètre", labelEN:"Stay tucked in the peloton until the final kilometre", risk:'sur', tilt:['recuperation']},
          {label:"Se lancer dans le sprint à 250 mètres", labelEN:"Launch the sprint from 250 metres", risk:'equilibre', tilt:['sprint']},
          {label:"Partir de loin, seul contre tous", labelEN:"Go from distance, alone against the pack", risk:'audacieux', tilt:['sprint','mental']},
        ], variants:[
          {title:"Un sprint massif sur le front de mer", titleEN:"A bunch sprint on the seafront", desc:"Le peloton n'a jamais explosé — les sprinteurs se disputent la victoire dans un final rectiligne au bord de la mer du Nord.", descEN:"The peloton never broke apart — sprinters battle it out on a straight seafront finish on the North Sea coast."},
          {title:"Vent de face dans le dernier kilomètre", titleEN:"Headwind in the final kilometre", desc:"Un sprint difficile, contre le vent, où la puissance pure fait la différence.", descEN:"A tough sprint into a headwind, where raw power makes the difference."},
          {title:"Bordures dans la dernière ligne droite", titleEN:"Echelons in the final straight", desc:"Le vent de travers a redistribué les cartes, mais les meilleurs sprinteurs sont toujours là.", descEN:"The crosswind reshuffled the deck, but the best sprinters are still there."},
          {title:"Sprint serré entre deux équipes de pointe", titleEN:"A tight sprint between two top teams", desc:"Deux trains de sprinteurs se disputent le meilleur couloir dans le dernier virage.", descEN:"Two sprint trains battle for the best line through the final bend."},
        ]}
    ]},
    {id:'e3-saxo', name:'Le Prélude Flandrien', type:'classique', month:3, prestige:2, fatCost:8, days:1,flag:'🇧🇪',
    eventDefs:[
      {focus:['classiques','mental'], choices:[
          {label:"Rester couvert dans le peloton flandrien", labelEN:"Stay sheltered in the Flemish peloton", risk:'sur', tilt:['recuperation']},
          {label:"Se positionner avant les monts", labelEN:"Get into position before the climbs", risk:'equilibre', tilt:['classiques']},
          {label:"Attaquer sur un des monts flandriens", labelEN:"Attack on one of the Flemish climbs", risk:'audacieux', tilt:['classiques','mental']},
        ], variants:[
          {title:"Deux monts flandriens enchaînés", titleEN:"Two Flemish climbs back to back", desc:"Une répétition générale flandrienne où les favoris de la Ronde du Plat Pays se jaugent déjà.", descEN:"A Flemish dress rehearsal, where the Ronde favourites already size each other up."},
          {title:"La Côte de Trieu", titleEN:"The Côte de Trieu", desc:"Un enchaînement de pavés et de bosses qui préfigure les grandes classiques d'avril.", descEN:"A string of cobbles and climbs that foreshadows the great April classics."},
          {title:"Passage sur un mur pavé emblématique", titleEN:"Over an iconic cobbled wall", desc:"Un avant-goût des monts qui feront la légende du printemps flandrien quelques semaines plus tard.", descEN:"A taste of the climbs that will make Flemish spring legend a few weeks later."},
          {title:"Circuit venteux dans la campagne flamande", titleEN:"Windswept circuit through the Flemish countryside", desc:"Un vent de travers qui trie déjà les favoris avant les grandes classiques.", descEN:"A crosswind that already sorts out the favourites ahead of the big classics."},
        ]}
    ]},
  {id:'gent-wevelgem', name:'La Classique du Plugstreet', type:'classique', month:4, prestige:2, fatCost:8, days:1,flag:'🇧🇪',
    eventDefs:[
      {focus:['classiques','resistance'], choices:[
          {label:"Gérer le vent en restant abrité", labelEN:"Manage the wind by staying sheltered", risk:'sur', tilt:['resistance']},
          {label:"Se battre dans les bordures", labelEN:"Fight in the echelons", risk:'equilibre', tilt:['classiques','mental']},
          {label:"Forcer l'allure dans le Kemmelberg", labelEN:"Force the pace on the Kemmelberg", risk:'audacieux', tilt:['classiques','mental']},
        ], variants:[
          {title:"Le Plugstreets, secteurs pavés de la Grande Guerre", titleEN:"The Plugstreets, cobbled sectors of the Great War", desc:"Un parcours chargé d'histoire, entre plaine venteuse et pavés inégaux.", descEN:"A route steeped in history, between windswept plains and uneven cobbles."},
          {title:"Le Kemmelberg, deux fois au programme", titleEN:"The Kemmelberg, tackled twice", desc:"La double ascension du Kemmelberg fait souvent exploser le peloton avant l'arrivée à Wevelgem.", descEN:"The double ascent of the Kemmelberg often blows the peloton apart before the finish in Wevelgem."},
          {title:"Passage par des chemins chargés d'histoire", titleEN:"Through roads steeped in history", desc:"Des vestiges de la Grande Guerre bordent une partie du parcours.", descEN:"Remnants of the Great War line part of the route."},
          {title:"Étape balayée par le vent de la mer du Nord", titleEN:"Stage swept by the North Sea wind", desc:"Un vent latéral qui peut décider la course bien avant le final.", descEN:"A crosswind that can decide the race well before the finale."},
        ]}
    ]},
  {id:'flandres', name:'La Ronde du Plat Pays', type:'monument', month:4, prestige:5, fatCost:11, days:1,flag:'🇧🇪',
    eventDefs:[
      {focus:['classiques','mental'], choices:[
          {label:"Rester prudent et gérer sa position", labelEN:"Stay cautious and manage your position", risk:'sur', tilt:['classiques']},
          {label:"Attaquer dans le Paterberg", labelEN:"Attack on the Paterberg", risk:'equilibre', tilt:['classiques','mental']},
          {label:"Partir seul dès le Mur de Grammont", labelEN:"Go solo from the Mur de Grammont", risk:'audacieux', tilt:['classiques','mental']},
        ], variants:[
          {title:"Mur de Grammont puis Paterberg", titleEN:"Mur de Grammont then Paterberg", desc:"Les monts flandriens s'enchaînent. La course se joue dans les 15 derniers kilomètres.", descEN:"The Flemish climbs come one after another. The race is decided in the last 15km."},
          {title:"Le Vieux Quaremont, à quelques kilomètres de l'arrivée", titleEN:"The Vieux Quaremont, a few kilometres from the finish", desc:"Pavés et pourcentages costauds referment la Ronde du Plat Pays avant l'arrivée à Audenarde.", descEN:"Cobbles and steep gradients close out the Ronde before the finish in Oudenaarde."},
          {title:"Enchaînement de deux monts pavés mythiques", titleEN:"Back-to-back legendary cobbled climbs", desc:"Le double passage qui décide traditionnellement de la course.", descEN:"The double passage that traditionally decides the race."},
          {title:"Un final sous une pluie battante", titleEN:"A finale under pouring rain", desc:"Les pavés flandriens deviennent redoutables quand ils sont mouillés.", descEN:"The Flemish cobbles turn treacherous when wet."},
        ]}
    ]},
  {id:'roubaix', name:"L'Enfer du Nord", type:'monument', month:4, prestige:5, fatCost:12, days:1,flag:'🇫🇷',
    eventDefs:[
      {focus:['classiques','resistance'], choices:[
          {label:"Se glisser prudemment au milieu du peloton", labelEN:"Slot in cautiously amid the peloton", risk:'sur', tilt:['resistance']},
          {label:"Se battre pour entrer en tête sur le pavé", labelEN:"Fight to enter the cobbles at the front", risk:'equilibre', tilt:['classiques','mental']},
          {label:"Attaquer sur les pavés, quitte à tout risquer", labelEN:"Attack on the cobbles, whatever the risk", risk:'audacieux', tilt:['classiques','mental']},
        ], variants:[
          {title:"La Trouée d'Arenberg", titleEN:"The Trouée d'Arenberg", desc:"Le secteur pavé le plus redouté du calendrier. La course peut basculer ici, dans la poussière et les crevaisons.", descEN:"The most feared cobbled sector on the calendar. The race can be decided here, amid dust and punctures."},
          {title:"Le secteur du Carrefour de l'Arbre", titleEN:"The Carrefour de l'Arbre sector", desc:"L'un des derniers grands pièges pavés avant le vélodrome de Roubaix.", descEN:"One of the last great cobbled traps before the Roubaix velodrome."},
          {title:"Une tranchée pavée tristement célèbre", titleEN:"An infamous cobbled trench", desc:"Le secteur le plus redouté du calendrier, souvent décisif pour la course.", descEN:"The most feared sector on the calendar, often decisive for the race."},
          {title:"Arrivée sur un vélodrome historique", titleEN:"Finish on a historic velodrome", desc:"Un tour de piste chargé d'histoire pour conclure cette classique pavée.", descEN:"A lap of a track steeped in history to close out this cobbled classic."},
        ]}
    ]},
  {id:'amstel-gold', name:'La Classique du Limbourg', type:'classique', month:4, prestige:3, fatCost:9, days:1,flag:'🇳🇱',
    eventDefs:[
      {focus:['montagne','classiques'], choices:[
          {label:"Rester au chaud avant les côtes", labelEN:"Stay sheltered before the climbs", risk:'sur', tilt:['recuperation']},
          {label:"Se placer avant les derniers monts", labelEN:"Get into position before the last climbs", risk:'equilibre', tilt:['classiques']},
          {label:"Attaquer dans une des côtes courtes", labelEN:"Attack on one of the short climbs", risk:'audacieux', tilt:['montagne','mental']},
        ], variants:[
          {title:"L'ultime difficulté", titleEN:"The final climb", desc:"La côte la plus célèbre du Limbourg néerlandais referme traditionnellement la course.", descEN:"The most famous climb in Dutch Limburg traditionally closes out the race."},
          {title:"Une dernière côte à quelques kilomètres de la ligne", titleEN:"One last climb a few kilometres from the line", desc:"Une des nombreuses côtes courtes et raides qui hachent le final de la Classique du Limbourg.", descEN:"One of the many short, steep climbs that chop up the finale of the Limburg Classic."},
          {title:"Ascension répétée d'une côte courte et terrible", titleEN:"Repeated climbs of a short, brutal hill", desc:"Gravie plusieurs fois dans la journée, elle use les organismes un peu plus à chaque passage.", descEN:"Climbed several times during the day, it wears riders down a little more with every pass."},
          {title:"Circuit vallonné à travers le Limbourg néerlandais", titleEN:"Rolling circuit through Dutch Limburg", desc:"Un enchaînement de côtes qui ne laisse jamais vraiment de répit.", descEN:"A string of climbs that never really offers any respite."},
        ]}
    ]},
  {id:'lbl', name:'La Doyenne', type:'monument', month:4, prestige:5, fatCost:11, days:1,flag:'🇧🇪',
    eventDefs:[
      {focus:['montagne','classiques'], choices:[
          {label:"Temporiser jusqu'à la Roche-aux-Faucons", labelEN:"Bide your time until the Roche-aux-Faucons", risk:'sur', tilt:['mental']},
          {label:"Attaquer dans la Redoute", labelEN:"Attack on the Redoute", risk:'equilibre', tilt:['montagne','classiques']},
          {label:"Tenter une offensive lointaine et solitaire", labelEN:"Try a long-range solo attack", risk:'audacieux', tilt:['montagne','mental']},
        ], variants:[
          {title:"La Redoute puis la Roche-aux-Faucons", titleEN:"The Redoute then the Roche-aux-Faucons", desc:"La Doyenne, la plus vieille classique du calendrier, se décide dans les ultimes bosses ardennaises.", descEN:"The Doyenne, the oldest classic on the calendar, is decided on the final Ardennes climbs."},
          {title:"La Côte des Forges, à 6km de l'arrivée", titleEN:"The Côte des Forges, 6km from the finish", desc:"La Doyenne garde toujours une dernière bosse capable de faire des dégâts.", descEN:"The Doyenne always keeps one last climb capable of doing damage."},
          {title:"Un mur ardennais mythique", titleEN:"A legendary Ardennes wall", desc:"Une pente qui a fait basculer bien des éditions de cette classique historique.", descEN:"A gradient that has decided many editions of this historic classic."},
          {title:"Un printemps ardennais capricieux", titleEN:"Unpredictable Ardennes spring weather", desc:"Pluie, froid et vent s'invitent souvent sur la plus vieille classique du calendrier.", descEN:"Rain, cold and wind are frequent guests at the oldest classic on the calendar."},
        ]}
    ]},
  {id:'itzulia', name:'Le Tour du Pays Basque', type:'semitour', month:4, prestige:3, fatCost:7, days:6,flag:'🇪🇸',
    eventDefs:[
      {focus:['montagne','classiques'], choices:[
          {label:"Gérer l'effort sur ce tracé permanent", labelEN:"Manage your effort on this relentless route", risk:'sur', tilt:['resistance']},
          {label:"Se tester face aux favoris", labelEN:"Test yourself against the favourites", risk:'equilibre', tilt:['montagne']},
          {label:"Attaquer dans une des côtes courtes", labelEN:"Attack on one of the short climbs", risk:'audacieux', tilt:['montagne','mental']},
        ], variants:[
          {title:"Étape basque, montagnes russes", titleEN:"Basque stage, a rollercoaster ride", desc:"Le Tour du Pays basque enchaîne les côtes courtes sans jamais laisser souffler le peloton.", descEN:"The Tour of the Basque Country strings together short climbs without ever letting the peloton breathe."},
          {title:"Étape vers une ville industrielle basque", titleEN:"Stage into a Basque industrial town", desc:"Un tracé exigeant et technique, apprécié des puncheurs.", descEN:"A demanding, technical route, well liked by puncheurs."},
          {title:"Étape dans les monts basques sous la pluie", titleEN:"Stage in the Basque hills, in the rain", desc:"Un relief exigeant et une météo changeante, typiques de la région.", descEN:"Demanding terrain and unpredictable weather, typical of the region."},
          {title:"Ambiance survoltée au bord des routes basques", titleEN:"Electric atmosphere along the Basque roads", desc:"Le public local est réputé pour sa ferveur, quel que soit le classement.", descEN:"The local crowd has a reputation for its fervour, whatever the standings."},
        ]}
    ]},
  {id:'romandie', name:'Le Tour Romand', type:'semitour', month:5, prestige:2, fatCost:6, days:5,flag:'🇨🇭',
    eventDefs:[
      {focus:['montagne','resistance'], choices:[
          {label:"Gérer son effort, objectif ailleurs", labelEN:"Manage your effort, target elsewhere", risk:'sur', tilt:['recuperation']},
          {label:"Se tester face aux favoris", labelEN:"Test yourself against the favourites", risk:'equilibre', tilt:['montagne']},
          {label:"Attaquer pour la victoire d'étape", labelEN:"Attack for the stage win", risk:'audacieux', tilt:['montagne','mental']},
        ], variants:[
          {title:"Étape alpine avant le Giro", titleEN:"Alpine stage ahead of the Giro", desc:"Une répétition générale pour les grimpeurs qui visent les grands tours de l'été.", descEN:"A dress rehearsal for climbers eyeing the summer grand tours."},
          {title:"Étape des Alpes vaudoises", titleEN:"Stage in the Vaud Alps", desc:"Une répétition générale exigeante à quelques semaines du Giro.", descEN:"A demanding dress rehearsal just weeks before the Giro."},
          {title:"Étape autour d'un grand lac suisse", titleEN:"Stage around a great Swiss lake", desc:"Un tracé vallonné qui longe les rives, entre effort et panoramas.", descEN:"A rolling route along the shores, between effort and scenery."},
          {title:"Contre-la-montre final en terrain vallonné", titleEN:"Final time trial on rolling terrain", desc:"Le classement général bascule souvent lors de ce chrono de clôture.", descEN:"The general classification often flips in this closing time trial."},
        ]}
    ]},
  {id:'giro', name:"Giro dell'Impero", type:'grandtour', month:5, prestige:5, fatCost:11, days:21,flag:'🇮🇹', sampleWeeks:3,
    eventDefs:[
      {focus:['classiques','sprint'], choices:[
          {label:"Rester couvert dans le peloton", labelEN:"Stay sheltered in the peloton", risk:'sur', tilt:['recuperation']},
          {label:"Se placer pour le sprint", labelEN:"Get into position for the sprint", risk:'equilibre', tilt:['sprint']},
          {label:"Se montrer sans attendre", labelEN:"Show yourself without waiting", risk:'audacieux', tilt:['classiques','mental']},
        ], variants:[
          {title:"Étape roulante dans la plaine du Pô", titleEN:"Rolling stage across the Po plain", desc:"Un terrain plat et rapide, rêvé pour les équipes de sprinteurs.", descEN:"Flat, fast terrain — a dream for the sprinters' teams."},
          {title:"Circuit côtier nerveux", titleEN:"Nervy coastal circuit", desc:"Un tracé sous tension, où personne ne veut perdre de temps inutilement.", descEN:"A tense route where nobody wants to lose time needlessly."},
        ]},
      {focus:['montagne','resistance'], choices:[
          {label:"Gérer son effort pour la suite", labelEN:"Manage your effort for what's ahead", risk:'sur', tilt:['resistance']},
          {label:"Suivre les meilleurs grimpeurs", labelEN:"Follow the best climbers", risk:'equilibre', tilt:['montagne']},
          {label:"Attaquer dans les Dolomites", labelEN:"Attack in the Dolomites", risk:'audacieux', tilt:['montagne','mental']},
        ], variants:[
          {title:"Incursion dans les Dolomites", titleEN:"Foray into the Dolomites", desc:"Un profil qui met déjà les organismes à rude épreuve.", descEN:"A profile that already puts bodies through the wringer."},
          {title:"Étape de moyenne montagne piégeuse", titleEN:"Treacherous medium-mountain stage", desc:"Un profil qui n'impressionne pas sur le papier mais qui use les organismes.", descEN:"A profile that doesn't look like much on paper but grinds riders down."},
        ]},
      {focus:['clm'], choices:[
          {label:"Rouler à effort maîtrisé", labelEN:"Ride at a controlled effort", risk:'sur', tilt:['clm']},
          {label:"Pousser au maximum dès le départ", labelEN:"Push to the max from the start", risk:'audacieux', tilt:['clm','mental']},
        ], variants:[
          {title:"Cronometro à Rome", titleEN:"Cronometro in Rome", desc:"Un chrono qui peut faire basculer le classement général.", descEN:"A time trial that can flip the general classification."},
          {title:"Chrono en montée vers l'arrivée", titleEN:"Uphill time trial finish", desc:"Un format hybride, entre puissance pure et gestion de la pente.", descEN:"A hybrid format, between raw power and managing the gradient."},
        ]},
      {focus:['classiques','mental'], choices:[
          {label:"Rester prudent sur les chemins blancs", labelEN:"Stay cautious on the white roads", risk:'sur', tilt:['resistance']},
          {label:"Se positionner avant les secteurs de terre", labelEN:"Get into position before the gravel sectors", risk:'equilibre', tilt:['classiques']},
          {label:"Attaquer sur le gravier toscan", labelEN:"Attack on the Tuscan gravel", risk:'audacieux', tilt:['classiques','mental']},
        ], variants:[
          {title:"Étape sur les strade bianche toscanes", titleEN:"Stage over the Tuscan strade bianche", desc:"Des secteurs de gravier au cœur du Giro, une nouveauté qui a bousculé les habitudes.", descEN:"Gravel sectors at the heart of the Giro — a novelty that shook up the habits."},
          {title:"Terre battue et poussière en Toscane", titleEN:"Dust and dirt roads in Tuscany", desc:"Un profil technique qui n'épargne ni le matériel ni les organismes.", descEN:"A technical profile that spares neither equipment nor bodies."},
        ]},
      {focus:['montagne','mental'], choices:[
          {label:"Limiter la casse jusqu'au sommet", labelEN:"Limit the damage to the summit", risk:'sur', tilt:['resistance']},
          {label:"Suivre les meilleurs grimpeurs", labelEN:"Follow the best climbers", risk:'equilibre', tilt:['montagne','mental']},
          {label:"Attaquer de loin dans les Dolomites", labelEN:"Attack from afar in the Dolomites", risk:'audacieux', tilt:['montagne','mental']},
        ], variants:[
          {title:"Étape reine dolomitique, sommet à plus de 2000m", titleEN:"Dolomite queen stage, summit above 2000m", desc:"L'étape la plus haute et la plus redoutée de cette édition.", descEN:"The highest and most feared stage of this edition."},
          {title:"Triple ascension dans les Alpes italiennes", titleEN:"Triple ascent in the Italian Alps", desc:"Un enchaînement de cols qui ne laisse aucun répit aux organismes.", descEN:"A string of passes that leaves bodies no respite at all."},
        ]},
    ]},
  {id:'dauphine', name:'Le Critérium Alpin', type:'semitour', month:6, prestige:3, fatCost:7, days:8,flag:'🇫🇷',
    eventDefs:[
      {focus:['montagne','clm'], choices:[
          {label:"Économiser ses forces pour juillet", labelEN:"Save your strength for July", risk:'sur', tilt:['recuperation']},
          {label:"Se tester à fond face à la concurrence", labelEN:"Test yourself fully against the competition", risk:'equilibre', tilt:['montagne','clm']},
          {label:"Viser la victoire finale ici et maintenant", labelEN:"Go for the overall win here and now", risk:'audacieux', tilt:['montagne','mental']},
        ], variants:[
          {title:"Étape alpestre de préparation", titleEN:"Alpine preparation stage", desc:"Le dernier grand test avant le Tour de Gaule pour les prétendants au général.", descEN:"The last big test before the Tour de Gaule for the GC contenders."},
          {title:"Étape de moyenne montagne alpine", titleEN:"Alpine medium-mountain stage", desc:"Un parcours accidenté, dernier vrai test avant le Tour de Gaule.", descEN:"A hilly route, the last real test before the Tour de Gaule."},
          {title:"Étape alpine avec arrivée au sommet", titleEN:"Alpine stage with summit finish", desc:"Un vrai test en vue des grands tours d'été.", descEN:"A real test ahead of the summer grand tours."},
          {title:"Contre-la-montre vallonné", titleEN:"Rolling time trial", desc:"Un chrono technique qui départage déjà les prétendants au classement général.", descEN:"A technical time trial that already separates the GC contenders."},
        ]}
    ]},
  {id:'suisse', name:'Le Tour Helvétique', type:'semitour', month:6, prestige:3, fatCost:7, days:8,flag:'🇨🇭',
    eventDefs:[
      {focus:['montagne','classiques'], choices:[
          {label:"Rouler pour un équipier leader", labelEN:"Ride for a teammate leader", risk:'sur', tilt:['resistance']},
          {label:"Jouer sa carte perso dans le final", labelEN:"Play your own card in the finale", risk:'equilibre', tilt:['montagne']},
          {label:"Attaquer dès la première difficulté", labelEN:"Attack from the first climb", risk:'audacieux', tilt:['montagne','mental']},
        ], variants:[
          {title:"Étape de moyenne montagne helvétique", titleEN:"Swiss medium-mountain stage", desc:"Un tracé exigeant et vallonné, terrain de jeu classique avant le Tour.", descEN:"A demanding, rolling route — classic proving ground before the Tour."},
          {title:"Étape dans l'est de la Suisse", titleEN:"Stage in eastern Switzerland", desc:"Un tracé vallonné et technique, typique du Tour Helvétique.", descEN:"A rolling, technical route, typical of the Helvetic Tour."},
          {title:"Étape vallonnée dans l'est du pays", titleEN:"Rolling stage in the east of the country", desc:"Un tracé technique typique de la Suisse orientale.", descEN:"A technical route typical of eastern Switzerland."},
          {title:"Circuit final autour d'un lac suisse", titleEN:"Final circuit around a Swiss lake", desc:"Une étape roulante pour conclure ce tour préparatoire aux grands tours.", descEN:"A rolling stage to close out this warm-up race for the grand tours."},
        ]}
    ]},
  {id:'occitanie', name:"Les Boucles d'Occitanie", type:'semitour', month:6, prestige:1, fatCost:5, days:4,flag:'🇫🇷',
    eventDefs:[
      {focus:['montagne','clm'], choices:[
          {label:"Rouler pour l'équipe sans ambition perso", labelEN:"Ride for the team, no personal ambitions", risk:'sur', tilt:['resistance']},
          {label:"Jouer sa carte dans le final", labelEN:"Play your own card in the finale", risk:'equilibre', tilt:['montagne','clm']},
          {label:"Attaquer pour la victoire d'étape", labelEN:"Attack for the stage win", risk:'audacieux', tilt:['montagne','mental']},
        ], variants:[
          {title:"Étape pyrénéenne des Boucles d'Occitanie", titleEN:"Pyrenean stage of the Occitania Loops", desc:"Une mise en jambes exigeante avant les grands rendez-vous de l'été.", descEN:"A demanding leg-opener ahead of the big summer appointments."},
          {title:"Contre-la-montre du sud-ouest", titleEN:"South-west time trial", desc:"Un chrono vallonné qui sert de répétition avant le Critérium Alpin.", descEN:"A rolling time trial that serves as a dress rehearsal before the Alpine Criterium."},
          {title:"Circuit dans les gorges du sud-ouest", titleEN:"Circuit through the south-western gorges", desc:"Un tracé roulant à travers petites routes et paysages escarpés.", descEN:"A rolling route through narrow roads and rugged scenery."},
          {title:"Étape balayée par le vent du sud", titleEN:"Stage swept by the southern wind", desc:"Le mistral complique sérieusement la gestion de l'échappée du jour.", descEN:"The mistral wind seriously complicates managing the day's breakaway."},
        ]}
    ]},
  {id:'champnat', name:'Championnat national', type:'champ', month:6, prestige:3, fatCost:6, days:1,flag:'',
    eventDefs:[
      {focus:['mental','classiques'], choices:[
          {label:"Rouler pour le leader désigné de la sélection", labelEN:"Ride for the squad's designated leader", risk:'sur', tilt:['mental']},
          {label:"Jouer sa carte dans le final", labelEN:"Play your own card in the finale", risk:'equilibre', tilt:['classiques','mental']},
          {label:"Partir en solitaire pour le maillot nat.", labelEN:"Go solo for the national jersey", risk:'audacieux', tilt:['mental','resistance']},
        ], variants:[
          {title:"Course en ligne pour le maillot national", titleEN:"Road race for the national jersey", desc:"Une journée à part : porter les couleurs de son pays pendant un an, ou rouler pour un compatriote.", descEN:"A day like no other: wearing your country's colours for a year, or riding for a compatriot."},
          {title:"Circuit local disputé sous la pluie", titleEN:"Local circuit raced in the rain", desc:"Le titre national se joue parfois autant sur la météo que sur les jambes.", descEN:"The national title sometimes comes down to the weather as much as the legs."},
          {title:"Circuit vallonné devant le public local", titleEN:"Rolling circuit in front of the home crowd", desc:"Toute la famille et les amis d'enfance sont là — une pression particulière, bien à part des grandes classiques internationales.", descEN:"Family and childhood friends are all watching — a particular kind of pressure, quite unlike the big international classics."},
          {title:"Un final nerveux entre quelques prétendants au titre", titleEN:"A nervy finale among a handful of title contenders", desc:"Peu de dossards, mais une ambiance électrique : chacun sait que ce maillot se joue une fois par an, pas plus.", descEN:"Few riders on the start line, but an electric atmosphere — everyone knows this jersey is decided once a year, no more."},
        ]}
    ]},
  {id:'tdf', name:'Tour de Gaule', type:'grandtour', month:7, prestige:5, fatCost:12, days:21,flag:'🇫🇷', sampleWeeks:3,
    eventDefs:[
      {focus:['classiques','mental'], choices:[
          {label:"Rester bien placé sans prendre de risque", labelEN:"Stay well placed without taking risks", risk:'sur', tilt:['recuperation']},
          {label:"Se disputer le sprint", labelEN:"Contest the sprint", risk:'equilibre', tilt:['classiques']},
          {label:"Provoquer les bordures dans le vent", labelEN:"Force echelons in the crosswind", risk:'audacieux', tilt:['classiques','mental']},
        ], variants:[
          {title:"Étape de plaine et sprint massif", titleEN:"Flat stage and bunch sprint", desc:"Une étape roulante, propice aux favoris des sprints.", descEN:"A rolling stage, well suited to the sprint favourites."},
          {title:"Bordures dans le vent de l'Atlantique", titleEN:"Echelons in the Atlantic wind", desc:"Le peloton explose en éventails, et être devant n'est pas une option.", descEN:"The peloton splits into echelons — being at the front isn't optional."},
        ]},
      {focus:['montagne','resistance'], choices:[
          {label:"Gérer son effort pour la suite", labelEN:"Manage your effort for what's ahead", risk:'sur', tilt:['resistance']},
          {label:"Suivre le rythme dans les cols", labelEN:"Follow the pace in the climbs", risk:'equilibre', tilt:['montagne']},
          {label:"Attaquer dans le Massif Central", labelEN:"Attack in the Massif Central", risk:'audacieux', tilt:['montagne','mental']},
        ], variants:[
          {title:"Étape marathon à travers le Massif Central", titleEN:"Marathon stage across the Massif Central", desc:"Une distance interminable qui teste autant le mental que les jambes.", descEN:"An endless distance that tests the mind as much as the legs."},
          {title:"Étape pyrénéenne", titleEN:"Pyrenean stage", desc:"Les premiers cols pyrénéens donnent le ton pour le reste du séjour en montagne.", descEN:"The first Pyrenean climbs set the tone for the rest of the mountain stay."},
        ]},
      {focus:['montagne','mental'], choices:[
          {label:"Rouler prudemment, limiter les pertes", labelEN:"Ride cautiously, limit the losses", risk:'sur', tilt:['resistance']},
          {label:"Suivre les meilleurs jusqu'au bout", labelEN:"Follow the best riders to the end", risk:'equilibre', tilt:['montagne','mental']},
          {label:"Attaquer de loin pour marquer l'histoire", labelEN:"Attack from afar to make history", risk:'audacieux', tilt:['montagne','mental']},
        ], variants:[
          {title:"Étape reine, haute montagne alpestre", titleEN:"Queen stage, high Alpine mountains", desc:"Une étape qui peut faire basculer tout le classement général.", descEN:"A stage that can flip the entire general classification."},
          {title:"Triple ascension pyrénéenne", titleEN:"Triple Pyrenean ascent", desc:"Plusieurs cols enchaînés dans la même journée, sans un mètre de répit.", descEN:"Several passes strung together in the same day, without a metre of respite."},
        ]},
      {focus:['clm'], choices:[
          {label:"Rouler à un effort maîtrisé", labelEN:"Ride at a controlled effort", risk:'sur', tilt:['clm']},
          {label:"Tout donner dès le premier kilomètre", labelEN:"Give everything from the first kilometre", risk:'audacieux', tilt:['clm','mental']},
        ], variants:[
          {title:"Contre-la-montre individuel décisif", titleEN:"Decisive individual time trial", desc:"Un exercice solitaire qui peut faire basculer tout le classement général.", descEN:"A solitary effort that can flip the entire general classification."},
          {title:"Chrono vallonné", titleEN:"Rolling time trial", desc:"Un format technique qui récompense les rouleurs les plus complets.", descEN:"A technical format that rewards the most complete all-rounders."},
        ]},
      {focus:['classiques','resistance'], choices:[
          {label:"Rester couvert sur les pavés", labelEN:"Stay sheltered on the cobbles", risk:'sur', tilt:['resistance']},
          {label:"Se positionner avant les secteurs pavés", labelEN:"Get into position before the cobbled sectors", risk:'equilibre', tilt:['classiques']},
          {label:"Attaquer sur le pavé du Nord", labelEN:"Attack on the northern cobbles", risk:'audacieux', tilt:['classiques','mental']},
        ], variants:[
          {title:"Étape pavée empruntant des secteurs mythiques du Nord", titleEN:"Cobbled stage over legendary northern sectors", desc:"Une incursion sur des pavés qui n'ont rien à envier aux classiques du printemps.", descEN:"A foray onto cobbles that rival the spring classics themselves."},
          {title:"Étape nerveuse sur petites routes du Nord", titleEN:"Nervy stage on narrow northern roads", desc:"Un terrain piégeux qui peut coûter très cher aux favoris du classement général.", descEN:"Treacherous terrain that can cost the GC favourites dearly."},
        ]},
    ]},
  {id:'crit1', name:"Critérium de Saint-Léonard", type:'crit', month:8, prestige:1, fatCost:2, days:1,flag:'🇫🇷',
    eventDefs:[
      {focus:['mental'], choices:[
          {label:"Faire le show pour le public", labelEN:"Put on a show for the crowd", risk:'equilibre', tilt:['mental']},
          {label:"Lever le pied, la saison a été longue", labelEN:"Ease off, it's been a long season", risk:'sur', tilt:['recuperation']},
        ], variants:[
          {title:"Critérium d'après-Tour", titleEN:"Post-Tour criterium", desc:"Ambiance de fête foraine, animations et public venu voir les héros du Tour sur circuit fermé.", descEN:"A fairground atmosphere, entertainment, and crowds who came to see the Tour's heroes on a closed circuit."},
          {title:"Critérium sous une chaleur écrasante", titleEN:"Criterium under crushing heat", desc:"Le public est venu nombreux malgré la canicule pour voir les héros du Tour.", descEN:"A big crowd turned out despite the heatwave to see the Tour's heroes."},
          {title:"Circuit urbain sous les lumières du soir", titleEN:"Urban circuit under the evening lights", desc:"Une ambiance de fête, entre exhibition et vraie compétition.", descEN:"A festive atmosphere, somewhere between exhibition and real competition."},
          {title:"Critérium disputé devant un public nombreux", titleEN:"Criterium raced in front of a big crowd", desc:"Les gains sont modestes mais l'ambiance est unique sur ce format court.", descEN:"The prize money is modest but the atmosphere is unique on this short format."},
        ]}
    ]},
  {id:'crit2', name:"Critérium de Châteaulin", type:'crit', month:8, prestige:1, fatCost:2, days:1,flag:'🇫🇷',
    eventDefs:[
      {focus:['mental'], choices:[
          {label:"Animer la course pour les organisateurs", labelEN:"Liven up the race for the organisers", risk:'equilibre', tilt:['mental']},
          {label:"Rouler tranquille et saluer le public", labelEN:"Ride easy and wave to the crowd", risk:'sur', tilt:['recuperation']},
        ], variants:[
          {title:"Circuit breton, ferveur populaire", titleEN:"Breton circuit, popular fervour", desc:"Un des plus anciens critériums du calendrier, entre copains et sponsors.", descEN:"One of the oldest criteriums on the calendar, among friends and sponsors."},
          {title:"Circuit breton sous la pluie", titleEN:"Breton circuit in the rain", desc:"La ferveur populaire ne faiblit pas, même sous une pluie battante.", descEN:"The crowd's enthusiasm doesn't fade, even under pouring rain."},
          {title:"Circuit sous une petite bruine", titleEN:"Circuit in a light drizzle", desc:"Un classique de fin de saison, apprécié des coureurs locaux.", descEN:"An end-of-season classic, well liked by the local riders."},
          {title:"Ambiance conviviale en clôture de saison", titleEN:"A friendly atmosphere to close out the season", desc:"Un rendez-vous apprécié pour tourner la page avant la trêve hivernale.", descEN:"A popular date to turn the page before the winter break."},
        ]}
    ]},
  {id:'crit-metz', name:'Critérium de Metz', type:'crit', month:8, prestige:1, fatCost:2, days:1,flag:'🇫🇷',
    eventDefs:[
      {focus:['mental'], choices:[
          {label:"Se donner en spectacle pour le public local", labelEN:"Put on a show for the local crowd", risk:'equilibre', tilt:['mental']},
          {label:"Gérer sa fin de saison tranquillement", labelEN:"Manage the end of your season quietly", risk:'sur', tilt:['recuperation']},
        ], variants:[
          {title:"Critérium urbain de fin de saison", titleEN:"End-of-season urban criterium", desc:"Les rues du centre-ville sont bouclées pour un show apprécié du public local.", descEN:"The city-centre streets are closed off for a show well liked by the local crowd."},
          {title:"Critérium nocturne sous les projecteurs", titleEN:"Night criterium under the floodlights", desc:"Une ambiance électrique pour clôturer une longue saison de course.", descEN:"An electric atmosphere to close out a long season of racing."},
          {title:"Circuit en centre-ville", titleEN:"City-centre circuit", desc:"Un format court et rythmé, loin de la tension des grandes classiques.", descEN:"A short, fast-paced format, far from the tension of the big classics."},
          {title:"Critérium disputé sous les projecteurs", titleEN:"Criterium raced under the floodlights", desc:"Une parenthèse festive avant la fin de saison.", descEN:"A festive interlude before the end of the season."},
        ]}
    ]},
  {id:'pologne', name:'Le Tour des Carpates', type:'semitour', month:8, prestige:2, fatCost:6, days:7,flag:'🇵🇱',
    eventDefs:[
      {focus:['classiques','resistance'], choices:[
          {label:"Rouler pour l'équipe", labelEN:"Ride for the team", risk:'sur', tilt:['resistance']},
          {label:"Tenter sa chance en échappée", labelEN:"Try your luck in a breakaway", risk:'equilibre', tilt:['classiques','mental']},
          {label:"Attaquer seul dès le premier col", labelEN:"Attack solo from the first climb", risk:'audacieux', tilt:['montagne','mental']},
        ], variants:[
          {title:"Étape des Carpates", titleEN:"Carpathian stage", desc:"Un tour d'une semaine disputé et méconnu, terrain de chasse pour les baroudeurs.", descEN:"A hard-fought, little-known week-long tour — hunting ground for breakaway specialists."},
          {title:"Étape des collines d'Europe centrale", titleEN:"Central European hills stage", desc:"Un tour méconnu mais exigeant, souvent utilisé pour préparer la Vuelta.", descEN:"A little-known but demanding tour, often used to prepare for the Vuelta."},
          {title:"Étape vallonnée en Europe centrale", titleEN:"Rolling stage in Central Europe", desc:"Un tracé exigeant, encore méconnu d'une partie du peloton.", descEN:"A demanding route, still unfamiliar to part of the peloton."},
          {title:"Circuit final dans une grande ville historique", titleEN:"Final circuit in a great historic city", desc:"Une étape urbaine et nerveuse pour conclure ce tour d'Europe centrale.", descEN:"An urban, nervy stage to close out this Central European tour."},
        ]}
    ]},
  {id:'limousin', name:'Les Boucles Limousines', type:'semitour', month:8, prestige:1, fatCost:5, days:4,flag:'🇫🇷',
    eventDefs:[
      {focus:['montagne','resistance'], choices:[
          {label:"Rouler pour l'équipe sans ambition perso", labelEN:"Ride for the team, no personal ambitions", risk:'sur', tilt:['resistance']},
          {label:"Jouer sa carte dans le final", labelEN:"Play your own card in the finale", risk:'equilibre', tilt:['montagne']},
          {label:"Tenter le tout pour le tout en échappée", labelEN:"Go all-in on a breakaway", risk:'audacieux', tilt:['montagne','mental']},
        ], variants:[
          {title:"Étape vallonnée du Limousin", titleEN:"Rolling Limousin stage", desc:"Une course discrète mais formatrice, loin des projecteurs des grandes classiques.", descEN:"A low-key but formative race, far from the spotlight of the big classics."},
          {title:"Étape des monts du Limousin", titleEN:"Stage in the Limousin hills", desc:"Un tracé accidenté qui sert souvent de test grandeur nature pour les jeunes coureurs.", descEN:"A hilly route that often serves as a real-world test for young riders."},
          {title:"Étape vallonnée sur les plateaux du centre de la France", titleEN:"Rolling stage on the plateaus of central France", desc:"Un terrain roulant mais jamais plat.", descEN:"Rolling terrain that's never quite flat."},
          {title:"Circuit autour d'un lac", titleEN:"Circuit around a lake", desc:"Une étape agréable mais piégeuse, entre bosses courtes et faux-plats.", descEN:"A pleasant but tricky stage, between short climbs and false flats."},
        ]}
    ]},
  {id:'san-sebastian', name:'La Classique Basque', type:'classique', month:8, prestige:3, fatCost:9, days:1,flag:'🇪🇸',
    eventDefs:[
      {focus:['montagne','classiques'], choices:[
          {label:"Rester prudent avant la dernière ascension", labelEN:"Stay cautious before the final climb", risk:'sur', tilt:['resistance']},
          {label:"Se placer en tête avant la dernière ascension", labelEN:"Get to the front before the final climb", risk:'equilibre', tilt:['classiques']},
          {label:"Attaquer dans la dernière ascension côtière", labelEN:"Attack on the final coastal climb", risk:'audacieux', tilt:['montagne','mental']},
        ], variants:[
          {title:"La montée côtière décisive", titleEN:"The decisive coastal climb", desc:"La classique basque grimpe au-dessus de l'océan avant de redescendre vers San Sebastián.", descEN:"The Basque classic climbs high above the ocean before descending back towards San Sebastián."},
          {title:"Un dernier mur à quelques kilomètres de l'arrivée", titleEN:"One last wall a few kilometres from the finish", desc:"Un dernier mur raide qui a souvent fait basculer la course tout près du but.", descEN:"A final steep wall that has often decided the race right near the finish."},
          {title:"Ascension mythique avant l'arrivée", titleEN:"Legendary climb before the finish", desc:"Une côte qui décide traditionnellement de cette classique basque.", descEN:"A climb that traditionally decides this Basque classic."},
          {title:"Un final sous une pluie fine, typique de la région", titleEN:"A finale in typical light regional rain", desc:"Le public reste malgré tout massé en nombre au bord des routes.", descEN:"The crowds still line the roads in great numbers regardless."},
        ]}
    ]},
  {id:'bretagne-classic', name:'La Bretonne', type:'classique', month:8, prestige:2, fatCost:8, days:1,flag:'🇫🇷',
    eventDefs:[
      {focus:['sprint','classiques'], choices:[
          {label:"Rester au chaud avant le mur breton", labelEN:"Stay sheltered before the Breton wall", risk:'sur', tilt:['recuperation']},
          {label:"Se placer pour le sprint après le mur", labelEN:"Get into position for the sprint after the wall", risk:'equilibre', tilt:['sprint']},
          {label:"Attaquer dans le mur breton pour distancer les sprinteurs", labelEN:"Attack on the Breton wall to drop the sprinters", risk:'audacieux', tilt:['classiques','mental']},
        ], variants:[
          {title:"Le mur breton, dernier filtre avant le sprint", titleEN:"The Breton wall, final filter before the sprint", desc:"Le mur écréme le peloton — puis les rescapés s'affrontent dans un sprint côtier sous le vent atlantique.", descEN:"The wall thins out the peloton — then the survivors clash in a coastal sprint in the Atlantic wind."},
          {title:"Circuit côtier, sprint massif au bout", titleEN:"Coastal circuit, bunch sprint at the end", desc:"Un final plat le long de la côte qui tourne au sprint, malgré le vent de face.", descEN:"A flat finale along the coast that turns into a sprint, despite the headwind."},
          {title:"Vent atlantique et sprint final", titleEN:"Atlantic wind and final sprint", desc:"Le peloton est resté groupé malgré les rafales — c'est au sprint que tout se joue.", descEN:"The peloton stayed together despite the gusts — it all comes down to the sprint."},
          {title:"Étape balayée par le vent atlantique", titleEN:"Stage swept by the Atlantic wind", desc:"Le vent breton peut faire exploser le peloton, mais souvent les sprinteurs survivent et s'imposent.", descEN:"The Breton wind can shatter the peloton, but often the sprinters survive and take the win."},
        ]}
    ]},
  {id:'vuelta', name:'Vuelta a Iberia', type:'grandtour', month:9, prestige:5, fatCost:12, days:21,flag:'🇪🇸', sampleWeeks:3,
    eventDefs:[
      {focus:['resistance','mental'], choices:[
          {label:"Gérer la chaleur sans se découvrir", labelEN:"Manage the heat without overexposing yourself", risk:'sur', tilt:['recuperation']},
          {label:"Rester dans le groupe de tête", labelEN:"Stay in the lead group", risk:'equilibre', tilt:['resistance']},
          {label:"Tenter un coup", labelEN:"Go for a move", risk:'audacieux', tilt:['mental','resistance']},
        ], variants:[
          {title:"Étape castillane sous une chaleur de plomb", titleEN:"Castilian stage under blazing heat", desc:"Les plateaux espagnols en fin d'été sont réputés impitoyables.", descEN:"The Spanish plateaus in late summer have a fearsome reputation."},
          {title:"Circuit côtier méditerranéen", titleEN:"Mediterranean coastal circuit", desc:"Un tracé roulant en bord de mer, propice à un groupe qui reste uni.", descEN:"A rolling seaside route, well suited to a group staying together."},
        ]},
      {focus:['montagne','mental'], choices:[
          {label:"Gérer son effort sur les rampes", labelEN:"Manage your effort on the ramps", risk:'sur', tilt:['resistance']},
          {label:"Suivre les meilleurs jusqu'au sommet", labelEN:"Follow the best riders to the summit", risk:'equilibre', tilt:['montagne','mental']},
          {label:"Attaquer sur le mur andalou", labelEN:"Attack on the Andalusian wall", risk:'audacieux', tilt:['montagne','mental']},
        ], variants:[
          {title:"Étape andalouse, rampes à plus de 20%", titleEN:"Andalusian stage, ramps above 20%", desc:"Des pourcentages extrêmes typiques de la Vuelta, qui trient sévèrement le classement.", descEN:"Extreme gradients typical of the Vuelta, which sort the standings ruthlessly."},
          {title:"Arrivée inédite au sommet d'une station de ski", titleEN:"New summit finish at a ski resort", desc:"Une nouveauté du parcours qui promet une sélection sévère.", descEN:"A new addition to the route that promises a brutal selection."},
        ]},
      {focus:['montagne','mental'], choices:[
          {label:"Limiter la casse jusqu'à la ligne", labelEN:"Limit the damage to the line", risk:'sur', tilt:['resistance']},
          {label:"Suivre les meilleurs jusqu'au sommet", labelEN:"Follow the best riders to the summit", risk:'equilibre', tilt:['montagne','mental']},
          {label:"Tout donner sur le mur final", labelEN:"Give everything on the final wall", risk:'audacieux', tilt:['montagne','mental']},
        ], variants:[
          {title:"Étape asturienne, Alto de l'Angliru", titleEN:"Asturian stage, Alto de l'Angliru", desc:"L'une des ascensions les plus dures du cyclisme mondial, souvent décisive pour le classement général.", descEN:"One of the toughest climbs in world cycling, often decisive for the general classification."},
          {title:"Étape de haute montagne", titleEN:"High mountain stage", desc:"Une occasion supplémentaire de renverser le classement général.", descEN:"One more chance to overturn the general classification."},
        ]},
      {focus:['clm'], choices:[
          {label:"Rouler à effort constant", labelEN:"Ride at a steady effort", risk:'sur', tilt:['clm']},
          {label:"Attaquer dès les premiers hectomètres", labelEN:"Attack from the very first metres", risk:'audacieux', tilt:['clm','mental']},
        ], variants:[
          {title:"Contre-la-montre individuel dans la chaleur", titleEN:"Individual time trial in the heat", desc:"Un exercice solitaire qui peut faire basculer le classement général.", descEN:"A solitary effort that can flip the general classification."},
          {title:"Chrono vallonné en Cantabrie", titleEN:"Rolling time trial in Cantabria", desc:"Un tracé technique qui récompense les rouleurs les plus complets.", descEN:"A technical route that rewards the most complete all-rounders."},
        ]},
      {focus:['montagne','resistance'], choices:[
          {label:"Gérer l'enchaînement des cols courts", labelEN:"Manage the string of short climbs", risk:'sur', tilt:['resistance']},
          {label:"Suivre le rythme dans le Pays Basque", labelEN:"Follow the pace in the Basque Country", risk:'equilibre', tilt:['montagne']},
          {label:"Attaquer sur les pentes basques", labelEN:"Attack on the Basque slopes", risk:'audacieux', tilt:['montagne','mental']},
        ], variants:[
          {title:"Étape basque, cols courts et répétés", titleEN:"Basque stage, short repeated climbs", desc:"Un profil haché qui n'offre jamais vraiment de répit, typique du Pays Basque.", descEN:"A choppy profile that never really offers respite, typical of the Basque Country."},
          {title:"Étape cantabrique sous la pluie", titleEN:"Cantabrian stage in the rain", desc:"Un terrain vallonné rendu plus périlleux encore par une météo capricieuse.", descEN:"Rolling terrain made even more perilous by unpredictable weather."},
        ]},
    ]},
  {id:'mondiaux', name:'Championnats du monde', type:'champ', month:9, prestige:4, fatCost:8, days:1,flag:'🌍',
    eventDefs:[
      {focus:['mental','classiques'], choices:[
          {label:"Se mettre entièrement au service du leader", labelEN:"Ride entirely in service of the leader", risk:'sur', tilt:['mental']},
          {label:"Rester dans le groupe de tête au cas où", labelEN:"Stay in the lead group just in case", risk:'equilibre', tilt:['classiques','mental']},
          {label:"Tenter une offensive personnelle", labelEN:"Try your own attack", risk:'audacieux', tilt:['mental','resistance']},
        ], variants:[
          {title:"Course en ligne, maillot arc-en-ciel en jeu", titleEN:"Road race, the rainbow jersey on the line", desc:"Une sélection nationale, un seul maillot arc-en-ciel à la clé. Jouer collectif ou tenter sa chance ?", descEN:"A national team, one rainbow jersey up for grabs. Ride as a team, or take your chance?"},
          {title:"Course en ligne sur un circuit vallonné", titleEN:"Road race on a rolling circuit", desc:"Un tracé exigeant qui favorise les puncheurs autant que les rouleurs.", descEN:"A demanding route that favours puncheurs as much as rouleurs."},
          {title:"Circuit technique et sélectif dans la ville hôte", titleEN:"Technical, selective circuit in the host city", desc:"Le titre de champion du monde se joue sur un tracé pensé pour être exigeant.", descEN:"The world champion's title is decided on a route designed to be gruelling."},
          {title:"Une course sous très haute tension collective", titleEN:"A race under intense collective tension", desc:"Chaque nation joue midi à sa porte, les alliances de circonstance se font et se défont.", descEN:"Every nation looks out for itself, and circumstantial alliances form and break apart."},
        ]}
    ]},
  {id:'lombardia', name:'La Classique des Feuilles Mortes', type:'monument', month:10, prestige:4, fatCost:10, days:1,flag:'🇮🇹',
    eventDefs:[
      {focus:['montagne','classiques'], choices:[
          {label:"Suivre le rythme sans se découvrir", labelEN:"Follow the pace without overexposing yourself", risk:'sur', tilt:['resistance']},
          {label:"Attaquer dans le Mur de Sormano", labelEN:"Attack on the Muro di Sormano", risk:'equilibre', tilt:['montagne','classiques']},
          {label:"Partir seul à plus de 40km de l'arrivée", labelEN:"Go solo more than 40km from the finish", risk:'audacieux', tilt:['montagne','mental']},
        ], variants:[
          {title:"La Muraille de Sormano", titleEN:"The Sormano wall", desc:"La Classique des feuilles mortes referme la saison sur les pentes les plus dures du calendrier.", descEN:"The Race of the Falling Leaves closes out the season on the steepest slopes of the calendar."},
          {title:"Montée vers Civiglio, à quelques kilomètres de la ligne", titleEN:"The climb to Civiglio, a few kilometres from the line", desc:"La Classique des feuilles mortes garde toujours un piège dans le final.", descEN:"The Race of the Falling Leaves always keeps a trap for the finale."},
          {title:"Une pente extrême entrée dans l'histoire", titleEN:"An extreme slope that made history", desc:"Un mur qui a marqué durablement cette classique d'automne.", descEN:"A wall that has left its mark on this autumn classic."},
          {title:"Un parcours autour d'un lac italien", titleEN:"A route around an Italian lake", desc:"Des paysages spectaculaires pour clore la saison des classiques.", descEN:"Spectacular scenery to close out the classics season."},
        ]}
    ]},
  {id:'algarve', name:"Le Tour de l'Algarve", type:'semitour', month:2, prestige:2, fatCost:6, days:5, flag:'🇵🇹',
    eventDefs:[
      {focus:['montagne','resistance'], choices:[
          {label:"Gérer son effort en début de saison", labelEN:"Manage your effort early in the season", risk:'sur', tilt:['recuperation']},
          {label:"Se tester face aux favoris", labelEN:"Test yourself against the favourites", risk:'equilibre', tilt:['montagne']},
          {label:"Attaquer pour la victoire d'étape", labelEN:"Attack for the stage win", risk:'audacieux', tilt:['montagne','mental']},
        ], variants:[
          {title:"Étape des falaises de l'Algarve", titleEN:"Stage along the Algarve cliffs", desc:"Un décor spectaculaire pour une des premières échéances sérieuses de la saison.", descEN:"A spectacular backdrop for one of the first serious tests of the season."},
          {title:"Étape à l'ascension finale", titleEN:"Stage with a summit finish", desc:"Une arrivée en côte qui donne un premier vrai indicateur de forme hivernale.", descEN:"An uphill finish that gives a first real read on winter form."},
          {title:"Étape vallonnée dans l'arrière-pays", titleEN:"Rolling stage in the hinterland", desc:"Un terrain roulant et ensoleillé, apprécié en préparation de début de saison.", descEN:"Rolling, sun-drenched terrain, well liked as early-season preparation."},
          {title:"Circuit final près de la côte atlantique", titleEN:"Final circuit near the Atlantic coast", desc:"Une étape agréable qui clôt ce tour tout en douceur relative.", descEN:"A pleasant stage that closes out this tour on a relatively gentle note."},
        ]}
    ]},
  {id:'almeria', name:'La Classique Andalouse', type:'classique', month:2, prestige:1, fatCost:8, days:1, flag:'🇪🇸',
    eventDefs:[
      {focus:['sprint','classiques'], choices:[
          {label:"Attendre le sprint massif", labelEN:"Wait for the bunch sprint", risk:'sur', tilt:['sprint']},
          {label:"Se placer dans les dernières bosses", labelEN:"Get into position on the final climbs", risk:'equilibre', tilt:['classiques']},
          {label:"Tenter une échappée sous le soleil andalou", labelEN:"Try a breakaway under the Andalusian sun", risk:'audacieux', tilt:['classiques','mental']},
        ], variants:[
          {title:"Circuit andalou sous le soleil d'hiver", titleEN:"Andalusian circuit under the winter sun", desc:"Une des premières classiques de la saison, souvent disputée au sprint.", descEN:"One of the first classics of the season, often decided in a sprint."},
          {title:"Sprint final andalou", titleEN:"Andalusian sprint finish", desc:"Un final rapide et roulant qui met en jambes les sprinteurs pour la saison.", descEN:"A fast, rolling finale that gets the sprinters' legs going for the season."},
          {title:"Circuit andalou sous un ciel dégagé", titleEN:"Andalusian circuit under clear skies", desc:"Un parcours roulant qui aboutit traditionnellement à un sprint massif.", descEN:"A rolling route that traditionally ends in a bunch sprint."},
          {title:"Un vent de travers complique le final", titleEN:"A crosswind complicates the finale", desc:"Les équipes de sprinteurs doivent rester vigilantes jusqu'au bout.", descEN:"The sprinters' teams have to stay alert right to the end."},
        ]}
    ]},
  {id:'dwars', name:'À Travers la Flandre', type:'classique', month:3, prestige:2, fatCost:8, days:1, flag:'🇧🇪',
    eventDefs:[
      {focus:['classiques','mental'], choices:[
          {label:"Rester couvert avant les monts", labelEN:"Stay sheltered before the climbs", risk:'sur', tilt:['recuperation']},
          {label:"Se positionner avant le mont pavé", labelEN:"Get into position before the cobbled climb", risk:'equilibre', tilt:['classiques']},
          {label:"Attaquer sur les pavés flandriens", labelEN:"Attack on the Flemish cobbles", risk:'audacieux', tilt:['classiques','mental']},
        ], variants:[
          {title:"Un mont pavé, avant-goût de la Ronde du Plat Pays", titleEN:"A cobbled climb, a preview of the Ronde", desc:"Une répétition générale sur les pavés qui feront la légende trois semaines plus tard.", descEN:"A dress rehearsal on the cobbles that will make legend three weeks later."},
          {title:"Un final nerveux à travers la Flandre", titleEN:"A nervy finale across Flanders", desc:"Un circuit accidenté qui trie déjà les favoris pour les classiques d'avril.", descEN:"A hilly circuit that already sorts out the favourites for the April classics."},
          {title:"Passage par un mont emblématique en fin de parcours", titleEN:"Over an iconic climb near the end of the route", desc:"Un aperçu des monts qui feront la légende du printemps flandrien quelques jours plus tard.", descEN:"A preview of the climbs that will make Flemish spring legend a few days later."},
          {title:"Un circuit flandrien disputé sous le vent", titleEN:"A Flemish circuit raced in the wind", desc:"Les bordures se forment vite sur ces routes exposées.", descEN:"Echelons form quickly on these exposed roads."},
        ]}
    ]},
  {id:'brabant', name:'La Flèche du Brabant', type:'classique', month:4, prestige:1, fatCost:8, days:1, flag:'🇧🇪',
    eventDefs:[
      {focus:['classiques','montagne'], choices:[
          {label:"Gérer sa position dans le peloton", labelEN:"Manage your position in the peloton", risk:'sur', tilt:['resistance']},
          {label:"Se placer avant le dernier raidillon pavé", labelEN:"Get into position before the last cobbled ramp", risk:'equilibre', tilt:['classiques']},
          {label:"Attaquer dans le dernier raidillon", labelEN:"Attack on the last steep ramp", risk:'audacieux', tilt:['classiques','mental']},
        ], variants:[
          {title:"Le dernier piège pavé avant l'arrivée", titleEN:"The last cobbled trap before the finish", desc:"Une petite classique nerveuse et vallonnée dans le Brabant flamand.", descEN:"A small, nervy, rolling classic in Flemish Brabant."},
          {title:"Un circuit vallonné dans le Brabant flamand", titleEN:"A rolling circuit in Flemish Brabant", desc:"Un terrain qui favorise les puncheurs en pleine forme printanière.", descEN:"Terrain that favours puncheurs in full spring form."},
          {title:"Enchaînement de courtes côtes flamandes", titleEN:"A string of short Flemish climbs", desc:"Un tracé nerveux qui favorise les puncheurs explosifs.", descEN:"A nervy route that favours explosive puncheurs."},
          {title:"Un final disputé sous une petite pluie", titleEN:"A finale raced in light rain", desc:"Les pavés humides ajoutent un piège supplémentaire à ce parcours accidenté.", descEN:"Wet cobbles add an extra trap to this hilly route."},
        ]}
    ]},
  {id:'alps-tour', name:'Le Tour Alpin', type:'semitour', month:4, prestige:2, fatCost:6, days:5, flag:'🇦🇹',
    eventDefs:[
      {focus:['montagne','resistance'], choices:[
          {label:"Économiser ses forces avant le Giro", labelEN:"Save your strength before the Giro", risk:'sur', tilt:['recuperation']},
          {label:"Jauger la concurrence avant les échéances estivales", labelEN:"Size up the competition ahead of the summer goals", risk:'equilibre', tilt:['montagne']},
          {label:"Attaquer pour marquer les esprits", labelEN:"Attack to make a statement", risk:'audacieux', tilt:['montagne','mental']},
        ], variants:[
          {title:"Étape d'ouverture dans les contreforts alpins", titleEN:"Opening stage in the Alpine foothills", desc:"Une mise en jambes copieuse, bien avant les grands rendez-vous de l'été.", descEN:"A hefty leg-opener, well ahead of the big summer appointments."},
          {title:"Étape de préparation en terrain alpin", titleEN:"Preparation stage in Alpine terrain", desc:"Un tracé exigeant dans les Alpes autrichiennes et italiennes.", descEN:"A demanding route through the Austrian and Italian Alps."},
          {title:"Étape alpine avec plusieurs cols enchaînés", titleEN:"Alpine stage with several passes back to back", desc:"Une succession de cols qui n'accorde aucun round de récupération avant la ligne.", descEN:"A string of passes that grants no recovery round before the finish."},
          {title:"Circuit autour d'un lac alpin", titleEN:"Circuit around an Alpine lake", desc:"Un décor spectaculaire pour une étape au profil pourtant redoutable.", descEN:"Spectacular scenery for a stage with a nonetheless fearsome profile."},
        ]}
    ]},
  {id:'belgium-tour', name:'Le Tour de Belgique', type:'semitour', month:6, prestige:2, fatCost:6, days:5, flag:'🇧🇪',
    eventDefs:[
      {focus:['classiques','sprint'], choices:[
          {label:"Rouler pour l'équipe", labelEN:"Ride for the team", risk:'sur', tilt:['resistance']},
          {label:"Se placer dans le final flandrien", labelEN:"Get into position for the Flemish finale", risk:'equilibre', tilt:['classiques']},
          {label:"Tenter sa chance en costaud", labelEN:"Try your luck as a strongman", risk:'audacieux', tilt:['classiques','mental']},
        ], variants:[
          {title:"Étape flandrienne typique", titleEN:"A typical Flemish stage", desc:"Vent, pavés et bordures : un condensé du cyclisme belge en une semaine.", descEN:"Wind, cobbles and echelons: a condensed dose of Belgian cycling in one week."},
          {title:"Étape à plat vers la mer du Nord", titleEN:"Flat stage towards the North Sea coast", desc:"Un parcours filant tout droit vers la côte, où les équipes de sprinteurs contrôlent la course.", descEN:"A route heading straight for the coast, controlled by the sprinters' teams."},
          {title:"Étape pavée typique du plat pays", titleEN:"A cobbled stage typical of the lowlands", desc:"Un aperçu du folklore flandrien, même en dehors des grandes classiques.", descEN:"A taste of Flemish folklore, even outside the big classics."},
          {title:"Étape roulante entre deux villes flamandes", titleEN:"A rolling stage between two Flemish towns", desc:"Un final nerveux où le peloton se replace sans cesse avant l'arrivée.", descEN:"A nervy finale where the peloton keeps reshuffling before the finish."},
        ]}
    ]},
  {id:'burgos', name:'La Vuelta Castillane', type:'semitour', month:8, prestige:2, fatCost:6, days:5, flag:'🇪🇸',
    eventDefs:[
      {focus:['montagne','resistance'], choices:[
          {label:"Gérer l'effort avant la Vuelta", labelEN:"Manage your effort ahead of the Vuelta", risk:'sur', tilt:['recuperation']},
          {label:"Se tester face à la concurrence", labelEN:"Test yourself against the competition", risk:'equilibre', tilt:['montagne']},
          {label:"Attaquer sur l'ascension finale", labelEN:"Attack on the final climb", risk:'audacieux', tilt:['montagne','mental']},
        ], variants:[
          {title:"Étape d'arrivée en altitude", titleEN:"Summit finish stage", desc:"Une arrivée exigeante en altitude, souvent décisive pour le classement final.", descEN:"A demanding summit finish, often decisive for the final standings."},
          {title:"Étape castillane, terrain de préparation", titleEN:"Castilian stage, preparation terrain", desc:"Un tracé accidenté prisé par les équipes qui préparent la Vuelta.", descEN:"A hilly route favoured by teams preparing for the Vuelta."},
          {title:"Étape castillane sous une chaleur sèche", titleEN:"Castilian stage in dry heat", desc:"Un terrain aride typique du plateau espagnol en plein été.", descEN:"Arid terrain typical of the Spanish plateau in high summer."},
          {title:"Arrivée au sommet d'une ascension redoutée", titleEN:"Finish atop a feared climb", desc:"Souvent décisive pour le classement final de la course.", descEN:"Often decisive for the final standings of the race."},
        ]}
    ]},
  {id:'quebec', name:'Grand Prix de la Vieille Capitale', type:'classique', month:9, prestige:2, fatCost:9, days:1, flag:'🇨🇦',
    eventDefs:[
      {focus:['classiques','montagne'], choices:[
          {label:"Rester dans le peloton jusqu'au bout", labelEN:"Stay in the peloton to the end", risk:'sur', tilt:['recuperation']},
          {label:"Se positionner avant le dernier raidillon", labelEN:"Get into position before the last ramp", risk:'equilibre', tilt:['classiques']},
          {label:"Attaquer dans le circuit historique", labelEN:"Attack on the historic circuit", risk:'audacieux', tilt:['classiques','mental']},
        ], variants:[
          {title:"Circuit urbain vallonné dans la vieille ville", titleEN:"Rolling urban circuit through the old town", desc:"Un circuit répété dans les rues historiques de Québec.", descEN:"A circuit repeated through the historic streets of Quebec City."},
          {title:"Le dernier raidillon avant l'arrivée", titleEN:"The last ramp before the finish", desc:"Une montée courte et raide qui use les organismes à répétition.", descEN:"A short, steep climb that wears riders down with every lap."},
          {title:"Circuit répété dans des rues historiques", titleEN:"A circuit repeated through historic streets", desc:"Un tracé urbain et vallonné qui use les organismes à force de répétitions.", descEN:"An urban, rolling route that grinds riders down through sheer repetition."},
          {title:"Un final disputé sous les couleurs de l'automne", titleEN:"A finale under autumn colours", desc:"Le décor est spectaculaire, la sélection dans la course tout autant.", descEN:"The scenery is spectacular, and so is the selection in the race."},
        ]}
    ]},
  {id:'montreal', name:'Grand Prix du Mont Royal', type:'classique', month:9, prestige:2, fatCost:9, days:1, flag:'🇨🇦',
    eventDefs:[
      {focus:['classiques','montagne'], choices:[
          {label:"Suivre le rythme sans se découvrir", labelEN:"Follow the pace without overexposing yourself", risk:'sur', tilt:['resistance']},
          {label:"Se placer avant la montée urbaine", labelEN:"Get into position before the urban climb", risk:'equilibre', tilt:['classiques']},
          {label:"Attaquer dans les derniers passages de la montée", labelEN:"Attack on the final laps of the climb", risk:'audacieux', tilt:['classiques','mental']},
        ], variants:[
          {title:"La montée urbaine, plusieurs fois au programme", titleEN:"The urban climb, tackled several times", desc:"Une ascension répétée qui finit par faire une sélection sévère.", descEN:"A repeated climb that eventually makes a ruthless selection."},
          {title:"Un circuit exigeant dans les rues de la ville", titleEN:"A demanding circuit through the city streets", desc:"Une classique nord-américaine appréciée des puncheurs.", descEN:"A North American classic well liked by puncheurs."},
          {title:"Ascension répétée d'un mont urbain", titleEN:"Repeated climbs of an urban hill", desc:"Une montée courte mais présente à de nombreuses reprises, qui finit par faire la différence.", descEN:"A short climb tackled many times over, which eventually makes the difference."},
          {title:"Circuit urbain animé", titleEN:"A lively urban circuit", desc:"Une classique nord-américaine appréciée pour son ambiance électrique.", descEN:"A North American classic well liked for its electric atmosphere."},
        ]}
    ]},
  {id:'varesine', name:'Les Trois Vallées Varesines', type:'classique', month:10, prestige:1, fatCost:8, days:1, flag:'🇮🇹',
    eventDefs:[
      {focus:['montagne','classiques'], choices:[
          {label:"Gérer la fin de saison sans excès", labelEN:"Manage the end of the season without excess", risk:'sur', tilt:['recuperation']},
          {label:"Se placer dans le final vallonné", labelEN:"Get into position for the rolling finale", risk:'equilibre', tilt:['classiques']},
          {label:"Attaquer en costaud avant Lombardia", labelEN:"Attack as a strongman ahead of Lombardia", risk:'audacieux', tilt:['montagne','mental']},
        ], variants:[
          {title:"Une classique italienne d'automne", titleEN:"An Italian autumn classic", desc:"Un terrain vallonné typique de la fin de saison transalpine.", descEN:"Rolling terrain typical of the late-season Italian calendar."},
          {title:"Dernier test avant la Classique des feuilles mortes", titleEN:"Last test before the Falling Leaves Classic", desc:"Une répétition générale pour les spécialistes des classiques d'automne.", descEN:"A dress rehearsal for autumn classics specialists."},
          {title:"Ascension exigeante avant le final", titleEN:"Demanding climb before the finale", desc:"Une côte qui trie le peloton avant les derniers kilomètres.", descEN:"A climb that sorts out the peloton before the final kilometres."},
          {title:"Dernier galop d'essai avant la grande classique d'automne", titleEN:"One last dress rehearsal before the great autumn classic", desc:"Une répétition générale prisée des spécialistes des classiques.", descEN:"A dress rehearsal favoured by classics specialists."},
        ]}
    ]},
  {id:'jo', name:'Les Jeux Panhelléniques', type:'champ', month:7, prestige:5, fatCost:9, days:1, flag:'🥇', olympic:true,
    eventDefs:[
      {focus:['mental','classiques'], choices:[
          {label:"Se mettre au service du leader désigné par la sélection", labelEN:"Ride in service of the squad's designated leader", risk:'sur', tilt:['mental']},
          {label:"Rester dans le groupe de tête au cas où", labelEN:"Stay in the lead group just in case", risk:'equilibre', tilt:['classiques','mental']},
          {label:"Jouer sa propre carte pour l'or olympique", labelEN:"Play your own card for Olympic gold", risk:'audacieux', tilt:['mental','resistance']},
        ], variants:[
          {title:"Course en ligne olympique, la médaille d'or en jeu", titleEN:"Olympic road race, gold medal on the line", desc:"Une sélection nationale restreinte, une occasion unique tous les quatre ans. La pression est immense.", descEN:"A small national squad, a once-every-four-years opportunity. The pressure is immense."},
          {title:"Circuit exigeant sous les couleurs nationales", titleEN:"A demanding circuit wearing national colours", desc:"Représenter son pays aux Jeux : un honneur rare qui ne se représente pas tous les ans.", descEN:"Representing your country at the Games: a rare honour that doesn't come around every year."},
          {title:"Circuit urbain vallonné dans la ville hôte", titleEN:"Rolling urban circuit in the host city", desc:"Des passages répétés devant des tribunes bondées, dans une ambiance rarement égalée sur le calendrier.", descEN:"Repeated passes in front of packed grandstands, in an atmosphere rarely matched elsewhere on the calendar."},
          {title:"Course en ligne disputée sous une chaleur écrasante", titleEN:"Road race held under crushing heat", desc:"Les organisateurs n'ont pas pu choisir la météo : ce jour-là, la gestion de l'effort compte autant que les jambes.", descEN:"The organisers couldn't choose the weather: on this day, managing your effort matters as much as your legs."},
        ]}
    ]},
  {id:'golfe', name:'Le Tour du Golfe', type:'semitour', month:2, prestige:2, fatCost:6, days:5, flag:'🇦🇪',
    eventDefs:[
      {focus:['sprint','classiques'], choices:[
          {label:"Rester couvert dans le peloton", labelEN:"Stay sheltered in the peloton", risk:'sur', tilt:['recuperation']},
          {label:"Se positionner pour le sprint final", labelEN:"Get into position for the final sprint", risk:'equilibre', tilt:['sprint']},
          {label:"Provoquer la bordure dans le vent", labelEN:"Force the echelon in the wind", risk:'audacieux', tilt:['classiques','mental']},
        ], variants:[
          {title:"Étape plate balayée par le vent du désert", titleEN:"Flat stage swept by the desert wind", desc:"Les bordures se forment vite sur ces routes rectilignes exposées au vent du Golfe.", descEN:"Echelons form quickly on these straight roads exposed to the Gulf wind."},
          {title:"Sprint final le long de la corniche", titleEN:"Final sprint along the corniche", desc:"Un final rectiligne au bord du Golfe, décor futuriste en toile de fond.", descEN:"A straight finale along the Gulf coast, with a futuristic skyline as backdrop."},
          {title:"Étape dans les dunes, chaleur et vent de sable", titleEN:"Stage through the dunes, heat and sandy wind", desc:"Une chaleur sèche et un vent de sable inhabituel compliquent la gestion de l'effort.", descEN:"Dry heat and an unusual sandy wind complicate managing your effort."},
          {title:"Circuit nocturne sous les projecteurs", titleEN:"Night circuit under the floodlights", desc:"Une étape disputée en soirée pour éviter les pics de chaleur, dans une ambiance électrique.", descEN:"A stage raced in the evening to avoid the heat, in an electric atmosphere."},
        ]}
    ]},
  {id:'desert', name:'Le Tour du Désert', type:'semitour', month:2, prestige:2, fatCost:6, days:5, flag:'🇲🇦',
    eventDefs:[
      {focus:['montagne','resistance'], choices:[
          {label:"Gérer l'effort face à la chaleur", labelEN:"Manage your effort against the heat", risk:'sur', tilt:['recuperation']},
          {label:"Suivre le rythme du groupe de tête", labelEN:"Follow the pace of the lead group", risk:'equilibre', tilt:['resistance']},
          {label:"Attaquer dans la traversée désertique", labelEN:"Attack during the desert crossing", risk:'audacieux', tilt:['resistance','mental']},
        ], variants:[
          {title:"Étape en altitude et chaleur", titleEN:"Stage at altitude, in the heat", desc:"Un contraste saisissant entre pistes sableuses et cols de moyenne montagne.", descEN:"A striking contrast between sandy tracks and medium-mountain passes."},
          {title:"Traversée d'une piste caillouteuse en plein désert", titleEN:"Crossing a stony track deep in the desert", desc:"Un revêtement instable qui punit la moindre erreur de trajectoire.", descEN:"Unstable surface that punishes the slightest error of line."},
          {title:"Étape saharienne sous une chaleur extrême", titleEN:"Saharan stage under extreme heat", desc:"La gestion de l'hydratation devient aussi importante que le rythme de course.", descEN:"Managing hydration becomes as important as the race pace itself."},
          {title:"Arrivée en altitude après une longue traversée désertique", titleEN:"Summit finish after a long desert crossing", desc:"Le contraste thermique entre la plaine brûlante et l'altitude surprend les organismes.", descEN:"The temperature contrast between the scorching plain and altitude catches bodies off guard."},
        ]}
    ]},
  {id:'vendanges', name:'La Classique des Vendanges', type:'classique', month:10, prestige:1, fatCost:8, days:1, flag:'🇫🇷',
    eventDefs:[
      {focus:['classiques','mental'], choices:[
          {label:"Rester prudent sur les petites routes", labelEN:"Stay cautious on the narrow roads", risk:'sur', tilt:['resistance']},
          {label:"Se placer avant les premières côtes", labelEN:"Get into position before the first climbs", risk:'equilibre', tilt:['classiques']},
          {label:"Attaquer dans le final viticole", labelEN:"Attack in the vineyard finale", risk:'audacieux', tilt:['classiques','mental']},
        ], variants:[
          {title:"À travers les vignobles de Touraine", titleEN:"Through the vineyards of Touraine", desc:"Un parcours vallonné entre les rangs de vigne, en pleine période des vendanges.", descEN:"A rolling route between rows of vines, right in the middle of harvest season."},
          {title:"Circuit sur petites routes sinueuses du Val de Loire", titleEN:"Circuit on winding Loire Valley back roads", desc:"Une classique automnale disputée sur un revêtement parfois glissant, feuilles mortes obligent.", descEN:"An autumn classic raced on a surface sometimes slick with fallen leaves."},
          {title:"Étape ponctuée de plusieurs côtes courtes et raides", titleEN:"A stage punctuated by several short, steep climbs", desc:"Un tracé exigeant qui favorise les puncheurs en pleine forme d'automne.", descEN:"A demanding route that favours puncheurs in full autumn form."},
          {title:"Un final au cœur d'un village viticole en fête", titleEN:"A finale in the heart of a festive wine village", desc:"Les habitants sortent en nombre, entre dégustation et attroupement au bord de la route.", descEN:"Locals turn out in force, between wine tasting and crowds lining the road."},
        ]}
    ]},
  {id:'gp-escaut', name:'Grand Prix de l\'Escaut', type:'classique', month:7, prestige:3, fatCost:7, days:1, flag:'🇧🇪',
    eventDefs:[
      {focus:['sprint','classiques'], choices:[
          {label:"Se fondre dans le train de sprinte de son équipe", labelEN:"Slot into the team sprint train", risk:'sur', tilt:['recuperation']},
          {label:"Déclencher le sprint à 300 mètres en remontant les bordures", labelEN:"Trigger the sprint from 300 metres, moving through the echelons", risk:'equilibre', tilt:['sprint']},
          {label:"Partir seul dans le dernier kilomètre pour surprendre les équipes", labelEN:"Go solo in the final kilometre to catch the teams off guard", risk:'audacieux', tilt:['sprint','mental']},
        ], variants:[
          {title:"Le sprint roi sur les bords de l'Escaut", titleEN:"The king of sprints on the banks of the Scheldt", desc:"Une classique belge d'été réputée pour ses arrivées massives. Les meilleurs sprinteurs du monde sont au départ.", descEN:"A Belgian summer classic famous for its bunch sprint finishes. The world's best sprinters are all here."},
          {title:"Final sur les quais, sprint à grande vitesse", titleEN:"Quayside finale, high-speed sprint", desc:"Un final rectiligne sur les quais de l'Escaut — vitesse et puissance, rien d'autre.", descEN:"A straight quayside finale on the Scheldt — speed and power, nothing else."},
          {title:"Peloton compact, suspense jusqu'au bout", titleEN:"Compact peloton, suspense right to the end", desc:"Pas d'échappée, pas de sélection — un sprint massif comme on les aime.", descEN:"No breakaway, no selection — a bunch sprint as good as they get."},
          {title:"Quelques rescapés devant, le peloton derrière", titleEN:"A handful of survivors ahead, the peloton behind", desc:"Une petite bordure a fait le tri à 10km — les sprinteurs qui ont passé se disputent maintenant la victoire.", descEN:"A small echelon sorted things out 10km out — the sprinters who survived are now racing for the win."},
        ]}
    ]},
    {id:'scandinave', name:'La Classique Scandinave', type:'classique', month:8, prestige:1, fatCost:8, days:1, flag:'🇩🇰',
    eventDefs:[
      {focus:['sprint','resistance'], choices:[
          {label:"Se protéger du vent dans le peloton", labelEN:"Shelter from the wind in the peloton", risk:'sur', tilt:['recuperation']},
          {label:"Se placer pour le sprint final", labelEN:"Get into position for the final sprint", risk:'equilibre', tilt:['sprint']},
          {label:"Tenter la bordure sur la côte", labelEN:"Try an echelon along the coast", risk:'audacieux', tilt:['resistance','mental']},
        ], variants:[
          {title:"Étape côtière balayée par le vent du nord", titleEN:"Coastal stage swept by the northern wind", desc:"Un parcours plat mais traître, où le vent latéral peut tout changer en quelques kilomètres.", descEN:"A flat but treacherous route, where a crosswind can change everything within a few kilometres."},
          {title:"Circuit autour des lacs danois", titleEN:"Circuit around the Danish lakes", desc:"Une classique roulante disputée sous un ciel changeant, typique de l'été scandinave.", descEN:"A rolling classic raced under changeable skies, typical of the Scandinavian summer."},
          {title:"Sprint final dans une ville portuaire", titleEN:"Final sprint in a port town", desc:"Un final rapide et rectiligne, apprécié des équipes de sprinteurs.", descEN:"A fast, straight finale, well liked by the sprinters' teams."},
          {title:"Étape sous une pluie fine et persistante", titleEN:"Stage under persistent light rain", desc:"Un temps maussade qui n'entame en rien la ferveur du public local.", descEN:"Gloomy weather that does nothing to dampen the local crowd's enthusiasm."},
        ]}
    ]},
  {id:'boheme', name:'Le Tour de Bohême', type:'semitour', month:6, prestige:1, fatCost:6, days:5, flag:'🇨🇿',
    eventDefs:[
      {focus:['montagne','classiques'], choices:[
          {label:"Rouler prudemment sur les petites routes", labelEN:"Ride cautiously on the narrow roads", risk:'sur', tilt:['resistance']},
          {label:"Suivre le rythme dans les bosses", labelEN:"Follow the pace on the climbs", risk:'equilibre', tilt:['montagne']},
          {label:"Attaquer dans le final vallonné", labelEN:"Attack in the rolling finale", risk:'audacieux', tilt:['classiques','mental']},
        ], variants:[
          {title:"Étape vallonnée à travers la campagne tchèque", titleEN:"Rolling stage through the Czech countryside", desc:"Un parcours roulant ponctué de bosses courtes, typique de l'Europe centrale.", descEN:"A rolling route punctuated by short climbs, typical of Central Europe."},
          {title:"Circuit autour d'un château médiéval", titleEN:"Circuit around a medieval castle", desc:"Un décor spectaculaire pour une étape qui se joue souvent au sprint réduit.", descEN:"A spectacular backdrop for a stage often decided in a small sprint."},
          {title:"Étape forestière sur petites routes sinueuses", titleEN:"Forest stage on winding back roads", desc:"Un tracé technique qui demande une bonne lecture de course.", descEN:"A technical route that demands sharp race awareness."},
          {title:"Étape disputée sous une chaleur inhabituelle pour la saison", titleEN:"Stage raced in unseasonably hot weather", desc:"Une chaleur précoce surprend le peloton en plein mois de juin.", descEN:"Early-season heat catches the peloton off guard in the middle of June."},
        ]}
    ]},
  {id:'koln', name:'Rund um Köln', type:'classique', month:8, prestige:2, fatCost:5, days:1, flag:'🇩🇪',
    eventDefs:[
      {focus:['sprint','classiques'], choices:[
          {label:"Rester au chaud dans le peloton jusqu'au final", labelEN:"Stay sheltered in the peloton until the finale", risk:'sur', tilt:['resistance']},
          {label:"Se placer pour le sprint en côte dans le final", labelEN:"Get into position for the uphill sprint in the finale", risk:'equilibre', tilt:['sprint','classiques']},
          {label:"Placer une offensive à 20km de l'arrivée", labelEN:"Launch an attack 20km from the finish", risk:'audacieux', tilt:['classiques','mental']},
        ], variants:[
          {title:"Sur les hauteurs de la Rhénanie", titleEN:"Over the hills of the Rhineland", desc:"Un circuit vallonné autour de la ville, ponctué de courtes côtes pavées. Les survivants se disputent le sprint final.", descEN:"A rolling circuit around the city, with short cobbled climbs. The survivors sprint it out at the finish."},
          {title:"La montée sélective avant le sprint", titleEN:"The selective climb before the sprint", desc:"La dernière côte trie le peloton — les sprinteurs qui ont su passer reviennent ensuite pour le sprint.", descEN:"The final climb thins the peloton — the sprinters who survive come back to contest the sprint."},
          {title:"Un circuit rhénan décidé au sprint réduit", titleEN:"A Rhineland circuit decided in a reduced sprint", desc:"Quelques dizaines de coureurs franchissent les côtes ensemble et se retrouvent pour un final au sprint.", descEN:"A few dozen riders crest the climbs together and face off in a sprint finale."},
        ]},
    ]},
  {id:'california', name:'Le Tour de Californie', type:'semitour', month:4, prestige:2, fatCost:6, days:7, flag:'🇺🇸',
    eventDefs:[
      {focus:['montagne','clm','resistance'], choices:[
          {label:"Contrôler la course sans prendre de risques", labelEN:"Control the race without taking risks", risk:'sur', tilt:['resistance','clm']},
          {label:"Placer une attaque dans l'ascension finale", labelEN:"Launch an attack on the final climb", risk:'equilibre', tilt:['montagne']},
          {label:"Tenter une offensive solitaire sur la côte", labelEN:"Try a solo move along the coast", risk:'audacieux', tilt:['montagne','mental']},
        ], variants:[
          {title:"Étape des sommets de la Sierra", titleEN:"Stage over the Sierra summits", desc:"Une arrivée en altitude qui départage les meilleurs grimpeurs du plateau.", descEN:"A summit finish that separates the best climbers on the roster."},
          {title:"Chrono le long du Pacifique", titleEN:"Time trial along the Pacific", desc:"Un tracé venteux en bord de côte, où chaque seconde compte.", descEN:"A windy coastal route, where every second counts."},
          {title:"Étape à travers les vignobles", titleEN:"Stage through the vineyards", desc:"Un terrain roulant et technique, favorable aux attaques opportunistes.", descEN:"Rolling, technical terrain, well suited to opportunistic attacks."},
          {title:"Étape dans l'arrière-pays désertique", titleEN:"Stage through the desert hinterland", desc:"Chaleur sèche et longues lignes droites, une épreuve à part entière.", descEN:"Dry heat and long straight roads — a test all of its own."},
        ]},
    ]},
  {id:'manche', name:'Le Tour de la Manche', type:'classique', month:5, prestige:2, fatCost:5, days:1, flag:'🇬🇧',
    eventDefs:[
      {focus:['sprint','resistance'], choices:[
          {label:"Se protéger du vent au cœur du peloton", labelEN:"Shelter from the wind in the heart of the peloton", risk:'sur', tilt:['resistance']},
          {label:"Se placer pour le sprint dans la dernière ligne droite", labelEN:"Get into position for the sprint on the final straight", risk:'equilibre', tilt:['sprint']},
          {label:"Provoquer la bordure en prenant les devants", labelEN:"Force the echelon by taking the front", risk:'audacieux', tilt:['sprint','mental']},
        ], variants:[
          {title:"Sur les petites routes du sud de l'Angleterre", titleEN:"On the narrow roads of southern England", desc:"Un tracé plat et exposé, qui se conclut généralement par un sprint massif malgré le vent de la Manche.", descEN:"A flat, exposed route, usually decided in a bunch sprint despite the Channel wind."},
          {title:"Sprint final le long des falaises", titleEN:"Sprint finish along the cliffs", desc:"Un final spectaculaire : des vents de travers pendant toute la course, puis un sprint sur les quais.", descEN:"A spectacular finale: crosswinds all race, then a sprint on the quayside."},
          {title:"Une échappée dans le vent de travers", titleEN:"A breakaway in the crosswind", desc:"La moindre inattention se paie cash sur ce genre de parcours.", descEN:"The slightest lapse in concentration costs dearly on this kind of route."},
          {title:"Peloton compact malgré le vent, sprint massif au bout", titleEN:"Compact peloton despite the wind, bunch sprint at the end", desc:"Les équipes de sprinteurs ont parfaitement contrôlé la course. C'est au sprint que ça se décide.", descEN:"The sprinters' teams kept perfect control. It comes down to the sprint."},
        ]},
    ]},
  {id:'fjords', name:'Le Grand Prix des Fjords', type:'classique', month:9, prestige:2, fatCost:6, days:1, flag:'🇳🇴',
    eventDefs:[
      {focus:['montagne','resistance'], choices:[
          {label:"Gérer l'effort face au froid", labelEN:"Manage your effort against the cold", risk:'sur', tilt:['resistance']},
          {label:"Suivre le rythme imposé dans la montée finale", labelEN:"Follow the pace on the final climb", risk:'equilibre', tilt:['montagne']},
          {label:"Attaquer tôt pour surprendre avant le froid le plus vif", labelEN:"Attack early to surprise before the worst of the cold", risk:'audacieux', tilt:['montagne','mental']},
        ], variants:[
          {title:"Le long des eaux glacées", titleEN:"Along the icy waters", desc:"Un parcours spectaculaire mais rude, où la température chute vite en altitude.", descEN:"A spectacular but harsh route, where the temperature drops fast at altitude."},
          {title:"L'ascension du plateau", titleEN:"The climb to the plateau", desc:"Une montée longue et irrégulière, exigeante pour le mental autant que pour les jambes.", descEN:"A long, uneven climb, as demanding on the mind as on the legs."},
          {title:"Un final exposé aux éléments", titleEN:"A finale exposed to the elements", desc:"Le vent et le froid s'invitent dans les derniers kilomètres décisifs.", descEN:"Wind and cold gatecrash the decisive final kilometres."},
        ]},
    ]},
  {id:'levant', name:'Le Tour du Levant', type:'semitour', month:5, prestige:2, fatCost:6, days:6, flag:'🇯🇵',
    eventDefs:[
      /* Les 3 choix restent volontairement neutres en terrain (contrairement à un focus
         purement 'montagne') : la moitié des variantes ci-dessous sont un circuit côtier
         et une étape urbaine sans relief, pas seulement des ascensions. */
      {focus:['classiques','resistance','montagne'], choices:[
          {label:"Gérer l'effort sur ce tracé exigeant", labelEN:"Manage your effort on this demanding route", risk:'sur', tilt:['resistance']},
          {label:"Rester bien placé tout au long de l'étape", labelEN:"Stay well positioned throughout the stage", risk:'equilibre', tilt:['classiques']},
          {label:"Provoquer la différence dès que l'occasion se présente", labelEN:"Force the difference as soon as the chance arises", risk:'audacieux', tilt:['classiques','mental']},
        ], variants:[
          {title:"Étape de montagne au pied d'un volcan sacré", titleEN:"Mountain stage at the foot of a sacred volcano", desc:"Un décor spectaculaire pour une ascension qui trie déjà les prétendants au général.", descEN:"A spectacular backdrop for a climb that already sorts out the GC contenders."},
          {title:"Circuit côtier balayé par les typhons de saison", titleEN:"Coastal circuit swept by the season's typhoons", desc:"Une météo changeante qui complique sérieusement la gestion de course.", descEN:"Changeable weather that seriously complicates race management."},
          {title:"Étape urbaine ultra-rythmée", titleEN:"A fast-paced urban stage", desc:"Un tracé technique à travers une mégalopole, où la moindre erreur de position se paie cher.", descEN:"A technical route through a megacity, where the slightest positioning error costs dearly."},
          {title:"Ascension finale vers un sanctuaire de montagne", titleEN:"Final climb to a mountain shrine", desc:"Une arrivée symbolique qui referme cette incursion encore rare du peloton en Asie.", descEN:"A symbolic finish that closes out this still-rare foray of the peloton into Asia."},
        ]}
    ]},
  {id:'cyclades', name:'La Route des Cyclades', type:'semitour', month:9, prestige:1, fatCost:5, days:5, flag:'🇬🇷',
    eventDefs:[
      {focus:['classiques','resistance'], choices:[
          {label:"Rester couvert face au vent égéen", labelEN:"Stay sheltered from the Aegean wind", risk:'sur', tilt:['resistance']},
          {label:"Se placer avant les routes côtières exposées", labelEN:"Get into position before the exposed coastal roads", risk:'equilibre', tilt:['classiques']},
          {label:"Provoquer la bordure dans le meltem", labelEN:"Force the echelon in the meltemi wind", risk:'audacieux', tilt:['classiques','mental']},
        ], variants:[
          {title:"Étape balayée par le vent des Cyclades", titleEN:"Stage swept by the Cycladic wind", desc:"Le fameux vent égéen redistribue les cartes sur ce parcours côtier exigeant.", descEN:"The famous Aegean wind reshuffles the deck on this demanding coastal route."},
          {title:"Circuit vallonné entre villages blanchis à la chaux", titleEN:"Rolling circuit between whitewashed villages", desc:"Un décor méditerranéen spectaculaire pour une étape aux airs de carte postale.", descEN:"A spectacular Mediterranean backdrop for a postcard-perfect stage."},
          {title:"Étape côtière sous un soleil encore estival", titleEN:"Coastal stage under a still-summery sun", desc:"Un tracé roulant qui profite des derniers beaux jours de la saison.", descEN:"A rolling route making the most of the season's last fine days."},
        ]}
    ]},
  {id:'adriatique', name:"Le Tour de l'Adriatique", type:'semitour', month:5, prestige:2, fatCost:6, days:6, flag:'🇭🇷',
    eventDefs:[
      {focus:['montagne','classiques'], choices:[
          {label:"Rouler pour l'équipe sans ambition perso", labelEN:"Ride for the team, no personal ambitions", risk:'sur', tilt:['resistance']},
          {label:"Jouer sa carte dans le final vallonné", labelEN:"Play your own card in the rolling finale", risk:'equilibre', tilt:['montagne']},
          {label:"Attaquer sur les hauteurs côtières", labelEN:"Attack on the coastal heights", risk:'audacieux', tilt:['montagne','mental']},
        ], variants:[
          {title:"Étape en surplomb de la mer Adriatique", titleEN:"Stage overlooking the Adriatic Sea", desc:"Un tracé sinueux entre falaises et petites routes côtières, spectaculaire mais exigeant.", descEN:"A winding route between cliffs and narrow coastal roads, spectacular but demanding."},
          {title:"Étape dans l'arrière-pays karstique", titleEN:"Stage through the karst hinterland", desc:"Un relief accidenté et minéral qui use les organismes autant que le mental.", descEN:"Rugged, rocky terrain that wears down bodies as much as minds."},
          {title:"Circuit final dans une vieille ville fortifiée", titleEN:"Final circuit through an old walled town", desc:"Des ruelles pavées et un final technique referment cette incursion balkanique.", descEN:"Cobbled lanes and a technical finale close out this Balkan foray."},
          {title:"Étape côtière sous un vent de terre inhabituel", titleEN:"Coastal stage under an unusual offshore wind", desc:"Une bora inattendue complique la gestion de course sur ce tracé exposé.", descEN:"An unexpected bora wind complicates race management on this exposed route."},
        ]}
    ]},
  {id:'pampa', name:'La Vuelta a la Pampa', type:'semitour', month:2, prestige:2, fatCost:6, days:6, flag:'🇦🇷',
    eventDefs:[
      {focus:['resistance','clm'], choices:[
          {label:"Gérer l'effort sur la longue distance", labelEN:"Manage your effort over the long distance", risk:'sur', tilt:['resistance']},
          {label:"Suivre le rythme du groupe de tête", labelEN:"Follow the pace of the lead group", risk:'equilibre', tilt:['resistance']},
          {label:"Provoquer une échappée sur les grandes lignes droites", labelEN:"Force a breakaway on the long straights", risk:'audacieux', tilt:['clm','mental']},
        ], variants:[
          {title:"Étape interminable à travers la pampa", titleEN:"An endless stage across the pampa", desc:"Des kilomètres de plaine rectiligne où l'ennui peut devenir un adversaire à part entière.", descEN:"Kilometres of dead-straight plain, where boredom can become an opponent in its own right."},
          {title:"Contre-la-montre balayé par le vent du sud", titleEN:"Time trial swept by the southern wind", desc:"Un exercice solitaire rendu redoutable par les rafales constantes de la pampa.", descEN:"A solitary effort made fearsome by the pampa's constant gusts."},
          {title:"Circuit final dans une ville coloniale", titleEN:"Final circuit through a colonial town", desc:"Un décor pittoresque referme cette incursion sud-américaine encore rare sur le calendrier.", descEN:"A picturesque setting closes out this still-rare South American stop on the calendar."},
          {title:"Étape sous une chaleur sèche et un ciel immense", titleEN:"Stage under dry heat and an enormous sky", desc:"La gestion de l'hydratation devient cruciale sur ce parcours à perte de vue.", descEN:"Managing hydration becomes crucial on this route that stretches to the horizon."},
        ]}
    ]},
  {id:'capetown', name:'Le Tour du Cap', type:'semitour', month:2, prestige:2, fatCost:6, days:5, flag:'🇿🇦',
    eventDefs:[
      {focus:['montagne','classiques'], choices:[
          {label:"Gérer l'effort face au vent du cap", labelEN:"Manage your effort against the Cape wind", risk:'sur', tilt:['resistance']},
          {label:"Se placer avant la montée côtière", labelEN:"Get into position before the coastal climb", risk:'equilibre', tilt:['montagne']},
          {label:"Attaquer sur les pentes exposées à l'océan", labelEN:"Attack on the slopes exposed to the ocean", risk:'audacieux', tilt:['montagne','mental']},
        ], variants:[
          {title:"Étape au pied d'une montagne emblématique en table", titleEN:"Stage at the foot of an iconic flat-topped mountain", desc:"Un décor spectaculaire entre océan et sommet plat, unique sur le calendrier mondial.", descEN:"A spectacular backdrop between ocean and flat summit, unique on the world calendar."},
          {title:"Circuit côtier balayé par le vent du sud-est", titleEN:"Coastal circuit swept by the south-easterly wind", desc:"Le \"vent du docteur\" local peut transformer la course en bataille de bordures.", descEN:"The local \"doctor's wind\" can turn the race into a battle of echelons."},
          {title:"Étape à travers les vignobles du Cap", titleEN:"Stage through the Cape vineyards", desc:"Un terrain vallonné et technique, apprécié pour son cadre spectaculaire.", descEN:"Rolling, technical terrain, well liked for its spectacular setting."},
        ]}
    ]},

  {id:'guadeloupe', name:'Le Tour de Guadeloupe', type:'semitour', month:3, prestige:2, fatCost:6, days:7,flag:'🇬🇵',
    eventDefs:[
      {focus:['resistance','recuperation'], choices:[
          {label:"Gérer l'humidité tropicale à l'économie", labelEN:"Manage the tropical humidity conservatively", risk:'sur', tilt:['recuperation']},
          {label:"Attaquer sur la montée de la Soufrière", labelEN:"Attack on the Soufrière climb", risk:'equilibre', tilt:['montagne','mental']},
          {label:"Tenter l'échappée dès la première étape", labelEN:"Try a breakaway from the first stage", risk:'audacieux', tilt:['resistance','mental']},
        ], variants:[
          {title:"Étape reine vers la Soufrière", titleEN:"Queen stage to the Soufrière", desc:"Les pentes du volcan séparent le peloton en deux groupes dès la première vraie montée.", descEN:"The volcano's slopes split the peloton in two from the first real climb."},
          {title:"Circuit côtier sous la chaleur caribéenne", titleEN:"Coastal circuit in Caribbean heat", desc:"Le vent des Alizés rend les bordures imprévisibles dans les derniers kilomètres.", descEN:"The Trade Winds make echelons unpredictable in the final kilometres."},
          {title:"Étape de transition sur la Grande-Terre", titleEN:"Transition stage on Grande-Terre", desc:"Une étape en apparence facile, mais où les escapes matinales peuvent tout changer.", descEN:"A deceptively easy stage where early breakaways can change everything."},
        ]}
    ]},
  {id:'giro-adriatico', name:"Tirreno-Adriatico", type:'semitour', month:3, prestige:3, fatCost:7, days:7,flag:'🇮🇹',
    eventDefs:[
      {focus:['clm','resistance'], choices:[
          {label:"Sécuriser le classement dans le chrono final", labelEN:"Secure the GC in the final TT", risk:'sur', tilt:['clm']},
          {label:"Attaquer dans les côtes du Mur de Fermo", labelEN:"Attack on the Mur de Fermo climbs", risk:'equilibre', tilt:['resistance','mental']},
          {label:"Prendre des risques dès le début de la semaine", labelEN:"Take risks from the start of the week", risk:'audacieux', tilt:['montagne','mental']},
        ], variants:[
          {title:"Arrivée au sommet du Mur de Fermo", titleEN:"Summit finish at the Mur de Fermo", desc:"La côte à 20% dans les 500 derniers mètres dynamite à chaque fois les classements.", descEN:"The 20% grade in the last 500 metres blows up the standings every time."},
          {title:"Contre-la-montre final de San Benedetto", titleEN:"Final time trial at San Benedetto", desc:"Le verdict de la semaine tombe sur ce CLM le long de la mer Adriatique.", descEN:"The week's verdict falls on this TT along the Adriatic coast."},
          {title:"Étape de moyenne montagne", titleEN:"Medium mountain stage", desc:"Des côtes courtes et répétées qui usent les jambes sans offrir de sélection définitive.", descEN:"Short repeated climbs that wear down the legs without making a definitive selection."},
        ]}
    ]},
  {id:'tirreno-tempetes', name:'Tirreno — Côte des Tempêtes', type:'semitour', month:3, prestige:3, fatCost:6, days:7,flag:'🇮🇹',
    eventDefs:[
      {focus:['classiques','sprint'], choices:[
          {label:"Attendre le sprint au pied des côtes finales", labelEN:"Wait for the sprint at the foot of the final climbs", risk:'sur', tilt:['sprint']},
          {label:"Suivre les favoris GC dans les côtes", labelEN:"Follow the GC favourites on the climbs", risk:'equilibre', tilt:['resistance','mental']},
          {label:"Attaquer sur la côte de San Vincenzo", labelEN:"Attack on the San Vincenzo climb", risk:'audacieux', tilt:['classiques','mental']},
        ], variants:[
          {title:"Étape venteuse le long de la Mer Tyrrhénienne", titleEN:"Windy stage along the Tyrrhenian Sea", desc:"Les bourrasques côtières provoquent des bordures qui déciment le peloton.", descEN:"Coastal gusts cause echelons that decimate the peloton."},
          {title:"Arrivée au sommet de Terminillo", titleEN:"Summit finish at Terminillo", desc:"La seule arrivée en altitude de la course, souvent décisive pour le classement général.", descEN:"The only summit finish of the race, often decisive for the overall standings."},
          {title:"Sprint final à San Benedetto del Tronto", titleEN:"Final sprint in San Benedetto del Tronto", desc:"La traditionnelle conclusion de cette course-duelle qui oppose sprinteurs et puncheurs.", descEN:"The traditional conclusion of this duel-race between sprinters and puncheurs."},
        ]}
    ]},
  {id:'criterium-as', name:"Critérium de l'As", type:'crit', month:10, prestige:1, fatCost:2, days:1,flag:'🇫🇷',
    eventDefs:[
      {focus:['sprint','mental'], choices:[
          {label:"Économiser pour le sprint final", labelEN:"Save energy for the final sprint", risk:'sur', tilt:['sprint']},
          {label:"Tenter une longue échappée solo", labelEN:"Try a long solo breakaway", risk:'equilibre', tilt:['resistance','mental']},
          {label:"Attaquer à mi-course pour créer le spectacle", labelEN:"Attack mid-race to put on a show", risk:'audacieux', tilt:['mental','sprint']},
        ], variants:[
          {title:"Circuit nocturne sous les projecteurs", titleEN:"Night circuit under the floodlights", desc:"Les critériums d'après-saison ont leur atmosphère particulière : fête du vélo, public conquis, ambiance festive.", descEN:"Post-season crits have their own atmosphere: cycling festival, enthusiastic crowd, festive mood."},
          {title:"Format exhibition sur critérium classique", titleEN:"Exhibition format on classic criterium circuit", desc:"Une épreuve de prestige mondain autant que sportif, où les champions se montrent.", descEN:"An event of social prestige as much as sporting, where champions put on a show."},
        ]}
    ]},
  {id:'guangxi', name:'Le Tour du Dragon', type:'semitour', month:10, prestige:2, fatCost:5, days:6,flag:'🇨🇳',
    eventDefs:[
      {focus:['montagne','recuperation'], choices:[
          {label:"Gérer les étapes tropicales sans forcer", labelEN:"Manage the tropical stages without pushing hard", risk:'sur', tilt:['recuperation']},
          {label:"Attaquer sur les cols karstiques", labelEN:"Attack on the karst mountain passes", risk:'equilibre', tilt:['montagne','mental']},
          {label:"Imposer le tempo dès la première étape de montagne", labelEN:"Set the tempo from the first mountain stage", risk:'audacieux', tilt:['montagne','resistance']},
        ], variants:[
          {title:"Arrivée sur les pics karstiques du Guangxi", titleEN:"Finish on the karst peaks of Guangxi", desc:"Le paysage lunaire de Guilin offre un décor spectaculaire pour une arrivée en altitude.", descEN:"The lunar landscape of Guilin provides a spectacular backdrop for a summit finish."},
          {title:"Étape de plaine sous une chaleur humide écrasante", titleEN:"Flat stage under oppressive humid heat", desc:"La gestion thermique est aussi importante que la tactique dans ces conditions.", descEN:"Thermal management is as important as tactics in these conditions."},
          {title:"Étape finale et sprint massif à Nanning", titleEN:"Final stage and bunch sprint in Nanning", desc:"Une arrivée sur circuit dans la capitale du Guangxi, où les organismes fatigués tentent une dernière fois de s'exprimer avant la clôture.", descEN:"A circuit finish in the Guangxi capital, where tired legs make one last effort before the race concludes."},
        ]}
    ]},
  {id:'tropicale', name:'La Tropicale Bastiaise', type:'semitour', month:1, prestige:1, fatCost:4, days:5,flag:'🇫🇷',
    eventDefs:[
      {focus:['resistance','recuperation'], choices:[
          {label:"Gérer les jambes fraîches de début de saison", labelEN:"Manage fresh legs at the start of the season", risk:'sur', tilt:['recuperation']},
          {label:"Tester son état de forme dans les cols corses", labelEN:"Test your form in the Corsican mountain passes", risk:'equilibre', tilt:['montagne','resistance']},
          {label:"Attaquer d'entrée pour prendre confiance", labelEN:"Attack early to build confidence", risk:'audacieux', tilt:['mental','resistance']},
        ], variants:[
          {title:"Etape de rentrée sur les routes corses", titleEN:"Season-opener stage on Corsican roads", desc:"Début de saison, corps encore froids — mais la compétition reprend ses droits sur l'île de beauté.", descEN:"Start of season, bodies still cold — but competition resumes its course on the island of beauty."},
          {title:"Cols et maquis sous un soleil hivernal", titleEN:"Cols and maquis under a winter sun", desc:"La douceur du climat corse en janvier trompe : les cols montent sec et vite.", descEN:"The mild Corsican climate in January is deceptive: the passes climb sharply and fast."},
        ]}
    ]},
]; }
