/* ---- Calendrier / choix des courses ---- */

function selectedDaysTotal(){
  return STATE.selectedRaceIds.reduce((sum,id)=>{
    const race = STATE.seasonRacePool.find(r=>r.id===id);
    return sum + (race ? race.days : 0);
  }, 0);
}

/* Icônes des compétences sollicitées par une course, dérivées des focus de chacun de ses
   évènements — pour repérer d'un coup d'œil si une course convient à son profil. */
function toggleHelp(id){
  const el = document.getElementById(id);
  if(el) el.classList.toggle('open');
}

function helpBtn(id, season){
  if(season !== 1) return '';
  return ` <button class="help-btn" onclick="toggleHelp('${id}')" title="${tf('helpTooltip','Aide')}" aria-label="${tf('helpTooltip','Aide')}">❓</button>`;
}

function helpBox(id, textFR, textEN, season){
  if(season !== 1) return '';
  const txt = SETTINGS.lang==='en' ? textEN : textFR;
  return `<div class="help-box" id="${id}">${txt}</div>`;
}

/* ---- Tips contextuels "vus une fois" ----
   Contrairement à helpBox/helpBtn ci-dessus (aide de référence, disponible sur simple clic
   pendant toute la saison 1 seulement), ces tips s'affichent automatiquement la toute
   première fois qu'une mécanique se présente au joueur — quelle que soit la saison ou la
   carrière — puis disparaissent pour de bon une fois fermés (SESSION.tipsShown, persisté). */
function tipBox(id, textFR, textEN){
  if(SESSION.tipsShown[id]) return '';
  const txt = SETTINGS.lang==='en' ? textEN : textFR;
  return `<div class="tip-box" id="tip-${id}">💡 ${txt}<button class="tip-dismiss-btn" onclick="dismissTip('${id}')" title="${tf('gotIt','Compris')}" aria-label="${tf('gotIt','Compris')}">✕</button></div>`;
}
function dismissTip(id){
  SESSION.tipsShown[id] = true;
  saveGame();
  const el = document.getElementById('tip-'+id);
  if(el) el.remove();
}


/* ---- Forme prévisionnelle (lecture, pas une nouvelle décision) ----
   Le calendrier se construit entièrement en amont de la saison — pas de gestion
   hebdomadaire possible une fois lancée. Plutôt qu'un système de forme à piloter,
   ceci est une simple lecture calculée à partir du calendrier déjà en train d'être
   construit : y a-t-il un vrai relâchement avant la course la plus exigeante, ou
   est-elle abordée en plein bloc de charge ? Recalculé à chaque ajustement. */
function calendarFormeInsight(){
  const sel = STATE.selectedRaceIds.map(id=>STATE.seasonRacePool.find(r=>r.id===id)).filter(Boolean).sort((a,b)=>a.month-b.month);
  if(sel.length < 2) return null;
  const maxPrestige = Math.max(...sel.map(r=>r.prestige));
  if(maxPrestige < 4) return null; // pas de vraie course-objectif identifiable cette saison
  const pointRace = sel.find(r=>r.prestige===maxPrestige);
  const idx = sel.indexOf(pointRace);
  const prevRace = idx > 0 ? sel[idx-1] : null;
  const gapMonths = prevRace ? (pointRace.month - prevRace.month) : (pointRace.month - 1);
  // Charge cumulée dans les 2 mois précédant l'objectif : un bloc dense juste avant
  // pèse sur la forme, même si un mois de repos existe plus loin en amont.
  const loadDays = sel.filter(r=>r!==pointRace && r.month >= pointRace.month-2 && r.month < pointRace.month)
    .reduce((s,r)=>s+r.days, 0);
  /* Jours cumulés avant l'objectif : au-delà de 45 (même seuil de surcharge que applyFatigue),
     chaque jour pèse davantage — une mauvaise récupération (stat recuperation) amplifie cet effet. */
  const daysBeforeGoal = sel.filter(r=>r!==pointRace && r.month < pointRace.month).reduce((s,r)=>s+r.days,0);
  const recupFactor = clamp(1.5 - STATE.rider.stats.recuperation/100, 0.5, 1.5);
  const overloadPenalty = Math.max(0, daysBeforeGoal-45) * recupFactor;
  const score = Math.round(clamp(50 + Math.min(gapMonths,3)*15 - Math.max(0, loadDays-8)*1.5*recupFactor - overloadPenalty, 15, 95));
  return {pointRace, score};
}

