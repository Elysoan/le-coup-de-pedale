function renderSeasonSetupScreen(keepScroll){
  if(STATE) STATE._screen='seasonsetup';
  const r = STATE.rider;
  if(!STATE.pendingSetup){
    const _isS1 = r.season === 1;
    /* Un mentor renonce aux objectifs et défis de saison (promesse faite à l'écran de
       bascule mentor) — on le reflète ici en figeant ces deux champs plutôt que de
       simplement les laisser au joueur avec une valeur par défaut modifiable. */
    STATE.pendingSetup = {focus:null, stage:'aucun', objective:r.isMentor?'aucun':(_isS1?'survive':'aucun'), sponsorIdx:'skip', challengeAccept:r.isMentor?false:!_isS1, careerCapChoice:null};
    STATE._capConfirmed = false;
  }
  const setup = STATE.pendingSetup;
  const hasSponsor = !!r.sponsor;
  if(!hasSponsor && !STATE.sponsorOffers) STATE.sponsorOffers = generateSponsorOffers(r);
  if(!r.isMentor && !STATE.sideChallenge) STATE.sideChallenge = SIDE_CHALLENGES[Math.floor(Math.random()*SIDE_CHALLENGES.length)];
  const challenge = STATE.sideChallenge;

  const chip = (label, active, onclick) => `<span class="chip ${active?'active':''}" onclick="${onclick}">${label}</span>`;
  const lang = SETTINGS.lang;

  const focusChips = STAT_KEYS.map(k=>chip(`${STAT_ICONS[k]} ${STAT_LABELS[k]}`, setup.focus===k, `setSeasonSetup('focus','${k}')`)).join('');
  const stageChips = STAT_KEYS.map(k=>chip(`${STAT_ICONS[k]}`, setup.stage===k, `setSeasonSetup('stage','${k}')`)).join('') + chip(tf('none','Aucun'), setup.stage==='aucun', `setSeasonSetup('stage','aucun')`);

  const objectiveRows = availableObjectives(r).map(o=>{
    const label = (lang==='en' && o.labelEN) ? o.labelEN : o.label;
    const desc = (lang==='en' && o.descEN) ? o.descEN : o.desc;
    const sevLabel = o.severity===3 ? `<span class="pill diff-4" style="font-size:0.7em;">${tf('objMajor','Majeur')}</span>` :
                     o.severity===2 ? `<span class="pill diff-2" style="font-size:0.7em;">${tf('objMid','Intermédiaire')}</span>` :
                     o.severity===1 ? `<span class="pill diff-1" style="font-size:0.7em;">${tf('objMinor','Mineur')}</span>` : '';
    return `<div class="row-item ${setup.objective===o.id?'active':''}" onclick="setSeasonSetup('objective','${o.id}')">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;">
        <div><strong>${o.icon} ${label}</strong><p class="small" style="margin:2px 0 0;">${desc}</p></div>
        ${sevLabel}
      </div>
    </div>`;
  }).join('');

  let sponsorHTML;
  if(hasSponsor){
    sponsorHTML = `<p class="small">${r.sponsor.icon} ${tf('alreadySponsored','Déjà sous contrat avec')} <strong>${r.sponsor.name}</strong> (${r.sponsor.seasonsLeft} ${tf(r.sponsor.seasonsLeft>1?'seasonsLeftP':'seasonsLeft','saison'+(r.sponsor.seasonsLeft>1?'s':'')+' restante'+(r.sponsor.seasonsLeft>1?'s':''))}).</p>`;
  } else {
    sponsorHTML = STATE.sponsorOffers.map((o,i)=>`<div class="row-item ${setup.sponsorIdx===i?'active':''}" onclick="setSeasonSetup('sponsorIdx',${i})">
        <div><strong>${o.icon} ${o.name}</strong> <span class="small">(${o.personality==='exigeant'?tf('demanding','exigeant'):tf('loyal','fidèle')})</span></div>
        <span class="pill">${o.pay.toLocaleString('fr-FR')}€</span>
      </div>`).join('') + `<div class="row-item ${setup.sponsorIdx==='skip'?'active':''}" onclick="setSeasonSetup('sponsorIdx','skip')"><span>${tf('noSponsorThisSeason','Pas de sponsor cette saison')}</span></div>`;
  }

  /* --- Messages d'introduction contextuels --- */
  const _isS1 = r.season === 1;
  const _isS2 = r.season === 2;
  const _isS3 = r.season === 3;
  const _lang = SETTINGS.lang === 'en';

  const _startTeamName = currentTeam(r).name;
  const s1WelcomeHTML = _isS1 ? `<div class="card" style="border-left:4px solid var(--pink);background:var(--pink-light,#FFF0F5);">
    <p style="font-weight:700;margin:0 0 6px;">${_lang ? '🚴 Your first professional season' : '🚴 Ta première saison professionnelle'}</p>
    <p class="small" style="margin:0;">${_lang
      ? `You've just signed your first pro contract with ${_startTeamName}. No pressure — this season is about learning the ropes. Choose a cautious objective, build your calendar around accessible races, and see how it feels.`
      : `Tu viens de signer ton premier contrat pro avec ${_startTeamName}. Pas de pression — cette saison, l'essentiel est de prendre tes marques. Choisis un objectif prudent, construis ton calendrier avec des courses accessibles, et ressens comment tout ça fonctionne.`
    }</p>
  </div>` : '';

  const s2StageIntroHTML = _isS2 ? `<div class="card" style="border-left:4px solid var(--blue);background:var(--blue-light);margin-bottom:0;">
    <p style="font-weight:700;margin:0 0 4px;">🏕️ ${_lang ? 'New this season: training camp' : 'Nouveau cette saison : le stage de préparation'}</p>
    <p class="small" style="margin:0;">${_lang
      ? "After a full season, you know your strengths. A training camp lets you sharpen one quality before the season starts — at the cost of a slight dip in another."
      : "Après une saison complète, tu connais tes points forts. Un stage te permet d'affûter une qualité avant le coup d'envoi — au léger détriment d'une autre."
    }</p>
  </div>` : '';

  const s2SponsorIntroHTML = _isS2 ? `<div class="card" style="border-left:4px solid var(--yellow);background:var(--yellow-light);margin-bottom:0;">
    <p style="font-weight:700;margin:0 0 4px;">🤝 ${_lang ? 'New this season: personal sponsor' : 'Nouveau cette saison : le sponsor personnel'}</p>
    <p class="small" style="margin:0;">${_lang
      ? "Your first results have attracted attention. Brands are now approaching you for sponsorship deals — extra income on top of your team salary. The demanding sponsor pays more, but drops you without at least one podium."
      : "Tes premiers résultats ont attiré des regards. Des marques te sollicitent maintenant pour des contrats de sponsoring — un revenu complémentaire en plus de ton salaire d'équipe. Le sponsor exigeant paie mieux, mais te lâche sans au moins un podium."
    }</p>
  </div>` : '';

  const s3CapIntroHTML = _isS3 && !r.careerCap ? `<div class="card" style="border-left:4px solid var(--yellow);background:var(--yellow-light);margin-bottom:0;">
    <p style="font-weight:700;margin:0 0 4px;">🚩 ${_lang ? 'New this season: career milestone' : 'Nouveau cette saison : le cap de carrière'}</p>
    <p class="small" style="margin:0;">${_lang
      ? "Two seasons in, you have a clearer picture of where you're heading. Set yourself an ambitious multi-season goal — if you hit it in time, you earn a real reputation bonus. Totally optional."
      : "Deux saisons au compteur, tu vois mieux où tu vas. Fixe-toi un objectif ambitieux sur plusieurs saisons — si tu l'atteins dans les temps, tu décroches un vrai bonus de réputation. Entièrement optionnel."
    }</p>
  </div>` : '';

  const calendarS1TipHTML = _isS1 ? `<div style="background:var(--blue-light);border-radius:8px;padding:8px 12px;margin-bottom:8px;">
    <p class="small" style="margin:0;color:var(--blue);">💡 ${_lang
      ? "Tip: start with 3–4 accessible races (green/yellow difficulty). The 🧘 Calm automatic calendar is a good starting point."
      : "Astuce : commence par 3-4 courses accessibles (difficulté vert/jaune). Le calendrier automatique 🧘 Pépère est une bonne base de départ."
    }</p>
  </div>` : '';

  setHTML(`
    ${heroHTML(`🚀 ${tf('prepareSeason','Préparer la saison')} ${r.season}`)}
    ${riderHeaderHTML()}
    ${trophyBannerHTML()}
    ${s1WelcomeHTML}
    <div class="card">
      <h3>⭐ ${tf('seasonPriority','Priorité de saison')}${helpBtn('help-priority',r.season)}</h3>${helpBox('help-priority','Choisir une qualité à développer en priorité cette saison. Cela influence tes chances sur les courses adaptées à ce profil — un grimpeur qui entraîne la montagne sera plus efficace dans les cols.',"Choose a quality to develop as a priority this season. It influences your odds on adapted races — a climber training in the mountains will be more effective on climbs.",r.season)}
      <div class="chip-row">${focusChips}</div>
    </div>
    ${!_isS1 ? `<div class="card">
      <h3>🏕️ ${tf('trainingCamp','Stage de préparation')}${helpBtn('help-camp',r.season)}</h3>${helpBox('help-camp','Optionnel. Un stage booste légèrement une qualité avant la saison, au détriment d\'une autre — et coûte un peu de fatigue dès le départ. Si tu n\'as pas de besoin précis, \'Aucun\' est un choix tout à fait valide.','Optional. A training camp slightly boosts one quality before the season, at the expense of another — and costs a bit of fatigue right from the start. If you have no specific need, \'None\' is perfectly fine.',r.season)}
      ${s2StageIntroHTML}
      <p class="small" style="margin-top:${_isS2?'8':'0'}px;">${tf('trainingCampDesc',"Optionnel — booste une qualité, léger recul d'une autre, et un peu de fatigue en plus au moment d'entamer la saison.")}</p>
      <div class="chip-row">${stageChips}</div>
    </div>` : ''}
    <div class="card">
      <h3>🎯 ${tf('seasonObjective','Objectif de saison')}${helpBtn('help-obj',r.season)}</h3>${helpBox('help-obj','L\'équipe te fixe un contrat moral pour la saison. Si tu le rates : perte de réputation, baisse de la confiance de l\'équipe, et pour un objectif Majeur, ton contrat peut être raccourci d\'une saison. Choisis en fonction de ton niveau réel.','The team sets a moral contract for the season. Miss it and you lose reputation, team confidence drops, and a Major objective failure can shorten your contract by a season. Choose according to your actual level.',r.season)}
      ${r.isMentor ? `<p class="small" style="color:var(--text-soft);">🧑‍🏫 ${tf('mentorNoObjective',"En tant que mentor, tu ne poursuis plus d'objectif de saison personnel.")}</p>` : objectiveRows}
    </div>
    ${!_isS1 ? `<div class="card">
      <h3>🤝 ${tf('personalSponsor','Sponsor personnel')}${helpBtn('help-sponsor',r.season)}</h3>${helpBox('help-sponsor','Revenu complémentaire en plus de ton salaire d\'équipe. Le sponsor Exigeant paie mieux mais te lâche si tu n\'as pas au moins un podium dans la saison. Le sponsor Fidèle est moins généreux mais reste quoi qu\'il arrive.','Extra income on top of your team salary. The Demanding sponsor pays more but drops you without at least one podium in the season. The Loyal sponsor is less generous but stays regardless.',r.season)}
      ${s2SponsorIntroHTML}
      <div style="margin-top:${_isS2?'8':'0'}px;">${sponsorHTML}</div>
    </div>` : ''}
    <div class="card">
      <h3>🎲 ${tf('seasonChallenge','Défi de la saison')}${helpBtn('help-challenge',r.season)}</h3>${helpBox('help-challenge','Contrainte optionnelle qui t\'offre un bonus de fin de saison si tu la relèves. Tu peux l\'ignorer sans aucune pénalité — c\'est un extra, pas une obligation.','An optional constraint that earns you a season-end bonus if completed. You can ignore it without any penalty — it\'s a bonus, not an obligation.',r.season)}
      ${r.isMentor ? `<p class="small" style="color:var(--text-soft);">🧑‍🏫 ${tf('mentorNoChallenge',"En tant que mentor, tu ne relèves plus de défi de saison.")}</p>` : `
      <div class="row-item ${setup.challengeAccept?'active':''}" onclick="setSeasonSetup('challengeAccept',true)">
        <span>${challenge.icon} ${(lang==='en' && challenge.labelEN) ? challenge.labelEN : challenge.label}</span>
        <span class="pill">${challenge.reward.money?`💰 ${challenge.reward.money}€`:''}${challenge.reward.reputation?`⭐ +${challenge.reward.reputation}`:''}</span>
      </div>
      <div class="row-item ${!setup.challengeAccept?'active':''}" onclick="setSeasonSetup('challengeAccept',false)"><span>${tf('ignoreChallenge','Ignorer ce défi')}</span></div>
      `}
    </div>
    ${r.careerCap ? `<div class="card" style="border:1.5px solid var(--yellow);background:var(--yellow-light);">
      <h3>🚩 ${tf('careerCapActive','Cap de carrière en cours')}</h3>
      <p class="small">${CAREER_CAP_TYPES.find(c=>c.id===r.careerCap.type).icon} ${(lang==='en' && CAREER_CAP_TYPES.find(c=>c.id===r.careerCap.type).labelEN) ? CAREER_CAP_TYPES.find(c=>c.id===r.careerCap.type).labelEN : CAREER_CAP_TYPES.find(c=>c.id===r.careerCap.type).label} — ${tf('deadlineBy','à atteindre avant la fin de la saison')} ${r.careerCap.deadlineSeason}</p>
    </div>` : (!_isS1 && !_isS2) ? `<div class="card">
      <h3>🚩 ${tf('careerCapTitle','Cap de carrière')} <span class="small">(${tf('optional','optionnel')})</span></h3>
      ${s3CapIntroHTML}
      <p class="small" style="margin-top:${_isS3?'8':'0'}px;">${tf('careerCapDesc',"Fixe-toi un objectif ambitieux sur plusieurs saisons — récompensé par un vrai bonus de réputation s'il est atteint à temps.")}</p>
      ${CAREER_CAP_TYPES.map(c=>`<div class="row-item ${setup.careerCapChoice===c.id?'active':''}" onclick="setSeasonSetup('careerCapChoice','${c.id}')">
        <div><strong>${c.icon} ${(lang==='en' && c.labelEN) ? c.labelEN : c.label}</strong><p class="small" style="margin:2px 0 0;">${c.years} ${tf('seasonsBareLower','saisons')}</p></div>
      </div>`).join('')}
      <div class="row-item ${!setup.careerCapChoice?'active':''}" onclick="setSeasonSetup('careerCapChoice',null)"><span>${tf('noCareerCap',"Pas de cap pour l'instant")}</span></div>
    </div>` : ''}
    ${(!r.careerCap && setup.careerCapChoice && STATE._capConfirmed) ? (()=>{
      const capDef = CAREER_CAP_TYPES.find(c=>c.id===setup.careerCapChoice);
      const capLabel = (lang==='en' && capDef.labelEN) ? capDef.labelEN : capDef.label;
      return `<div class="card" style="border:1.5px solid var(--yellow);background:var(--yellow-light);">
        <h3>🚩 ${tf('confirmCapTitle','Confirme ton engagement')}</h3>
        <p class="small">${tf('confirmCapDesc','Ce cap te suivra sur plusieurs saisons, jusqu\'à sa réussite ou sa date limite : ')}<strong>${capDef.icon} ${capLabel} — ${capDef.years} ${tf('seasonsBareLower','saisons')}</strong>.</p>
      </div>`;
    })() : ''}
    ${rivalsCardHTML()}
    <button class="btn" ${setup.focus?'':'disabled'} onclick="confirmSeasonSetup()">${(!r.careerCap && setup.careerCapChoice && STATE._capConfirmed) ? `🚩 ${tf('confirmAndStartSeason','Confirmer le cap et débuter la saison')}` : `✅ ${tf('validateStartSeason','Valider et débuter la saison')}`}</button>
  `, keepScroll);
}

function setSeasonSetup(field, value){
  STATE.pendingSetup[field] = value;
  if(field==='careerCapChoice') STATE._capConfirmed = false;
  renderSeasonSetupScreen(true);
}

function confirmSeasonSetup(){
  const setup = STATE.pendingSetup;
  if(!setup.focus) return;
  const r = STATE.rider;

  /* Un cap de carrière engage plusieurs saisons (3 à 5) une fois choisi — contrairement
     aux autres réglages de ce même écran, qui ne portent que sur la saison en cours. Plutôt
     qu'une confirm() native (bloquante, hors-style, et qui coince l'automatisation/le clavier
     comme les <select> système corrigés plus tôt), le bouton de validation devient un second
     bouton dédié tant que ce choix précis n'a pas été explicitement reconfirmé — cf.
     renderSeasonSetupScreen(). setSeasonSetup() réinitialise cette confirmation dès que le
     choix de cap change, pour ne jamais valider un cap différent de celui vraiment relu. */
  if(!r.careerCap && setup.careerCapChoice && !STATE._capConfirmed){
    STATE._capConfirmed = true;
    renderSeasonSetupScreen(true);
    return;
  }
  STATE._capConfirmed = false;

  STATE.trainingFocus = setup.focus;

  if(setup.stage !== 'aucun'){
    const key = setup.stage;
    r.stats[key] = clamp(r.stats[key] + 4 + Math.random()*3, 8, 99);
    r.fatigue = clamp(r.fatigue + 8, 0, 100);
    const pair = STAGE_PAIRS[key];
    if(pair) r.stats[pair] = clamp(r.stats[pair] - (2+Math.random()*2), 8, 99);
  }

  STATE.seasonObjective = setup.objective;

  if(!r.sponsor && setup.sponsorIdx !== 'skip' && STATE.sponsorOffers[setup.sponsorIdx]){
    const o = STATE.sponsorOffers[setup.sponsorIdx];
    r.sponsor = {name:o.name, icon:o.icon, category:o.category, personality:o.personality, pay:o.pay, seasonsLeft:o.seasonsLeft};
  }
  STATE.sponsorOffers = null;

  STATE.sideChallengeActive = !!setup.challengeAccept;
  if(!setup.challengeAccept) STATE.sideChallenge = null;

  if(!r.careerCap && setup.careerCapChoice){
    const capDef = CAREER_CAP_TYPES.find(c=>c.id===setup.careerCapChoice);
    r.careerCap = {type:capDef.id, deadlineSeason: r.season + capDef.years - 1, startTeamChanges: r.teamChanges||0};
  }

  STATE.pendingSetup = null;

  STATE.seasonRacePool = pickRaceOffers();
  assignSeasonBuzz(STATE.seasonRacePool);
  const imposed = pickImposedRaces(r, STATE.trainingFocus, STATE.seasonRacePool);
  STATE.imposedRaceIds = imposed;
  STATE.selectedRaceIds = imposed.slice();
  STATE._calManualToggle = null; // repli du calendrier repart sur le défaut réactif chaque saison
  STATE._autoFillPendingProfile = null;
  /* Tirer et appliquer les world events APRÈS la constitution du pool (certains events
     modifient le pool lui-même, ex. course_annulee) */
  STATE._worldEventCancelledRace = null;
  const worldEvs = rollWorldEvents();
  applyWorldEvents(worldEvs);
  STATE.personalEventReturnTo = 'calendar';
  maybeShowPersonalEvent();
}
