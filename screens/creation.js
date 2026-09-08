function renderCreationScreen(keepScroll){
  const cr = window._creation;
  const nameBlock = cr.name ? `
    <div class="card center">
      <h3>🎲 ${tf('yourRiderCard','Ta carte de coureur')}</h3>
      ${playerCardHTML(cr)}
      <button class="btn subtle" onclick="rerollName()">${tf('rerollName','🎲 Générer un autre nom')}</button>
      <div style="margin-top:8px;display:flex;gap:8px;align-items:center;">
        <input type="text" id="custom-name-input" placeholder="${tf('orEnterYourName','Ou entre ton propre nom…')}" style="flex:1;padding:8px 12px;border:1.5px solid var(--border);border-radius:8px;font-size:0.95rem;background:var(--surface);" value="" oninput="applyCustomName(this.value)">
      </div>
    </div>` : '';
  const _creationSteps = [true, !!cr.style, !!cr.style, !!cr.name];
  setHTML(`
    <div class="screen-hero">
      <p class="kicker">${tf('newCareerKicker','Nouvelle carrière')}</p>
      <h1>${tf('createYourRiderTitle','Crée ton coureur')}</h1>
      <p>${tf('creationIntro',"Fais évoluer un coureur cycliste, saison après saison, des courses de préparation jusqu'aux monuments du calendrier.")}</p>
    </div>
    <div class="step-track">${_creationSteps.map(d=>`<span class="${d?'done':''}"></span>`).join('')}</div>
    <div class="card">
      <h3>🌍 ${tf('nationality','Nationalité')}</h3>
      <p class="small" style="margin:0 0 8px;">${(()=>{ const _sel=COUNTRIES.find(c=>c.code===cr.country); return _sel?`${_sel.flag} <strong>${_sel.name}</strong>`:''; })()}</p>
      <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:6px;">
        ${COUNTRIES.slice().sort((a,b)=>a.name.localeCompare(b.name)).map(c=>{
          const mastered = SESSION.countriesPlayed.has(c.code);
          const label = mastered ? `${c.name} — ${tf('alreadyPlayed','déjà joué')}` : c.name;
          return `<button type="button" class="chip ${c.code===cr.country?'active':''} ${mastered?'mastered':''}" style="padding:8px 0;text-align:center;font-size:1.15rem;" onclick="updateCountry('${c.code}')" title="${label}" aria-label="${label}" aria-pressed="${c.code===cr.country}">${c.flag}</button>`;
        }).join('')}
      </div>
    </div>
    <div class="card">
      <h3>🚦 ${tf('riderStyle','Style de coureur')}</h3>
      ${STYLES.map(s=>{
        const mastered = SESSION.stylesPlayed.has(s.id);
        return `
        <div class="opt-card ${cr.style===s.id?'selected':''}" onclick="selectStyle('${s.id}')">
          ${styleBadgeHTML(s.id)}
          <div>
            <strong>${s.name}</strong> ${mastered?`<span class="pill" style="font-size:0.62rem;vertical-align:middle;">✓ ${tf('alreadyPlayed','déjà joué')}</span>`:''}
            <p class="small" style="margin:4px 0 0;">${s.desc}</p>
          </div>
        </div>
      `;
      }).join('')}
    </div>
    ${cr.style ? (()=>{
      const raceChoices = [{id:'', flag:'', name:tf('noneChoice','Aucune')}].concat(
        RACES_DATA().filter(r=>r.type==='classique'||r.type==='monument').map(r=>({id:r.id, flag:r.flag, name:r.name}))
      );
      const current = raceChoices.find(x=>x.id===(cr.signatureRaceId||'')) || raceChoices[0];
      const panel = SIGNATURE_RACE_PANEL_OPEN ? `<div style="max-height:280px;overflow-y:auto;margin-top:6px;">${raceChoices.map(x=>
        `<div class="row-item ${(cr.signatureRaceId||'')===x.id?'active':''}" onclick="updateSignatureRace('${x.id}')"><span>${x.flag?x.flag+' ':''}${x.name}</span></div>`
      ).join('')}</div>` : '';
      return `<div class="card">
        <h3>❤️ ${tf('signatureRaceTitle','Course de cœur')} <span class="small">(${tf('optional','optionnel')})</span></h3>
        <p class="small">${tf('signatureRaceDesc',"Choisis une classique ou un monument qui te tient particulièrement à cœur — tu y bénéficieras toujours d'un léger supplément d'envie.")}</p>
        <button class="btn ghost" style="display:flex;justify-content:space-between;align-items:center;" onclick="toggleSignatureRacePanel()"><span>${current.flag?current.flag+' ':''}${current.name}</span><span>${SIGNATURE_RACE_PANEL_OPEN?'▲':'▼'}</span></button>
        ${panel}
      </div>`;
    })() : ''}
    ${nameBlock}
    ${cr.style ? '' : `<p id="style-required-hint" class="small" style="text-align:center;">${tf('styleRequiredHint','Choisis un style de coureur ci-dessus pour continuer.')}</p>`}
    <button class="btn" ${cr.style?'':'disabled'} ${cr.style?'':'aria-describedby="style-required-hint"'} onclick="confirmCreation()">${tf('startCareer','🚀 Débuter la carrière')}</button>
    <button class="btn ghost" onclick="renderMainMenu()">${tf('backToMenu','← Retour au menu principal')}</button>
    <div class="footer-links">
      <button class="footer-link" onclick="NAV_RETURN_TO='creation';renderTutorialScreen()">${tf('howToPlay','📖 Comment jouer ?')}</button>
      <button class="footer-link" onclick="NAV_RETURN_TO='creation';renderSettingsScreen()">${tf('accessibility','♿ Accessibilité')}</button>
    </div>
  `, keepScroll);
}