function renderCalendarScreen(keepScroll){
  if(STATE) STATE._screen='calendar';
  if(!keepScroll) STATE._calendarBlockNote = null;
  const r = STATE.rider;
  const olympicNote = isOlympicSeason(r)
    ? (STATE.seasonRacePool.some(race=>race.olympic)
        ? `<div class="card" style="border:1.5px solid var(--yellow);background:var(--yellow-light);"><p style="margin:0;"><strong>🥇 ${tf('olympicSelected','Sélectionné aux Jeux Panhelléniques !')}</strong> ${tf('olympicSelectedDesc',"Ta fédération t'a retenu parmi les rares dossards disponibles cette saison — un vrai accomplissement.")}</p></div>`
        : `<div class="card"><p style="margin:0;" class="small">🥇 ${tf('olympicNotSelected',"Année olympique, mais ta fédération ne t'a pas retenu cette fois")} (${tf('currentRep','réputation actuelle')} : ${Math.round(r.reputation)}${(r.olympicSelections||0)===0?tf('firstSelectionHard',', et une première sélection est particulièrement exigeante'):''}). ${tf('maybeIn4Years','Peut-être dans 4 ans.')}</p></div>`)
    : '';

  const daysTotal = selectedDaysTotal();
  const raceCount = STATE.selectedRaceIds.length;
  const imposedCount = STATE.imposedRaceIds.length;
  const under40 = daysTotal < 40;
  const over45 = daysTotal > 45;
  const over65 = daysTotal > 65;
  const daysColor = over65 ? 'var(--red)' : under40 ? 'var(--red)' : over45 ? 'var(--warn)' : 'var(--green-dark)';
  const gtSelected = STATE.selectedRaceIds.filter(id=>{ const rc=STATE.seasonRacePool.find(r=>r.id===id); return rc&&rc.type==='grandtour'; }).length;

  const pool = STATE.seasonRacePool.slice().sort((a,b)=>a.month-b.month);

  // Grouper par mois
  const byMonth = {};
  pool.forEach(race=>{
    if(!byMonth[race.month]) byMonth[race.month] = [];
    byMonth[race.month].push(race);
  });

  /* Repli par défaut : un mois sans aucune course sélectionnée (ni imposée) reste replié
     à l'ouverture de l'écran, pour limiter le défilement initial sur une saison à 12 mois —
     chaque en-tête reste visible avec son compte X/Y, un clic suffit à déplier. Ce défaut est
     réactif (recalculé à chaque rendu à partir des sélections réelles), pas figé une fois pour
     toutes : un mois nouvellement rempli via le remplissage automatique s'ouvre tout seul.
     _calManualToggle ne mémorise que les mois où le joueur a explicitement inversé ce défaut. */
  const defaultCollapsedMonths = calendarDefaultCollapsedMonths();
  if(!STATE._calManualToggle) STATE._calManualToggle = new Set();

  const rows = Object.keys(byMonth).map(m=>{
    m = parseInt(m);
    const monthRaces = byMonth[m];
    const selInMonth = monthRaces.filter(rc=>STATE.selectedRaceIds.includes(rc.id)).length;
    const totalInMonth = monthRaces.filter(rc=>!rc.locked).length;
    const isCollapsed = STATE._calManualToggle.has(m) ? !defaultCollapsedMonths.has(m) : defaultCollapsedMonths.has(m);

    const monthHeader = `<div onclick="toggleCalMonth(${m})" style="display:flex;justify-content:space-between;align-items:center;cursor:pointer;padding:8px 4px 4px;"><p class="small" style="font-weight:700;margin:0;color:var(--text-soft);">${MONTHS[m].toUpperCase()}</p><span class="small" style="color:var(--text-soft);">${selInMonth}/${totalInMonth} ${isCollapsed?'▶':'▼'}</span></div>`;

    if(isCollapsed) return monthHeader;

    const raceItems = monthRaces.map(race=>{
      const isImposed = STATE.imposedRaceIds.includes(race.id);
      const isSelected = STATE.selectedRaceIds.includes(race.id);
      const diff = difficultyForRace(race, r);
      const rv = (STATE.rivals||[]).filter(rv=>(rv.raceIds||[]).includes(race.id));
      /* Orange plutôt que rouge : une course imposée par l'équipe est une contrainte
         neutre, pas un signal négatif — le rouge reste réservé aux vraies alertes
         (fatigue, abandon). Cohérent avec le "Mode défi", qui utilise déjà l'orange
         pour signaler une contrainte imposée au joueur. */
      const borderStyle = isImposed ? 'border-left:3px solid var(--orange);' : isSelected ? 'border-left:3px solid var(--green-dark);' : '';
      const lockInfo = race.locked ? `<span class="pill" style="border-color:var(--text-soft);color:var(--text-soft);font-size:0.7em;">${race.lockReason==='continental' ? tf('lockReasonContinental','Équipe trop petite') : race.lockReason==='confidence' ? tf('lockReasonConfidence','Confiance insuffisante') : tf('locked','Verrouillée')}</span>` : '';
      const imposedBadge = isImposed ? `<span class="pill" style="border-color:var(--orange);color:var(--orange);font-size:0.7em;">${tf('imposedByTeamPill','Imposée')}</span>` : '';
      const rivalBadge = rv.length ? ` <span style="color:var(--blue);font-size:0.8em;font-weight:600;">🥊 ${rv.map(x=>x.name.split(' ')[0]).join(', ')}</span>` : '';
      const styleMatch = r.styleId && raceMatchesStyle(race, r.styleId);
      const styleBadge = styleMatch ? ` <span style="color:var(--green-dark);font-size:0.85em;">⭐</span>` : '';
      const isSignature = r.signatureRaceId && race.id === r.signatureRaceId;
      const signatureBadge = isSignature ? ` <span style="color:var(--pink);font-size:0.85em;">❤️</span>` : '';
      const buzzBadge = race.buzz ? ` <span title="${tf('buzzRaceTooltip','Course très suivie : réputation gagnée ou perdue amplifiée')}" style="color:var(--warn);font-size:0.85em;">📣</span>` : '';
      const clickable = !isImposed && !race.locked;
      const opacity = race.locked ? 'opacity:0.45;' : '';
      return `<div class="race-item" style="cursor:${clickable?'pointer':'default'};${borderStyle}${opacity}" ${clickable?`onclick="toggleRace('${race.id}')"`:''}><div style="flex:1;"><strong>${race.flag?race.flag+' ':''}${race.name}</strong>${styleBadge}${signatureBadge}${buzzBadge}${rivalBadge}<p class="small" style="margin:2px 0 0;">${race.days} ${tf('daysAbbr','j')} · ${'★'.repeat(race.prestige)} · ${raceFocusIcons(race)} ${imposedBadge}${lockInfo}</p></div><div style="text-align:right;min-width:70px;">${badgeHTML(race.type)}<p class="small ${diff.cls}" style="margin:4px 0 0;font-weight:600;">${diff.label}</p></div></div>`;
    }).join('');

    return monthHeader + raceItems;
  }).join('');

  const warnUnder = under40 ? `<p id="cal-warn-under" class="small" style="color:var(--red);margin:2px 0 0;">🛑 ${tf('minDays40','Minimum 40 jours de course requis.')}</p>` : '';
  const warnFatigue = over45 && !over65 ? `<p class="small" style="color:var(--warn);margin:2px 0 0;">⚠️ ${tf('fatigueWarning','Au-delà de 45 jours, la fatigue s\'accumule nettement plus vite sur le reste de la saison.')}</p>` : '';
  const warnOver = over65 ? `<p id="cal-warn-over" class="small" style="color:var(--red);margin:2px 0 0;">🛑 ${tf('exceeds65','Dépasse 65 j')}</p>` : '';

  /* ---- Alerte calendrier intelligente ---- */
  const _sel = STATE.selectedRaceIds;
  const _pool = STATE.seasonRacePool;
  const _smartWarns = [];
  const _lang = SETTINGS.lang === 'en';
  // Détecter GT + monument dans le même mois ou mois consécutifs
  const _gtMonths = _sel.map(id=>{ const rc=_pool.find(r=>r.id===id); return rc&&rc.type==='grandtour'?rc.month:null; }).filter(Boolean);
  const _monMonths = _sel.map(id=>{ const rc=_pool.find(r=>r.id===id); return rc&&rc.type==='monument'?rc.month:null; }).filter(Boolean);
  const _hasGTMonCombo = _gtMonths.some(gm=>_monMonths.some(mm=>Math.abs(mm-gm)<=1));
  if(_hasGTMonCombo) _smartWarns.push(_lang
    ? '🧠 A monument falls very close to a grand tour — your legs may suffer.'
    : '🧠 Un monument tombe très proche d\'un grand tour — tes jambes pourraient en souffrir.');
  // Détecter 3+ courses dans le même mois
  const _monthCounts = {};
  _sel.forEach(id=>{ const rc=_pool.find(r=>r.id===id); if(rc){ _monthCounts[rc.month]=(_monthCounts[rc.month]||0)+1; } });
  if(Object.values(_monthCounts).some(c=>c>=3)) _smartWarns.push(_lang
    ? '🧠 Three or more races in the same month — that\'s a very dense block.'
    : '🧠 Trois courses ou plus dans le même mois — c\'est un bloc très dense.');
  // Détecter 2 grands tours (avertissement doux si spécialiste)
  if(_gtMonths.length >= 2 && STATE.rider.trajectory === 'specialiste') _smartWarns.push(_lang
    ? '🧠 Two grand tours is unusual for a specialist — your focus races may suffer.'
    : '🧠 Deux grands tours, c\'est inhabituel pour un spécialiste — tes courses cibles pourraient en pâtir.');
  // Un spécialiste qui court plus de 8 courses dans la saison subit un malus de fatigue de 15% (cf. applyFatigue)
  if(STATE.rider.trajectory === 'specialiste' && _sel.length > 8) _smartWarns.push(_lang
    ? '🧠 More than 8 races is a lot for a specialist — a +15% fatigue penalty applies beyond that.'
    : '🧠 Plus de 8 courses, c\'est beaucoup pour un spécialiste — un malus de fatigue de 15% s\'applique au-delà.');
  const warnSmart = _smartWarns.length
    ? _smartWarns.map(w=>`<p class="small" style="color:var(--blue);margin:2px 0 0;">${w}</p>`).join('')
    : '';

  const _forme = calendarFormeInsight();
  const warnForme = _forme ? `<p class="small" style="color:${_forme.score>=70?'var(--green-dark)':_forme.score>=45?'var(--warn)':'var(--red)'};margin:2px 0 0;font-weight:700;">🎯 ${tf('formeForecast','Forme prévisionnelle pour')} ${_forme.pointRace.name} : ${_forme.score}/100</p>` : '';
  const hasBuzzRace = STATE.seasonRacePool.some(rc=>rc.buzz);
  const warnBuzz = hasBuzzRace ? `<p class="small" style="color:var(--warn);margin:2px 0 0;">📣 ${tf('buzzCalendarNote','Cette saison, une ou plusieurs courses sont très suivies (📣) : réputation amplifiée, en bien comme en mal.')}</p>` : '';
  const hasRivalRace = (STATE.rivals||[]).length>0 && STATE.seasonRacePool.some(rc=>(STATE.rivals||[]).some(rv=>(rv.raceIds||[]).includes(rc.id)));
  const tipRival = hasRivalRace ? tipBox('rival-calendar', "Le badge 🥊 signale une course où un de tes rivaux est présent : bats-le pour alimenter votre rivalité au fil des saisons.", tf('tipRivalCalendar')) : '';
  const tipBuzz = hasBuzzRace ? tipBox('buzz-calendar', "Le badge 📣 signale une course très suivie cette saison : ta réputation y est amplifiée, en bien comme en mal.", tf('tipBuzzCalendar')) : '';
  const tipForme = _forme ? tipBox('forme-calendar', "La \"forme prévisionnelle\" estime ta fraîcheur pour ta course la plus prestigieuse, en fonction du calendrier que tu es en train de construire — ajuste-le pour l'améliorer.", tf('tipFormeCalendar')) : '';

  setHTML(`
    ${riderHeaderHTML()}
    ${olympicNote}
    <div class="counter card" style="padding:10px 16px;">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <strong>📅 ${tf('prepareSeason','Préparer la saison')} ${r.season}</strong>
        <strong style="font-size:1.1rem;color:${daysColor};">${daysTotal} / 65 ${tf('daysAbbr','j')}</strong>
      </div>
      <div class="stat-track" style="margin-top:6px;"><div class="stat-fill" style="width:${Math.min(100, daysTotal/65*100)}%;background:${daysColor};"></div></div>
      <p class="small" style="margin:4px 0 0;">${raceCount} ${tf(raceCount>1?'racesP':'race','course'+(raceCount>1?'s':''))} · ${imposedCount} ${tf(imposedCount>1?'imposedByTeamP':'imposedByTeam','imposée'+(imposedCount>1?'s':'')+' par l\'équipe')} · ${gtSelected}/2 ${tf('grandToursAbbr','Grands Tours')}</p>
      ${STATE._calendarBlockNote ? `<p class="small" style="color:var(--red);font-weight:700;margin:4px 0 0;">🛑 ${STATE._calendarBlockNote}</p>` : ''}
      ${warnUnder}${warnFatigue}${warnOver}${warnForme}${warnBuzz}${warnSmart}
      <p class="small" style="margin:8px 0 4px;color:var(--text-soft);">${SETTINGS.lang==='en'?'Pre-fill your calendar automatically (optional — you can adjust after):':'Remplis automatiquement ton calendrier (facultatif — tu peux ajuster ensuite) :'}</p>
      ${STATE._autoFillPendingProfile ? `<p class="small" style="color:var(--warn);margin:2px 0 6px;font-weight:700;">⚠️ ${tf('autoFillConfirmWarning',"Clique à nouveau pour remplacer tes courses déjà sélectionnées.")}</p>` : ''}
      <div style="display:flex;gap:6px;">
        <button class="btn ${STATE._autoFillPendingProfile==='conservateur'?'':'ghost'}" style="flex:1;font-size:0.82rem;padding:6px 4px;" onclick="autoSelectCalendar('conservateur')" title="${SETTINGS.lang==='en'?'~40-46 days, safer races':'~40-46 j, courses plus sûres'}">🧘 ${STATE._autoFillPendingProfile==='conservateur'?tf('confirmQuestion','Confirmer ?'):(SETTINGS.lang==='en'?'Calm':'Pépère')}</button>
        <button class="btn ${STATE._autoFillPendingProfile==='equilibre'?'':'ghost'}" style="flex:1;font-size:0.82rem;padding:6px 4px;" onclick="autoSelectCalendar('equilibre')" title="${SETTINGS.lang==='en'?'~41-45 days, balanced':'~41-45 j, équilibré'}">⚖️ ${STATE._autoFillPendingProfile==='equilibre'?tf('confirmQuestion','Confirmer ?'):(SETTINGS.lang==='en'?'Balanced':'Équilibré')}</button>
        <button class="btn ${STATE._autoFillPendingProfile==='ambitieux'?'':'ghost'}" style="flex:1;font-size:0.82rem;padding:6px 4px;" onclick="autoSelectCalendar('ambitieux')" title="${SETTINGS.lang==='en'?'~47-58 days, high prestige':'~47-58 j, haut prestige'}">💪 ${STATE._autoFillPendingProfile==='ambitieux'?tf('confirmQuestion','Confirmer ?'):(SETTINGS.lang==='en'?'Ambitious':'Ambitieux')}</button>
      </div>
    </div>
    ${tipRival}${tipBuzz}${tipForme}
    <div style="display:flex;gap:6px;margin:8px 0 4px;">
      <button class="btn ghost" style="flex:1;font-size:0.78rem;padding:6px 4px;" onclick="expandAllCalMonths()">▼ ${tf('expandAllMonths','Tout déplier')}</button>
      <button class="btn ghost" style="flex:1;font-size:0.78rem;padding:6px 4px;" onclick="collapseAllCalMonths()">▲ ${tf('collapseAllMonths','Tout replier')}</button>
    </div>
    <div class="card" style="padding:8px 12px;">${rows}</div>
    <button class="btn" ${(over65||under40)?'disabled':''} ${under40?'aria-describedby="cal-warn-under"':(over65?'aria-describedby="cal-warn-over"':'')} onclick="confirmCalendar()">🚀 ${tf('startSeason','Lancer la saison')}</button>
    <button class="btn ghost" onclick="renderRaceAlmanac()">${tf('raceAlmanac','📖 Almanach des courses')}</button>
    ${(STATE.rider.seasonHistory&&STATE.rider.seasonHistory.length>0)?`<button class="btn ghost" onclick="renderSeasonHistory()">📜 ${SETTINGS.lang==='en'?'Season history':'Historique des saisons'}</button>`:''}
  `, keepScroll);
}
function calendarDefaultCollapsedMonths(){
  const byMonth = {};
  (STATE.seasonRacePool||[]).forEach(race=>{ (byMonth[race.month]=byMonth[race.month]||[]).push(race); });
  return new Set(Object.keys(byMonth).map(Number).filter(m=>!byMonth[m].some(rc=>STATE.selectedRaceIds.includes(rc.id))));
}
function toggleCalMonth(m){
  if(!STATE._calManualToggle) STATE._calManualToggle = new Set();
  if(STATE._calManualToggle.has(m)) STATE._calManualToggle.delete(m);
  else STATE._calManualToggle.add(m);
  renderCalendarScreen(true);
}
function expandAllCalMonths(){
  STATE._calManualToggle = calendarDefaultCollapsedMonths();
  renderCalendarScreen(true);
}
function collapseAllCalMonths(){
  const allMonths = new Set((STATE.seasonRacePool||[]).map(r=>r.month));
  const def = calendarDefaultCollapsedMonths();
  STATE._calManualToggle = new Set([...allMonths].filter(m=>!def.has(m)));
  renderCalendarScreen(true);
}

