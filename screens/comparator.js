function setComparatorSort(v){ COMPARATOR_SORT = v; renderCareerComparator(); }
function setComparatorFilterStyle(v){ COMPARATOR_FILTER_STYLE = v; COMPARATOR_STYLE_PANEL_OPEN = false; renderCareerComparator(); }
function setComparatorFilterCountry(v){ COMPARATOR_FILTER_COUNTRY = v; COMPARATOR_COUNTRY_PANEL_OPEN = false; renderCareerComparator(); }
function toggleComparatorStylePanel(){ COMPARATOR_STYLE_PANEL_OPEN = !COMPARATOR_STYLE_PANEL_OPEN; COMPARATOR_COUNTRY_PANEL_OPEN = false; renderCareerComparator(); }
function toggleComparatorCountryPanel(){ COMPARATOR_COUNTRY_PANEL_OPEN = !COMPARATOR_COUNTRY_PANEL_OPEN; COMPARATOR_STYLE_PANEL_OPEN = false; renderCareerComparator(); }
function toggleCompareCareer(i){
  const idx = COMPARATOR_COMPARE.indexOf(i);
  if(idx>=0){ COMPARATOR_COMPARE.splice(idx,1); }
  else{
    COMPARATOR_COMPARE.push(i);
    if(COMPARATOR_COMPARE.length>2) COMPARATOR_COMPARE.shift();
  }
  renderCareerComparator();
}
function clearComparatorCompare(){ COMPARATOR_COMPARE = []; renderCareerComparator(); }

