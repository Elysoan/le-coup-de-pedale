function renderHallOfFame(){
  const top = topCareers(5);
  setHTML(`
    ${heroHTML(tf('hallOfFame','🏆 Palmarès des légendes'), tf('hallOfFameDesc',"Les 5 meilleures carrières jouées depuis l'ouverture de cette partie."))}
    ${top.length>0 ? `<p class="small" style="margin:-4px 0 12px;opacity:.75;">${tf('hallOfFameLengthNote',"Ce classement compare des totaux cumulés sur toute la carrière : à mérite égal, une longue carrière l'emporte presque toujours sur une carrière écourtée.")}</p>` : ''}
    ${top.length===0 ? `<div class="card center"><p>${tf('noCareerYet',"Aucune carrière enregistrée pour l'instant. Termine une carrière pour apparaître ici.")}</p></div>` :
      top.map((c,i)=>{
        const country = COUNTRIES.find(x=>x.code===c.countryCode);
        return `<div class="card">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <h2>#${i+1} · ${country?country.flag:''} ${c.name}</h2>
            <span class="pill">${c.wins} 🏆</span>
          </div>
          <p class="small">${STYLES.find(s=>s.id===c.styleId).name} · ${c.seasons} ${tf('seasonsBareLower','saisons')} · ${tf('retiredAtLower','retraite à')} ${c.retireAge} ${tf('yo','ans')} · ${c.finalTeam}</p>
          <p class="small">🌍 ${tf('bestRankLabel','Meilleur classement')} : <strong>${c.bestRank||'—'}${c.bestRank===1?tf('ordinalSt','er'):tf('ordinalTh','e')}</strong> · ⭐ ${tf('finalRepLabel','Réputation finale')} : <strong>${c.finalReputation}</strong></p>
          ${c.winsByType && Object.keys(c.winsByType).length > 0 ? `<p class="small">${Object.entries(c.winsByType).map(([t,n])=>`<span class="pill" style="margin-right:4px;">${n} ${t}</span>`).join('')}</p>` : ''}
          <p class="result-tier tier-podium">${legacyTitleText(c.title)}</p>
          ${c.challengeMode ? `<p class="small" style="margin-top:4px;">${c.challengeResult==='success'?tf('challengeAchieved','✅ Défi relevé !'):tf('challengeFailed','❌ Défi échoué')} — <em>${(c.challengeObjId && challengeObjLabelFor(c.challengeObjId)) || c.challengeObjLabel || ''}</em></p>` : ''}
        </div>`;
      }).join('')
    }
    <button class="btn ghost" onclick="renderMainMenu()">${tf('back','← Retour')}</button>
  `);
}

function setAlmanacFilter(f){ ALMANAC_FILTER = f; renderRaceAlmanac(); }
function setAlmanacScope(s){ ALMANAC_SCOPE = s; renderRaceAlmanac(); }

