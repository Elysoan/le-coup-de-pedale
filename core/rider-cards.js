function globalStatsPanelHTML(){
  const rating = globalRiderRating(STATE.rider.stats);
  const openLabel = tf('expand','▼ Déplier');
  const closeLabel = tf('collapse','▲ Replier');
  return `<div class="card">
    <div style="display:flex;justify-content:space-between;align-items:center;cursor:pointer;" onclick="const b=document.getElementById('statsPanelBody'), a=document.getElementById('statsPanelArrow'); const open = b.style.display!=='none'; b.style.display = open?'none':'block'; a.textContent = open?'${openLabel}':'${closeLabel}';">
      <h3 style="margin:0;">📊 ${tf('statsGlobalRating','Statistiques — Note globale')} : ${rating}/100</h3>
      <span class="small" id="statsPanelArrow">${openLabel}</span>
    </div>
    <div id="statsPanelBody" style="display:none;margin-top:8px;">
      ${statBarsHTML(STATE.rider.stats)}
    </div>
  </div>`;
}

function riderHeaderHTML(){
  const r = STATE.rider;
  const c = COUNTRIES.find(x=>x.code===r.countryCode);
  const team = currentTeam(r);
  return `<div class="card">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;">
      <div style="display:flex;gap:12px;align-items:center;">
        <div class="avatar">${c.flag}</div>
        <div>
          <h2>${r.name}</h2>
          <p class="small">${(()=>{ const _s=STYLES.find(s=>s.id===r.styleId); return _s?`${_s.icon} ${_s.name}`:''; })()}${r.trajectory?` · ${{'specialiste':'🎯','globetrotter':'🌍','leader':'👑'}[r.trajectory]||''} ${tf('trajectory_'+r.trajectory, r.trajectory)}`:''}  · ${r.age} ${tf('yo','ans')} · ${tf('season','Saison')} ${r.season}${r.isNationalChampion?` · 🏅 ${tf('nationalChampionBadge','Champion national')}`:''}</p>
        </div>
      </div>
      <div style="text-align:right;">
        <span class="pill">🎽 ${teamTierLabel(team.tier)}</span>
        <p class="small mono" style="margin:4px 0 0;">💰 ${Math.round(r.money).toLocaleString('fr-FR')} €</p>
      </div>
    </div>
    ${(()=>{
      const detailsHTML = `
        <p class="small">${riderRole(r)}${r.role ? ` · ${(RIDER_ROLES.find(x=>x.id===r.role)||{icon:'',name:'',nameEN:''}).icon} ${SETTINGS.lang==='en'?(RIDER_ROLES.find(x=>x.id===r.role)||{nameEN:''}).nameEN:(RIDER_ROLES.find(x=>x.id===r.role)||{name:''}).name}` : ''} — ${team.name} · 📋 ${tf('contractWord','contrat')} : ${r.contractYearsLeft} ${tf(r.contractYearsLeft>1?'seasonsLeftBareP':'seasonsLeftBare','saison'+(r.contractYearsLeft>1?'s':'')+' restante'+(r.contractYearsLeft>1?'s':''))}</p>
        <p class="small">🌍 <strong>${r.worldRank}${r.worldRank===1?tf('ordinalSt','er'):tf('ordinalTh','e')}</strong> ${tf('worldwide','mondial')}${(()=>{
          // Rang par style et national calculé depuis le worldRank
          // (5 styles à répartition égale, pays avec poids réalistes)
          const COUNTRY_WEIGHT = {FR:1.6,BE:1.4,IT:1.5,NL:1.3,ES:1.4,DE:1.0,AU:1.0,GB:1.0,
            CO:0.9,DK:1.0,CH:0.7,SI:0.5,US:0.7,NO:0.8,LU:0.4,PT:0.7,PL:0.6,IE:0.5,ER:0.4,RW:0.4};
          const TOTAL_WEIGHT = Object.values(COUNTRY_WEIGHT).reduce((a,b)=>a+b,0);
          const wk = COUNTRY_WEIGHT[r.countryCode] || 0.7;
          const countryShare = wk / TOTAL_WEIGHT;
          const styleShare = 1/5; // 5 styles équilibrés
          const styleRank = Math.max(1, Math.round(r.worldRank * styleShare));
          const countryRank = Math.max(1, Math.round(r.worldRank * countryShare));
          const styleLabel = STYLES.find(s=>s.id===r.styleId);
          const countryObj = COUNTRIES.find(x=>x.code===r.countryCode);
          let extra = '';
          extra += ` · ${styleLabel?styleLabel.icon||'':''} <strong>${styleRank}${styleRank===1?tf('ordinalSt','er'):tf('ordinalTh','e')}</strong> ${tf('amongStyle','chez les')} ${styleLabel?styleLabel.name.toLowerCase():''}s`;
          extra += ` · ${countryObj?countryObj.flag:''} <strong>${countryRank}${countryRank===1?tf('ordinalSt','er'):tf('ordinalTh','e')}</strong> ${tf('ofCountry','de')} ${countryObj?countryObj.name:''}`;
          return extra;
        })()}</p>
        ${r.sponsor ? `<p class="small">${r.sponsor.icon} ${tf('sponsorWord','Sponsor')} : ${r.sponsor.name}</p>` : ''}
        ${(()=>{
          /* Suivi de l'objectif de saison en temps réel */
          const _obj = STATE && STATE.seasonObjective;
          const _res = STATE && STATE.seasonSummary && STATE.seasonSummary.results;
          if(!_obj || _obj === 'aucun' || !_res) return '';
          const _lang = SETTINGS.lang === 'en';
          const _objDef = SEASON_OBJECTIVES.find(o=>o.id===_obj);
          if(!_objDef) return '';
          let _met = null;
          if(_obj==='survive'||_obj==='solide'){
            /* Ces objectifs ne peuvent être qu'en cours (null) ou échoués (false) en cours de
               saison — "atteint" ne peut être déclaré qu'à la fin de la saison, une fois
               que toutes les courses sont terminées. */
            if(_res.some(x=>x.bestTier==='abandon'||x.bestTier==='forfait')) _met = false;
            // sinon : _met reste null (en cours), jamais true ici
          }
          else if(_obj==='top10') _met = _res.some(x=>x.prestige>=3&&['victoire','podium','top10'].includes(x.bestTier));
          else if(_obj==='podium') _met = _res.some(x=>x.prestige>=3&&['victoire','podium'].includes(x.bestTier));
          else if(_obj==='etapes') _met = _res.some(x=>(x.type==='grandtour'||x.type==='semitour')&&['victoire','podium'].includes(x.bestTier));
          else if(_obj==='victoire') _met = _res.some(x=>x.prestige>=3&&x.bestTier==='victoire');
          else if(_obj==='monument') _met = _res.some(x=>x.prestige>=4&&x.bestTier==='victoire');
          const _icon = _met===true ? '✅' : _met===false ? '❌' : '🎯';
          const _color = _met===true ? 'var(--green-dark)' : _met===false ? 'var(--red)' : 'var(--text-soft)';
          const _objLabel = (_lang && _objDef.labelEN) ? _objDef.labelEN : _objDef.label;
          const _status = _met===true ? (_lang?'achieved':'atteint') : _met===false ? (_lang?'failed':'échoué') : (_lang?'in progress':'en cours');
          return `<p class="small" style="color:${_color};margin:2px 0 0;">${_icon} ${tf('seasonObjective','Objectif')} : ${_objLabel} — <em>${_status}</em></p>`;
        })()}
        ${r.teammate ? `<p class="small">🤝 ${tf('teammateWord','Coéquipier')} : ${r.teammate.name} (${TEAMMATE_ARCHETYPE_LABELS[r.teammate.archetype]})${r.isMentor?` · 🧑‍🏫 ${tf('youAreMentor','Tu es son mentor')}`:''}</p>` : ''}
        <button class="btn ghost" style="margin-top:6px;font-size:0.78rem;padding:6px 10px;" onclick="NAV_RETURN_TO='inrun';STATE._navReturnScreen=STATE._screen;renderCareerJournal()">📖 ${tf('careerJournal','Journal de carrière')}</button>
      `;
      const openLabel = tf('expand','▼ Déplier');
      const closeLabel = tf('collapse','▲ Replier');
      return `<div style="display:flex;justify-content:space-between;align-items:center;cursor:pointer;margin-top:4px;" onclick="const b=document.getElementById('riderDetailsBody'), a=document.getElementById('riderDetailsArrow'); const open = b.style.display!=='none'; b.style.display = open?'none':'block'; a.textContent = open?'${openLabel}':'${closeLabel}';">
        <span class="small" style="color:var(--text-soft);font-weight:700;">${tf('riderDetails','Détails du coureur')}</span>
        <span class="small" id="riderDetailsArrow">${openLabel}</span>
      </div>
      <div id="riderDetailsBody" style="display:none;">${detailsHTML}</div>`;
    })()}
    <div class="grid2" style="margin-top:8px;">
      <div class="stat-row">
        <div class="stat-label"><span>⭐ ${tf('reputationWord','Réputation')}</span><span>${Math.round(r.reputation)}</span></div>
        <div class="stat-track"><div class="stat-fill" style="width:${Math.min(100,Math.round(r.reputation))}%;background:${gaugeLevelColor(r.reputation)};"></div></div>
      </div>
      <div class="stat-row">
        <div class="stat-label"><span>🤝 ${tf('teamConfidenceWord','Confiance équipe')}</span><span>${Math.round(r.teamConfidence)}</span></div>
        <div class="stat-track"><div class="stat-fill" style="width:${Math.min(100,Math.round(r.teamConfidence))}%;background:linear-gradient(90deg,var(--blue),var(--green));"></div></div>
      </div>
    </div>
    ${(()=>{
      const _pscore = palmaresPrestigeScore(r);
      const _plabel = palmaresPrestigeLabel(_pscore, SETTINGS.lang==='en');
      if(!_plabel) return '';
      return `<p class="small" style="color:${_plabel.color};margin:2px 0 4px;">🏅 ${_plabel.label}</p>`;
    })()}
    <div class="stat-row">
      <div class="stat-label"><span>🔥 ${tf('fatigueWord','Fatigue')}</span><span style="${r.fatigue>55?'color:var(--red);font-weight:800;':''}">${Math.round(r.fatigue)}</span></div>
      <div class="stat-track"><div class="stat-fill" style="width:${Math.min(100,Math.round(r.fatigue))}%;background:linear-gradient(90deg,var(--green),var(--red));"></div></div>
      ${r.fatigue>55 ? `<p class="small" style="color:var(--red);font-weight:700;margin:4px 0 0;">⚠️ ${tf('fatigueAlert','Fatigue élevée — risque de blessure accru, envisage de lever le pied')}</p>` : ''}
      ${(()=>{
        const canCancel = r.fatigue>70 && STATE.runQueue && (STATE.freeCancelsRemaining||0)>0 && STATE.runQueue.slice(STATE.runRaceIdx||0).some(rc=>!STATE.imposedRaceIds.includes(rc.id));
        if(!canCancel) return '';
        return `<button class="btn ghost" style="margin-top:6px;font-size:0.78rem;padding:6px 10px;" onclick="renderCancelRaceScreen()">🩹 ${tf('manageCalendar','Gérer mon calendrier')} (${STATE.freeCancelsRemaining})</button>`
          + tipBox('free-cancel', "Au-delà de 70 de fatigue, tu peux annuler jusqu'à 2 courses à venir par saison sans pénalité — aucun forfait, aucune perte de réputation — pour souffler.", tf('tipFreeCancel'));
      })()}
    </div>
  </div>` + globalStatsPanelHTML();
}
function playerCardHTML(cr){
  if(!cr.style || !cr.name) return '';
  const country = COUNTRIES.find(c=>c.code===cr.country);
  const style = STYLES.find(s=>s.id===cr.style);
  const stats = computeBaseStats(cr.style);
  const top3 = STAT_KEYS.slice().sort((a,b)=>stats[b]-stats[a]).slice(0,3);
  return `<div style="display:flex;gap:12px;align-items:center;text-align:left;">
    ${styleBadgeHTML(cr.style)}
    <div style="flex:1;min-width:0;">
      <strong class="pc-name">${cr.name}</strong>
      <p class="small" style="margin:2px 0 0;">${country.flag} ${country.name} · ${style.name}</p>
      <div class="chip-row" style="margin-top:6px;">
        ${top3.map(k=>`<span class="pill">${STAT_ICONS[k]} ${Math.round(stats[k])}</span>`).join('')}
      </div>
    </div>
  </div>`;
}