function toggleSignatureRacePanel(){
  SIGNATURE_RACE_PANEL_OPEN = !SIGNATURE_RACE_PANEL_OPEN;
  renderCreationScreen(true);
}
function updateSignatureRace(id){
  window._creation.signatureRaceId = id || null;
  SIGNATURE_RACE_PANEL_OPEN = false;
  renderCreationScreen(true);
}

function updateCountry(code){
  window._creation.country = code;
  if(window._creation.style) window._creation.name = generateRiderName(code);
  renderCreationScreen(true);
}

function selectStyle(id){
  window._creation.style = id;
  if(!window._creation.name) window._creation.name = generateRiderName(window._creation.country);
  renderCreationScreen(true);
}

function rerollName(){
  window._creation.name = generateRiderName(window._creation.country);
  renderCreationScreen(true);
}

function applyCustomName(val){
  const trimmed = val.trim();
  if(trimmed.length > 0){
    window._creation.name = trimmed;
    // Mise à jour silencieuse de la carte sans re-render complet
    const card = document.querySelector('.pc-name');
    if(card) card.textContent = trimmed;
  }
}

function confirmCreation(){
  const cr = window._creation;
  if(!cr.style) return;
  const name = cr.name || generateRiderName(cr.country);
  const rider = newRider(name, cr.country, cr.style);
  rider.signatureRaceId = cr.signatureRaceId || null;
  rider.role = computeOfferedRole(rider, currentTeam(rider)).id;
  const rivals = generateRivals(rider);
  const rivalRecords = {};
  rivals.forEach(rv=>{ rivalRecords[rv.name] = {wins:0, losses:0}; });
  rider.teammate = generateTeammate();
  STATE = { rider, trainingFocus:null, selectedRaceIds:[], imposedRaceIds:[], seasonRacePool:[], seasonTotalDays:0, runQueue:[], runRaceIdx:0, runEventIdx:0, runRaceAccum:[], seasonSummary:null, pendingPersonalEvent:null, pendingInjury:null, injuryAbsenceRemaining:0, injuryEndNote:null, pendingTrophyUnlocks:[], rivals, rivalRecords, pendingRivalNote:null, domestiqueBonus:false, lastRacedMonth:0 };
  trackEvent('career_start', { rider_style: rider.style, rider_country: rider.country });
  renderSeasonSetupScreen();
}