function renderRaceAlmanac(){
  if(STATE) STATE._screen = 'racealmanac';
  const r = STATE ? STATE.rider : null;
  /* Accessible depuis le menu principal même sans carrière en cours (l'Almanach de
     légende ne dépend que des records globaux) — mais sans coureur actif, le scope
     "Cette carrière" n'a rien à montrer : on retombe sur "légende" dans ce cas. */
  const races = RACES_DATA().slice().sort((a,b)=>a.month-b.month);
  const isLegend = ALMANAC_SCOPE==='legend' || !r;
  const bestByRace = {};
  if(isLegend){
    races.forEach(race=>{ if(RACE_RECORDS[race.id]) bestByRace[race.id] = RACE_RECORDS[race.id]; });
  } else {
    (r.palmares||[]).forEach(p=>{
      if(!bestByRace[p.raceId] || TIER_VALUE[p.tier] > TIER_VALUE[bestByRace[p.raceId].tier]) bestByRace[p.raceId] = p;
    });
  }
  const racedCount = Object.keys(bestByRace).length;
  const filteredRaces = races.filter(race=>{
    if(ALMANAC_FILTER==='raced') return !!bestByRace[race.id];
    if(ALMANAC_FILTER==='unraced') return !bestByRace[race.id];
    return true;
  });
  const filterChip = (id, label) => `<span class="chip ${ALMANAC_FILTER===id?'active':''}" onclick="setAlmanacFilter('${id}')">${label}</span>`;
  const scopeChip = (id, label) => `<span class="chip ${ALMANAC_SCOPE===id?'active':''}" onclick="setAlmanacScope('${id}')">${label}</span>`;
  const rows = filteredRaces.length ? filteredRaces.map(race=>{
    const best = bestByRace[race.id];
    return `<div class="race-item" style="cursor:default;">
      <div>
        <strong>${race.flag} ${race.name}</strong>
        <p class="small" style="margin:2px 0 0;">${MONTHS[race.month]} · ${'★'.repeat(race.prestige)}</p>
      </div>
      <div style="text-align:right;min-width:100px;">
        ${badgeHTML(race.type)}
        <p class="small ${best?tierClass(best.tier):''}" style="margin:4px 0 0;font-weight:700;">${best?TIER_LABEL[best.tier]:tf('neverRaced','Jamais courue')}</p>
        ${isLegend && best ? `<p class="small" style="margin:2px 0 0;opacity:.7;">${best.riderName}</p>` : ''}
      </div>
    </div>`;
  }).join('') : `<p class="small center" style="padding:8px;">${tf('almanacFilterEmpty','Aucune course ne correspond à ce filtre.')}</p>`;
  setHTML(`
    ${heroHTML(tf('raceAlmanacTitle','Almanach des courses'), isLegend ? tf('almanacDescLegend',"Le meilleur résultat jamais obtenu sur chacune des 63 courses, toutes carrières confondues.") : tf('almanacDesc',"Ton historique personnel sur les 63 courses du jeu, cette carrière."))}
    <div class="chip-row" style="justify-content:center;margin-bottom:6px;">
      ${r ? scopeChip('career', tf('almanacScopeCareer','Cette carrière')) : ''}
      ${scopeChip('legend', '🏛️ '+tf('almanacScopeLegend','Almanach de légende'))}
    </div>
    <p class="small" style="margin:-6px 0 8px;text-align:center;">${racedCount} / ${races.length} ${tf('raced','courues')}</p>
    <div class="chip-row" style="justify-content:center;margin-bottom:10px;">
      ${filterChip('all', tf('almanacFilterAll','Toutes'))}
      ${filterChip('raced', tf('almanacFilterRaced','Courues'))}
      ${filterChip('unraced', tf('almanacFilterUnraced','Jamais courues'))}
    </div>
    <div class="card" style="padding:8px 12px;">${rows}</div>
    <button class="btn ghost" onclick="${STATE && STATE.seasonRacePool ? 'renderCalendarScreen()' : 'renderMainMenu()'}">${STATE && STATE.seasonRacePool ? tf('backToCalendar','← Retour au calendrier') : tf('back','← Retour')}</button>
  `);
}

/* ---------- COMPARATEUR DE CARRIÈRES ----------
   Vue d'ensemble de toutes les carrières jouées dans la session (pas seulement le top 5
   du Hall of Fame) : styles/pays essayés, moyennes, et la liste complète — pour donner
   une vraie perspective sur ses habitudes de jeu au fil des parties. */