/* ---- Calendrier automatique ---- */
/* Construit un calendrier optimal selon un profil de charge (conservateur/equilibre/ambitieux).
   Respecte toutes les contraintes existantes (max 65j, max 2 GT, courses locked).
   Priorise : course signature, style matching, trajectoire, difficulté adaptée. */
function autoSelectCalendar(profile){
  /* Confirmation si le joueur a déjà une sélection manuelle — en deux temps dans le style
     du jeu plutôt qu'un confirm() natif (qui bloque le rendu et l'automatisation, cf. le
     cap de carrière plus haut) : le premier clic met CE bouton en attente de confirmation
     (les deux autres profils restent cliquables normalement, sans confirmation supplémentaire
     puisque rien n'a encore été remplacé), le second clic sur le même bouton valide vraiment. */
  const manualCount = STATE.selectedRaceIds.filter(id => !STATE.imposedRaceIds.includes(id)).length;
  if(manualCount > 0 && STATE._autoFillPendingProfile !== profile){
    STATE._autoFillPendingProfile = profile;
    renderCalendarScreen(true);
    return;
  }
  STATE._autoFillPendingProfile = null;
  const r = STATE.rider;
  const pool = STATE.seasonRacePool;
  const imposed = STATE.imposedRaceIds.slice();
  /* Le seuil de surcharge de fatigue se déclenche au-delà de 45 jours cumulés (cf.
     applyFatigue) : "équilibré" doit donc rester dans cette zone sûre plutôt que la
     dépasser systématiquement — seul "ambitieux" assume délibérément d'aller au-delà. */
  const targets = {conservateur:{min:40, max:46}, equilibre:{min:41, max:45}, ambitieux:{min:47, max:58}};
  const target = targets[profile] || targets.equilibre;

  // Partir des imposées
  let selected = imposed.slice();

  // Courses disponibles (non locked, non imposées)
  const available = pool.filter(rc => !rc.locked && !imposed.includes(rc.id));

  // Scorer chaque course (qualité intrinsèque + contexte carrière)
  function scoreRace(race){
    let s = 0;

    // --- Style et trajectoire ---
    if(r.styleId && raceMatchesStyle(race, r.styleId)) s += 20;
    if(r.signatureRaceId && race.id === r.signatureRaceId) s += 30;
    if(r.trajectory === 'specialiste' && r.styleId && raceMatchesStyle(race, r.styleId)) s += 15;
    if(r.trajectory === 'globetrotter') s += race.prestige * 2;
    if(r.trajectory === 'leader' && (race.type === 'grandtour' || race.type === 'monument')) s += 10;

    // --- Rôle contractuel ---
    const roleTypes = ROLE_RECOMMENDED_TYPES[r.role] || [];
    if(roleTypes.includes(race.type)) s += 12;

    // --- Progression selon la saison ---
    const season = r.season || 1;
    if(season <= 2){
      // Débutant : favoriser les courses accessibles, éviter les monumentaux
      if(race.prestige <= 2) s += 10;
      if(race.prestige >= 4) s -= 15;
    } else if(season <= 5){
      // En développement : montée en prestige progressive
      if(race.prestige === 3) s += 8;
      if(race.prestige === 4) s += 4;
    } else {
      // Confirmé : les grands rendez-vous sont prioritaires
      if(race.prestige >= 4) s += 12;
      if(race.prestige >= 5) s += 6; // cumulatif GT/monument top
    }

    // --- Niveau mondial ---
    if(r.worldRank <= 30 && race.prestige >= 4) s += 8;  // top30 : viser les grandes
    if(r.worldRank > 150 && race.prestige >= 4) s -= 10; // bas du classement : se concentrer sur l'accessible

    // --- Objectif de saison en cours ---
    const obj = STATE.seasonObjective;
    if(obj === 'monument' && (race.type === 'monument' || race.type === 'grandtour') && race.prestige >= 4) s += 20;
    if(obj === 'victoire' && race.prestige <= 3) s += 10; // viser des courses gagnables
    if(obj === 'etapes' && (race.type === 'grandtour' || race.type === 'semitour')) s += 15;
    if(obj === 'top10' && race.prestige >= 3) s += 8;
    if((obj === 'survive' || obj === 'solide') && race.prestige >= 4) s -= 8; // ne pas surcharger

    // --- Career cap actif ---
    const cap = r.careerCap && r.careerCap.type;
    if(cap === 'grandtour' && race.type === 'grandtour') s += 18;
    if(cap === 'monument' && race.type === 'monument') s += 18;
    if(cap === 'cinq-victoires' && race.prestige <= 3) s += 8; // viser des victoires gagnables
    if(cap === 'top20' && race.prestige >= 3) s += 6; // accumuler des points de ranking

    // --- Palmarès : bonus si jamais couru, légère pénalité si déjà gagné ---
    const alreadyWon = r.palmares.some(p => p.raceId === race.id && p.tier === 'victoire');
    const neverRun = !r.palmares.some(p => p.raceId === race.id);
    if(neverRun && race.prestige >= 3) s += 6; // explorer de nouvelles courses
    if(alreadyWon && profile !== 'ambitieux') s -= 5; // inutile de ressortir une course déjà gagnée, sauf si ambitieux (défendre)

    // --- Difficulté adaptée ---
    const diff = difficultyForRace(race, r);
    if(diff.cls === 'diff-1' || diff.cls === 'diff-2') s += 8;
    else if(diff.cls === 'diff-3') s += 4;
    else if(diff.cls === 'diff-5') s -= 5;

    // --- Rival présent ---
    if((STATE.rivals||[]).some(rv=>(rv.raceIds||[]).includes(race.id))) s += 10;

    // --- Ajustements profil ---
    if(profile === 'ambitieux') s += race.prestige * 3;
    if(profile === 'conservateur') s -= race.days * 0.5;

    return s;
  }

  // Pré-scorer toutes les courses disponibles
  const scored = available.map(rc => ({rc, score: scoreRace(rc)}));

  // Calculer les jours déjà imposés par mois
  const monthDays = {};
  imposed.forEach(id => {
    const rc = pool.find(r => r.id === id);
    if(rc) monthDays[rc.month] = (monthDays[rc.month] || 0) + rc.days;
  });

  // Budget par mois : max 1 course longue (GT/semitour) ou 2 courtes par mois
  // On répartit sur ~10 mois actifs (fév-nov), avec un quota adapté au profil
  const maxDaysPerMonth = profile === 'conservateur' ? 7 : profile === 'ambitieux' ? 14 : 10;
  const maxRacesPerMonth = 2;

  let gtCount = selected.filter(id => { const rc = pool.find(r=>r.id===id); return rc && rc.type==='grandtour'; }).length;
  let daysTotal = selected.reduce((sum, id) => { const rc = pool.find(r=>r.id===id); return sum + (rc?rc.days:0); }, 0);
  const monthCount = {}; // nb de courses ajoutées par mois
  imposed.forEach(id => {
    const rc = pool.find(r=>r.id===id);
    if(rc) monthCount[rc.month] = (monthCount[rc.month]||0) + 1;
  });

  // Parcourir les mois dans l'ordre, prendre la meilleure course disponible
  // puis une 2e si la place le permet
  const months = [...new Set(available.map(rc => rc.month))].sort((a,b) => a-b);

  let passes = 0;
  while(daysTotal < target.min && passes < 3){
    passes++;
    for(const month of months){
      if(daysTotal >= target.max) break;
      const usedDaysThisMonth = (monthDays[month] || 0);
      const usedRacesThisMonth = (monthCount[month] || 0);
      // Quota mensuel déjà atteint ?
      if(usedDaysThisMonth >= maxDaysPerMonth) continue;
      if(usedRacesThisMonth >= maxRacesPerMonth) continue;

      // Meilleure course non encore sélectionnée dans ce mois
      const candidates = scored
        .filter(({rc}) => rc.month === month && !selected.includes(rc.id))
        .sort((a,b) => b.score - a.score);

      for(const {rc} of candidates){
        if(daysTotal + rc.days > 65) continue;
        if(rc.type === 'grandtour'){
          if(gtCount >= 2) continue;
          gtCount++;
        }
        // Vérifier que le mois ne dépasse pas les quotas après ajout
        if(usedDaysThisMonth + rc.days > maxDaysPerMonth && passes < 3) continue;
        selected.push(rc.id);
        daysTotal += rc.days;
        monthDays[month] = (monthDays[month]||0) + rc.days;
        monthCount[month] = (monthCount[month]||0) + 1;
        break; // une seule course par mois par passe
      }
    }
  }

  STATE.selectedRaceIds = selected;
  renderCalendarScreen(true);
}