function renderCareerComparator(){
  const careers = CAREER_HISTORY;
  if(careers.length===0){
    setHTML(`
      ${heroHTML('📊 '+tf('careerComparator','Comparateur de carrières'))}
      <div class="card center"><p>${tf('noCareerYet',"Aucune carrière enregistrée pour l'instant. Termine une carrière pour apparaître ici.")}</p></div>
      <button class="btn ghost" onclick="renderMainMenu()">${tf('back','← Retour')}</button>
    `);
    return;
  }
  const avgWins = (careers.reduce((s,c)=>s+c.wins,0)/careers.length).toFixed(1);
  const avgRep = Math.round(careers.reduce((s,c)=>s+c.finalReputation,0)/careers.length);

  const styleCounts = {};
  careers.forEach(c=>{ styleCounts[c.styleId] = (styleCounts[c.styleId]||0)+1; });
  const styleRows = STYLES.map(s=>({s, count: styleCounts[s.id]||0})).filter(x=>x.count>0).sort((a,b)=>b.count-a.count);

  const countryCounts = {};
  careers.forEach(c=>{ countryCounts[c.countryCode] = (countryCounts[c.countryCode]||0)+1; });
  const countryRows = Object.entries(countryCounts)
    .map(([code,count])=>({country:COUNTRIES.find(x=>x.code===code), count}))
    .sort((a,b)=>b.count-a.count);

  /* Stats segmentées par style : moyennes calculées séparément pour chaque style joué,
     plutôt qu'une seule moyenne globale qui mélange des profils très différents. */
  const styleStatsRows = styleRows.map(x=>{
    const subset = careers.filter(c=>c.styleId===x.s.id);
    const sAvgWins = (subset.reduce((s,c)=>s+c.wins,0)/subset.length).toFixed(1);
    const sAvgRep = Math.round(subset.reduce((s,c)=>s+c.finalReputation,0)/subset.length);
    return {s:x.s, count:x.count, avgWins:sAvgWins, avgRep:sAvgRep};
  });

  const sparkValues = careers.map(c=>c.wins);

  const indexed = careers.map((c,i)=>({c,i}));
  let filtered = indexed.filter(({c})=>{
    if(COMPARATOR_FILTER_STYLE!=='all' && c.styleId!==COMPARATOR_FILTER_STYLE) return false;
    if(COMPARATOR_FILTER_COUNTRY!=='all' && c.countryCode!==COMPARATOR_FILTER_COUNTRY) return false;
    return true;
  });
  const sorters = {
    recent: (a,b)=>b.i-a.i,
    wins: (a,b)=>b.c.wins-a.c.wins,
    rep: (a,b)=>b.c.finalReputation-a.c.finalReputation,
  };
  filtered = filtered.slice().sort(sorters[COMPARATOR_SORT] || sorters.recent);

  const sortChip = (id, label) => `<span class="chip ${COMPARATOR_SORT===id?'active':''}" onclick="setComparatorSort('${id}')">${label}</span>`;

  const compareEntries = COMPARATOR_COMPARE.map(i=>careers[i]).filter(Boolean);
  const headToHeadHTML = compareEntries.length===2 ? (()=>{
    const [a,b] = compareEntries;
    const ca = COUNTRIES.find(x=>x.code===a.countryCode), cb = COUNTRIES.find(x=>x.code===b.countryCode);
    const rows = [
      [tf('wins','victoires'), a.wins, b.wins, false],
      [tf('podiumsShort','podiums'), a.podiums, b.podiums, false],
      [tf('stageWins',"victoires d'étape"), a.stageWins||0, b.stageWins||0, false],
      [tf('avgFinalRep','réputation finale'), a.finalReputation, b.finalReputation, false],
      [tf('seasonsBareLower','saisons'), a.seasons, b.seasons, false],
      /* Ramené au nombre de saisons : la seule ligne qui rend la durée de carrière
         vraiment comparable, plutôt que d'afficher les saisons sans jamais s'en servir
         pour une comparaison à rythme égal entre une carrière longue et une écourtée. */
      [tf('winsPerSeason','victoires / saison'), Math.round(a.wins/Math.max(1,a.seasons)*100)/100, Math.round(b.wins/Math.max(1,b.seasons)*100)/100, false],
      [tf('bestRank','meilleur classement'), a.bestRank, b.bestRank, true],
    ];
    return `<div class="card" style="border:1.5px solid var(--green);">
      <h3>🆚 ${tf('headToHead','Comparaison tête-à-tête')}</h3>
      <div class="grid2" style="margin-bottom:8px;">
        <p class="small center" style="font-weight:800;margin:0;">${ca?ca.flag:''} ${a.name}</p>
        <p class="small center" style="font-weight:800;margin:0;">${cb?cb.flag:''} ${b.name}</p>
      </div>
      ${rows.map(([label,va,vb,lowerBetter])=>{
        const aBetter = lowerBetter ? va<vb : va>vb;
        const bBetter = lowerBetter ? vb<va : vb>va;
        return `
        <div class="grid2" style="align-items:center;margin-bottom:4px;">
          <div style="text-align:right;padding-right:8px;"><strong class="${aBetter?'diff-1':''}">${va}</strong></div>
          <div style="padding-left:8px;"><strong class="${bBetter?'diff-1':''}">${vb}</strong></div>
        </div>
        <p class="small center" style="margin:0 0 6px;opacity:.7;">${label}</p>
      `;
      }).join('')}
      <button class="btn ghost" onclick="clearComparatorCompare()">${tf('clearSelection','Vider la sélection')}</button>
    </div>`;
  })() : (compareEntries.length===1 ? `<p class="small center" style="margin:0 0 10px;">${tf('pickOneMore','Sélectionne une deuxième carrière (🆚) pour comparer.')}</p>` : '');

  setHTML(`
    ${heroHTML('📊 '+tf('careerComparator','Comparateur de carrières'), tf('careerComparatorDesc',"Vue d'ensemble de toutes les carrières jouées depuis l'ouverture de cette partie."))}
    <div class="card">
      <h3>${tf('overview',"Vue d'ensemble")}</h3>
      <div class="grid3">
        <div class="stat-tile"><span class="stat-tile-num" style="color:var(--green-dark);">${careers.length}</span><span class="stat-tile-label">${tf('careersPlayed','carrières jouées')}</span></div>
        <div class="stat-tile"><span class="stat-tile-num" style="color:var(--yellow-dark);">${avgWins}</span><span class="stat-tile-label">${tf('avgWins','victoires en moyenne')}</span></div>
        <div class="stat-tile"><span class="stat-tile-num" style="color:var(--pink);">${avgRep}</span><span class="stat-tile-label">${tf('avgFinalRep','réputation moyenne')}</span></div>
      </div>
      <h3 style="margin-top:14px;">📈 ${tf('progressionTitle','Progression (victoires par carrière)')}</h3>
      ${sparklineSVG(sparkValues)}
    </div>
    <div class="card">
      <h3>${tf('styleStatsTitle','Stats par style')}</h3>
      ${styleStatsRows.map(x=>`<div class="race-item" style="cursor:default;">
        <div><strong>${x.s.name}</strong><span class="pill" style="margin-left:6px;">${x.count}×</span></div>
        <span class="pill mono">${x.avgWins}🏆 ${tf('avgAbbrev','moy.')} · ${x.avgRep}⭐</span>
      </div>`).join('')}
    </div>
    <div class="card">
      <h3>${tf('countriesUsed','Pays essayés')}</h3>
      ${countryRows.map(x=>`<div class="race-item" style="cursor:default;"><strong>${x.country?x.country.flag+' '+x.country.name:'?'}</strong><span class="pill">${x.count}×</span></div>`).join('')}
    </div>
    ${headToHeadHTML}
    <div class="card">
      <h3>${tf('allCareers','Toutes les carrières')}</h3>
      <div class="chip-row" style="margin-bottom:6px;">
        ${sortChip('recent', tf('sortRecent','Plus récentes'))}
        ${sortChip('wins', tf('sortWins','Victoires ↓'))}
        ${sortChip('rep', tf('sortRep','Réputation ↓'))}
      </div>
      ${(()=>{
        const styleChoices = [{id:'all', icon:'🌍', label:tf('allStyles','Tous les styles')}]
          .concat(styleRows.map(x=>({id:x.s.id, icon:x.s.icon, label:x.s.name})));
        const countryChoices = [{code:'all', flag:'🌍', label:tf('allCountries','Tous les pays')}]
          .concat(countryRows.map(x=>({code:x.country?x.country.code:'', flag:x.country?x.country.flag:'', label:x.country?x.country.name:'?'})));
        const curStyle = styleChoices.find(s=>s.id===COMPARATOR_FILTER_STYLE) || styleChoices[0];
        const curCountry = countryChoices.find(c=>c.code===COMPARATOR_FILTER_COUNTRY) || countryChoices[0];
        const toggleBtn = (label, icon, open, onclick) => `<button class="btn ghost" style="flex:1;min-width:0;display:flex;justify-content:space-between;align-items:center;gap:4px;font-size:0.82rem;padding:10px 10px;" onclick="${onclick}"><span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${icon} ${label}</span><span>${open?'▲':'▼'}</span></button>`;
        const stylePanel = COMPARATOR_STYLE_PANEL_OPEN ? `<div style="max-height:280px;overflow-y:auto;margin-top:6px;">${styleChoices.map(s=>
          `<div class="row-item ${COMPARATOR_FILTER_STYLE===s.id?'active':''}" onclick="setComparatorFilterStyle('${s.id}')"><span>${s.icon} ${s.label}</span></div>`
        ).join('')}</div>` : '';
        const countryPanel = COMPARATOR_COUNTRY_PANEL_OPEN ? `<div style="max-height:280px;overflow-y:auto;margin-top:6px;">${countryChoices.map(c=>
          `<div class="row-item ${COMPARATOR_FILTER_COUNTRY===c.code?'active':''}" onclick="setComparatorFilterCountry('${c.code}')"><span>${c.flag} ${c.label}</span></div>`
        ).join('')}</div>` : '';
        return `<div style="margin-bottom:10px;">
          <div class="chip-row" style="margin-top:0;">
            ${toggleBtn(curStyle.label, curStyle.icon, COMPARATOR_STYLE_PANEL_OPEN, 'toggleComparatorStylePanel()')}
            ${toggleBtn(curCountry.label, curCountry.flag, COMPARATOR_COUNTRY_PANEL_OPEN, 'toggleComparatorCountryPanel()')}
          </div>
          ${stylePanel}
          ${countryPanel}
        </div>`;
      })()}
      ${filtered.length ? filtered.map(({c,i})=>{
        const country = COUNTRIES.find(x=>x.code===c.countryCode);
        const selected = COMPARATOR_COMPARE.includes(i);
        return `<div class="race-item" style="cursor:default;">
          <div><strong>${country?country.flag:''} ${c.name}</strong><p class="small" style="margin:2px 0 0;">${STYLES.find(s=>s.id===c.styleId).name} · ${c.seasons} ${tf('seasonsBareLower','saisons')}</p></div>
          <div style="display:flex;align-items:center;gap:6px;">
            <span class="pill mono">${c.wins}🏆 ${c.podiums}🥈</span>
            <button type="button" class="chip ${selected?'active':''}" style="padding:11px 14px;font-size:0.75rem;" onclick="toggleCompareCareer(${i})" aria-label="${tf('addToComparison','Ajouter à la comparaison')}" title="${tf('addToComparison','Ajouter à la comparaison')}" aria-pressed="${selected}">🆚</button>
          </div>
        </div>`;
      }).join('') : `<p class="small center" style="padding:8px;">${tf('almanacFilterEmpty','Aucune course ne correspond à ce filtre.')}</p>`}
    </div>
    <button class="btn ghost" onclick="renderMainMenu()">${tf('back','← Retour')}</button>
  `);
}