function renderSeasonHistory(){
  if(STATE) STATE._screen = 'seasonhistory';
  const r = STATE.rider;
  const hist = (r.seasonHistory||[]).slice().reverse(); // plus récente en premier
  const lang = SETTINGS.lang === 'en';
  const rows = hist.length === 0
    ? `<p class="small" style="color:var(--text-soft);">${lang ? 'No seasons completed yet.' : 'Aucune saison terminée pour le moment.'}</p>`
    : hist.map(h => {
        const repColor = h.rep >= 60 ? 'var(--green-dark)' : h.rep >= 30 ? 'var(--text)' : 'var(--red)';
        const rankStr = h.worldRank ? `🌍 ${h.worldRank}${lang ? 'th' : 'e'}` : '';
        return `<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--line);">
          <div>
            <strong>${lang ? 'Season' : 'Saison'} ${h.season}</strong>
            <p class="small" style="margin:2px 0 0;color:var(--text-soft);">${h.teamName} · ${h.races} ${lang ? 'races' : 'courses'}</p>
          </div>
          <div style="text-align:right;">
            <p style="margin:0;font-weight:700;">🏆 ${h.wins} · 🥈 ${h.podiums}</p>
            <p class="small" style="margin:2px 0 0;color:${repColor};">⭐ ${h.rep} ${rankStr}</p>
          </div>
        </div>`;
      }).join('');

  setHTML(`
    ${riderHeaderHTML()}
    <div class="card">
      <h2>📜 ${lang ? 'Season history' : 'Historique des saisons'}</h2>
      <p class="small" style="margin:0;color:var(--text-soft);">${lang ? 'Your career, season after season.' : 'Ta carrière, saison après saison.'}</p>
    </div>
    <div class="card">${rows}</div>
    <button class="btn ghost" onclick="renderCalendarScreen()">← ${lang ? 'Back to calendar' : 'Retour au calendrier'}</button>
  `);
}

function renderTrophiesScreen(){
  const cats = [
    {key:'carriere', label:tf('careerTrophies','🏁 Trophées de carrière')},
    {key:'utilisation', label:tf('playerTrophies','🎮 Trophées du joueur')},
  ];
  const rareOnes = ACHIEVEMENTS.filter(a=>a.rare);
  const unlockLine = (id)=>{
    const info = UNLOCK_INFO[id];
    if(!info) return '';
    return `<p class="small" style="margin:4px 0 0;font-style:italic;">${tf('unlockedBy','Débloqué par')} ${info.riderName}, ${tf('season','Saison')} ${info.season}</p>`;
  };
  setHTML(`
    ${heroHTML(tf('trophies','🎖️ Trophées'), `${UNLOCKED.size} / ${ACHIEVEMENTS.length} ${tf('unlockedSince',"débloqués depuis l'ouverture de cette partie.")}`)}
    <div class="card">
      <h3>⭐ ${tf('legendaryTrophies','Trophées légendaires')}</h3>
      <p class="small" style="margin-top:-4px;">${tf('legendaryTrophiesDesc','Les plus difficiles à obtenir — de vrais accomplissements de carrière.')}</p>
      ${rareOnes.map(a=>{
        const unlocked = UNLOCKED.has(a.id);
        return `<div class="race-item trophy-shimmer" style="cursor:default;border:1.5px solid var(--yellow);${unlocked?'':'opacity:0.5;'}">
          <div>
            <strong>${unlocked?a.icon:'🔒'} ${a.name}</strong>
            <p class="small" style="margin:2px 0 0;">${a.desc}</p>
            ${unlocked?unlockLine(a.id):''}
          </div>
        </div>`;
      }).join('')}
    </div>
    ${cats.map(cat=>`
      <div class="card">
        <h3>${cat.label}</h3>
        ${ACHIEVEMENTS.filter(a=>a.category===cat.key && !a.rare).map(a=>{
          const unlocked = UNLOCKED.has(a.id);
          return `<div class="race-item" style="cursor:default;${unlocked?'':'opacity:0.45;'}">
            <div>
              <strong>${unlocked?a.icon:'🔒'} ${a.name}</strong>
              <p class="small" style="margin:2px 0 0;">${a.desc}</p>
              ${unlocked?unlockLine(a.id):''}
            </div>
          </div>`;
        }).join('')}
      </div>
    `).join('')}
    <button class="btn ghost" onclick="${NAV_RETURN_TO==='careerend'?'renderCareerEnd()':'renderMainMenu()'}">${tf('back','← Retour')}</button>
  `);
}