function toggleRace(id){
  if(STATE.imposedRaceIds.includes(id)) return;
  const i = STATE.selectedRaceIds.indexOf(id);
  STATE._calendarBlockNote = null;
  if(i>=0){ STATE.selectedRaceIds.splice(i,1); }
  else {
    const race = STATE.seasonRacePool.find(r=>r.id===id);
    if(race.locked) return;
    /* Plafonds bloquants : jusqu'ici un simple "return" silencieux — la course cliquée
       avait l'air tout aussi sélectionnable que les autres, sans aucun signe qu'elle
       venait d'être refusée. On mémorise un message affiché au prochain rendu. */
    if(selectedDaysTotal() + race.days > 65){
      STATE._calendarBlockNote = tf('calendarCapDays','Impossible d\'ajouter cette course : le plafond de 65 jours de course dans la saison serait dépassé.');
      renderCalendarScreen(true);
      return;
    }
    if(race.type==='grandtour'){
      const gtCount = STATE.selectedRaceIds.filter(rid=>{
        const rr = STATE.seasonRacePool.find(r=>r.id===rid);
        return rr && rr.type==='grandtour';
      }).length;
      if(gtCount >= 2){
        STATE._calendarBlockNote = tf('calendarCapGT','Impossible d\'ajouter cette course : maximum 2 grands tours par saison.');
        renderCalendarScreen(true);
        return;
      }
    }
    STATE.selectedRaceIds.push(id);
  }
  STATE._autoFillPendingProfile = null; // la sélection change manuellement : la confirmation en attente n'a plus lieu d'être
  renderCalendarScreen(true);
}

