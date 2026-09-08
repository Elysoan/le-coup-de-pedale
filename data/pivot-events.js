const PIVOT_EVENTS = [
  /* S3 : Offre d'équipe en cours de contrat */
  {id:'offer_prematured', triggerSeason:3,
   title:tf('pivotOfferTitle',"Une offre inattendue"),
   titleEN:"An unexpected offer",
   icon:'📨',
   desc:tf('pivotOfferDesc',"Une équipe de division supérieure t'a fait parvenir un message discret : ils t'observent depuis le début de saison et seraient prêts à te signer dès maintenant, avant la fin de ton contrat actuel. Partir maintenant serait une trahison vis-à-vis de ton équipe actuelle — mais l'opportunité est rare."),
   descEN:"A higher-division team has sent you a discreet message: they've been watching you since the start of the season and would be willing to sign you now, before your current contract ends. Leaving now would be a betrayal of your current team — but the opportunity is rare.",
   choices:[
     {label:tf('pivotOfferAccept',"Accepter l'offre (trahison, +opportunité)"), labelEN:"Accept the offer (betrayal, +opportunity)",
      effect:(r)=>{
        r.careerFlags.betrayedTeam = r.season;
        r.teamConfidence = Math.max(0, r.teamConfidence - 25);
        r.reputation = Math.max(0, r.reputation - 8);
        addJournalEntry(r, tf('pivotOfferAcceptLog',"Tu as quitté ton équipe en cours de contrat pour une opportunité en division supérieure. Ça a froissé beaucoup de monde."));
      }},
     {label:tf('pivotOfferDecline',"Refuser — rester fidèle à l'équipe"), labelEN:"Decline — stay loyal to the team",
      effect:(r)=>{
        r.careerFlags.loyaltyBonus = r.season;
        r.teamConfidence = Math.min(100, r.teamConfidence + 15);
        addJournalEntry(r, tf('pivotOfferDeclineLog',"Tu as décliné une offre en cours de contrat. Ta loyauté n'est pas passée inaperçue dans le peloton."));
      }},
   ]},

  /* S5 : Scandale dans l'équipe */
  {id:'team_scandal', triggerSeason:5,
   title:tf('pivotScandalTitle',"Nuage sur l'équipe"),
   titleEN:"Storm clouds over the team",
   icon:'📰',
   desc:tf('pivotScandalDesc',"Des rumeurs de dopage circulent autour de ton équipe. Un journaliste t'a contacté pour avoir ta réaction. Tu n'es impliqué en rien — mais ta réponse publique va définir ton image pour les prochaines saisons."),
   descEN:"Doping rumours are circulating around your team. A journalist has contacted you for your reaction. You're not involved at all — but your public response will define your image for the next few seasons.",
   choices:[
     {label:tf('pivotScandalSolidaire',"Rester solidaire de l'équipe"), labelEN:"Stand by the team",
      effect:(r)=>{
        r.careerFlags.scandalSolidaire = r.season;
        r.teamConfidence = Math.min(100, r.teamConfidence + 20);
        r.reputation = Math.max(0, r.reputation - 5);
        addJournalEntry(r, tf('pivotScandalSolidaireLog',"Tu as défendu ton équipe publiquement. La confiance interne est au beau fixe, mais ton image en a pris un coup."));
      }},
     {label:tf('pivotScandalDistance',"Prendre ses distances publiquement"), labelEN:"Publicly distance yourself",
      effect:(r)=>{
        r.careerFlags.scandalDistance = r.season;
        r.teamConfidence = Math.max(0, r.teamConfidence - 15);
        r.reputation = Math.min(100, r.reputation + 5);
        addJournalEntry(r, tf('pivotScandalDistanceLog',"Tu t'es désolidarisé publiquement de l'équipe. Ton image est préservée, mais l'ambiance interne est froide."));
      }},
   ]},

  /* S7 : Coéquipier devenu rival */
  {id:'teammate_rival', triggerSeason:7,
   title:tf('pivotRivalTitle',"Trahison dans le peloton"),
   titleEN:"Betrayal in the peloton",
   icon:'🥊',
   desc:tf('pivotRivalDesc',"Ton ancien coéquipier vient de signer dans une équipe concurrente. Lors d'une conférence de presse, il s'est permis de sous-entendre que tu lui avais volé des victoires ces dernières saisons. Le peloton observe ta réaction."),
   descEN:"Your former teammate has just signed for a rival team. At a press conference, he implied that you had stolen victories from him over the past few seasons. The peloton is watching your reaction.",
   choices:[
     {label:tf('pivotRivalIgnore',"Ignorer — laisser la course parler"), labelEN:"Ignore it — let the racing do the talking",
      effect:(r)=>{
        r.careerFlags.rivalIgnored = r.season;
        r.reputation = Math.min(100, r.reputation + 3);
        addJournalEntry(r, tf('pivotRivalIgnoreLog',"Tu n'as pas répondu aux provocations. Le peloton a apprécié ta classe."));
      }},
     {label:tf('pivotRivalConfront',"Répondre publiquement — fixer une confrontation"), labelEN:"Respond publicly — set up a showdown",
      effect:(r)=>{
        r.careerFlags.rivalConfront = r.season;
        // Forcer l'apparition d'un rival narratif plus intense
        if(STATE.rivals && STATE.rivals.length < 3){
          STATE.rivals.push({
            name: r.teammate ? r.teammate.name : tf('pivotRivalName','Ton ancien coéquipier'),
            styleId: r.styleId,
            intensity: 'intense',
            raceIds: [],
            createdSeason: r.season,
          });
        }
        addJournalEntry(r, tf('pivotRivalConfrontLog',"Tu as accepté la confrontation. Une rivalité brûlante s'est allumée — le public adore ça."));
      }},
   ]},

  /* S9 : Proposition de reconversion anticipée */
  {id:'retirement_offer', triggerSeason:9,
   title:tf('pivotRetireTitle',"Une porte de sortie"),
   titleEN:"A way out",
   icon:'🎙️',
   desc:tf('pivotRetireDesc',"Un directeur sportif t'a proposé un poste de directeur d'équipe à partir de la saison prochaine. C'est une reconnaissance de ta carrière — mais tu pourrais encore courir 3-4 saisons. Choisir de rester, c'est chercher les victoires qui manquent encore à ton palmarès."),
   descEN:"A sporting director has offered you a team director position starting next season. It's recognition of your career — but you could still race for 3-4 more seasons. Staying means chasing the wins still missing from your palmares.",
   choices:[
     {label:tf('pivotRetireAccept',"Accepter — finir sur un rôle de mentor"), labelEN:"Accept — finish as a mentor figure",
      effect:(r)=>{
        r.careerFlags.earlyRetirement = r.season;
        r.isMentor = true;
        r.reputation = Math.min(100, r.reputation + 8);
        addJournalEntry(r, tf('pivotRetireAcceptLog',"Tu as accepté la transition. Le peloton te voit désormais comme une figure tutélaire."));
      }},
     {label:tf('pivotRetireDecline',"Refuser — continuer à courir"), labelEN:"Decline — keep racing",
      effect:(r)=>{
        r.careerFlags.refusedRetirement = r.season;
        r.careerFlags.hungerBonus = r.season; // bonus de motivation pour 2 saisons
        addJournalEntry(r, tf('pivotRetireDeclineLog',"Tu as refusé de raccrocher. Il te reste des batailles à mener."));
      }},
   ]},
];