function confirmCalendar(){
  const all = STATE.seasonRacePool;
  // runQueue = toutes les courses sélectionnées (imposées + libres), triées chronologiquement
  STATE.runQueue = STATE.selectedRaceIds.map(id=>all.find(r=>r.id===id)).filter(Boolean).sort((a,b)=>a.month-b.month);
  STATE.seasonTotalDays = STATE.runQueue.reduce((sum,r)=>sum+r.days,0);
  STATE.cumulativeDaysRaced = 0;
  /* Filet de rattrapage : si la fatigue grimpe trop malgré le calendrier choisi, le
     coureur peut annuler jusqu'à 2 courses à venir (hors imposées) sans pénalité —
     voir riderHeaderHTML() et renderCancelRaceScreen(). */
  STATE.freeCancelsRemaining = 2;
  STATE.seasonSummary = {repStart: STATE.rider.reputation, rankStart: STATE.rider.worldRank, ratingStart: globalRiderRating(STATE.rider.stats), statsStart: {...STATE.rider.stats}, results:[]};
  STATE.runRaceIdx = 0;
  STATE.lastRacedMonth = 0;
  beginRace();
}

/* ---- Annulation de course sans pénalité (fatigue élevée) ----
   Accessible dès que la fatigue dépasse 70 (même seuil que l'alerte déjà affichée dans
   riderHeaderHTML) : jusqu'à 2 courses à venir non imposées peuvent être retirées du
   calendrier sans forfait ni perte de réputation, pour souffler avant la suite de la
   saison sans passer par tout un système de gestion de forme. */
function renderCancelRaceScreen(){
  if(STATE) STATE._screen = 'cancelrace';
  const upcoming = (STATE.runQueue||[]).slice(STATE.runRaceIdx||0).filter(rc=>!STATE.imposedRaceIds.includes(rc.id));
  const remaining = STATE.freeCancelsRemaining || 0;
  setHTML(`
    ${heroHTML('🩹 '+tf('manageCalendarTitle','Gérer mon calendrier'), tf('manageCalendarDesc',"Ta fatigue est élevée. Tu peux annuler une course à venir sans pénalité (aucun forfait, aucune perte de réputation) pour souffler avant la suite de la saison."))}
    <p class="small center" style="margin:-6px 0 10px;">${remaining} ${tf(remaining>1?'cancelsLeftP':'cancelsLeft','annulation'+(remaining>1?'s':'')+' sans pénalité restante'+(remaining>1?'s':''))} ${tf('thisSeason','cette saison')}</p>
    <div class="card" style="padding:8px 12px;">
      ${upcoming.length ? upcoming.map(race=>`
        <div class="race-item" style="cursor:default;">
          <div><strong>${race.flag?race.flag+' ':''}${race.name}</strong><p class="small" style="margin:2px 0 0;">${MONTHS[race.month]} · ${race.days} ${tf('daysAbbr','j')}</p></div>
          ${remaining>0 ? `<button class="btn ghost" style="font-size:0.78rem;padding:6px 10px;" onclick="cancelUpcomingRace('${race.id}')">${tf('cancelNoPenalty','Annuler sans pénalité')}</button>` : ''}
        </div>
      `).join('') : `<p class="small center" style="padding:8px;">${tf('noCancelableRace',"Aucune course à venir que tu puisses annuler (les courses imposées par l'équipe restent obligatoires).")}</p>`}
    </div>
    <button class="btn ghost" onclick="${STATE.seasonRacePool ? 'renderCalendarScreen()' : 'renderMainMenu()'}">${tf('back','← Retour')}</button>
  `);
}

function cancelUpcomingRace(raceId){
  if((STATE.freeCancelsRemaining||0) <= 0) return;
  if(STATE.imposedRaceIds.includes(raceId)) return;
  const idx = STATE.runQueue.findIndex(rc=>rc.id===raceId);
  if(idx < (STATE.runRaceIdx||0)) return; // déjà courue ou en cours, rien à annuler
  const race = STATE.runQueue[idx];
  STATE.runQueue.splice(idx, 1);
  STATE.seasonTotalDays = Math.max(0, (STATE.seasonTotalDays||0) - race.days);
  const si = STATE.selectedRaceIds.indexOf(raceId);
  if(si>=0) STATE.selectedRaceIds.splice(si,1);
  STATE.freeCancelsRemaining--;
  addJournalEntry(STATE.rider, `🩹 ${tf('canceledRaceJournal','Calendrier allégé')} — "${race.name}" ${tf('canceledRaceJournalSuffix','annulée pour souffler, sans pénalité.')}`);
  renderCancelRaceScreen();
}

/* ---- Déroulé des courses ---- */

/* ---------- CONVALESCENCE ACTIVE ----------
   Remplace l'ancien forfait automatique et passif : un vrai choix de rythme de reprise,
   avec un compromis réel — suivre le protocole (sûr, régulier) ou pousser la reprise
   (peut accélérer nettement le retour, mais risque un revers qui la prolonge). */
function renderConvalescenceScreen(race){
  if(STATE) STATE._screen='convalescence';
  setHTML(`
    ${riderHeaderHTML()}
    <div class="card">
      <h1 class="h1-as-h2">🚑 ${tf('convalescence','Convalescence')}</h1>
      <p>${tf('convalescenceDesc','Encore en soins après la blessure — forfait sur')} « ${race.name} ». ${tf('convalescenceDesc2','Comment abordes-tu cette étape de la rééducation ?')}</p>
      <button class="btn ghost" onclick="convalescenceChoice('protocole')">🩺 ${tf('followProtocol','Suivre le protocole à la lettre')} <span class="small">(${tf('safeSteady','sûr, régulier')})</span></button>
      <button class="btn ghost" onclick="convalescenceChoice('pousser')">⚡ ${tf('pushRecovery','Pousser la reprise')} <span class="small">(${tf('pushRecoveryDesc','peut accélérer le retour, ou provoquer un revers')})</span></button>
    </div>
  `);
}
function convalescenceChoice(mode){
  const race = STATE.runQueue[STATE.runRaceIdx];
  const r = STATE.rider;
  let note;
  if(mode==='protocole'){
    STATE.injuryAbsenceRemaining--;
    r.fatigue = clamp(r.fatigue - 14, 0, 100);
    note = "Rééducation suivie sereinement, selon le protocole prévu.";
  } else if(Math.random() < 0.3){
    STATE.injuryAbsenceRemaining += 1;
    r.fatigue = clamp(r.fatigue - 4, 0, 100);
    note = "La reprise précipitée a été un revers — la convalescence se prolonge.";
  } else {
    STATE.injuryAbsenceRemaining = Math.max(0, STATE.injuryAbsenceRemaining - 2);
    r.fatigue = clamp(r.fatigue - 8, 0, 100);
    note = "Le pari d'une reprise accélérée a payé — retour plus rapide que prévu.";
  }
  r.teamConfidence = clamp(r.teamConfidence - 1, 0, 100);
  r.palmares.push({season:r.season, raceName:race.name, raceId:race.id, type:race.type, tier:'forfait'});
  STATE.seasonSummary.results.push({raceName:race.name, type:race.type, prestige:race.prestige, bestTier:'forfait', repGain:0,
    events:[{title:'Convalescence', choiceLabel:`🚑 ${note}`, risk:'sur', tier:'forfait', perf:0, trained:null}]});
  STATE.pendingBestPerf = null;
  renderRaceResult(race, 'forfait', 0, -1);
}
