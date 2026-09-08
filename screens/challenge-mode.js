/* ---------- MODE DÉFI ----------
   Accessible après au moins 1 carrière terminée.
   Tirage aléatoire : nationalité + style + équipe de départ + objectif imposé.
   L'objectif est évalué à la fin de carrière dans goCareerEnd(). */

/* Libellé de l'objectif de défi recalculé à la demande à partir de son id, plutôt que
   figé une fois pour toutes dans l'objet stocké — sinon un changement de langue en
   cours de carrière laisse ce libellé bloqué dans l'ancienne langue (le reste de
   l'écran, lui, change immédiatement). */
function challengeObjLabelFor(id){
  switch(id){
    case 'win_grandtour': return tf('challengeObjGrandTour','Remporte un Grand Tour');
    case 'win_monument': return tf('challengeObjMonument','Remporte un Monument');
    case 'top10_world': return tf('challengeObjTopRank','Atteins le top ')+10+tf('challengeObjTopRankSuffix',' au classement mondial');
    case 'top50_world': return tf('challengeObjTopRank','Atteins le top ')+50+tf('challengeObjTopRankSuffix',' au classement mondial');
    case 'win_classique': return tf('challengeObjWinType',"Remporte une course de type : ")+"Classique";
    case 'win_5races': return tf('challengeObjWin5Races','Remporte au moins 5 courses');
    case 'survive_8': return tf('challengeObjSeasonsCount','Tiens au moins ')+8+tf('challengeObjSeasonsSuffix',' saisons');
    default: return '';
  }
}

function generateChallenge(){
  const style = STYLES[Math.floor(Math.random()*STYLES.length)];
  const country = COUNTRIES[Math.floor(Math.random()*COUNTRIES.length)];
  // Équipe de départ : tier Continentale uniquement (toujours accessible)
  const contTeams = TEAMS.filter(t=>t.tier==='Continentale');
  const team = contTeams[Math.floor(Math.random()*contTeams.length)];

  // Objectifs possibles
  const objectives = [
    {id:'win_grandtour',
      check:(r)=>r.palmares.some(p=>p.tier==='victoire' && RACE_DEFS().find(rd=>rd.id===p.raceId)?.type==='grandtour')},
    {id:'win_monument',
      check:(r)=>r.palmares.some(p=>p.tier==='victoire' && RACE_DEFS().find(rd=>rd.id===p.raceId)?.type==='monument')},
    {id:'top10_world',
      check:(r)=>(r.worldRank||999)<=10},
    {id:'top50_world',
      check:(r)=>(r.worldRank||999)<=50},
    {id:'win_classique',
      check:(r)=>r.palmares.some(p=>p.tier==='victoire' && RACE_DEFS().find(rd=>rd.id===p.raceId)?.type==='classique')},
    {id:'win_5races',
      check:(r)=>r.palmares.filter(p=>p.tier==='victoire').length>=5},
    {id:'survive_8',
      check:(r)=>r.season-1>=8},
  ].map(o=>Object.assign(o, {get label(){ return challengeObjLabelFor(o.id); }}));
  const obj = objectives[Math.floor(Math.random()*objectives.length)];

  return {style, country, team, obj};
}

function renderChallenge(){
  const ch = generateChallenge();
  window._pendingChallenge = ch;
  setHTML(`
    ${heroHTML(tf('challengeTitle','🎯 Mode défi'), tf('challengeDesc',"Une carrière avec des contraintes imposées. Remplis l'objectif pour entrer au Hall of Legends."))}
    <div class="card">
      <h3>${tf('challengeConstraints','Tes contraintes')}</h3>
      <div class="race-item" style="flex-direction:column;gap:6px;align-items:flex-start;">
        <p style="margin:0;"><strong>🎨 ${tf('challengeStyleLabel','Style :')}</strong> ${ch.style.name}</p>
        <p style="margin:0;"><strong>${ch.country.flag} ${tf('challengeCountryLabel','Nationalité :')}</strong> ${ch.country.name}</p>
        <p style="margin:0;"><strong>🏢 ${tf('challengeTeamLabel','Équipe de départ :')}</strong> ${ch.team.name}</p>
      </div>
    </div>
    <div class="card" style="border:2px solid var(--orange);background:var(--orange-light,#FFF8EE);">
      <h3>🎯 ${tf('challengeObjective','Objectif')}</h3>
      <p style="font-size:1.1rem;font-weight:700;color:var(--orange-dark);">${ch.obj.label}</p>
    </div>
    <button class="btn" onclick="startChallenge()">${tf('challengeStart','🚀 Accepter le défi')}</button>
    <button class="btn ghost" onclick="renderMainMenu()">${tf('back','← Retour')}</button>
  `);
}

function startChallenge(){
  const ch = window._pendingChallenge;
  if(!ch) return renderMainMenu();

  // Trouver un slot vide
  const freeSlotIdx = SLOTS.findIndex(s=>!s);
  if(freeSlotIdx !== -1){
    // Slot libre dispo → on l'utilise directement
    _launchChallengeInSlot(freeSlotIdx);
  } else {
    // Tous les slots occupés → demander lequel écraser
    renderChallengeSlotPicker();
  }
}

function renderChallengeSlotPicker(){
  const ch = window._pendingChallenge;
  if(!ch) return renderMainMenu();
  setHTML(`
    <div class="card" style="border:2px solid var(--orange);">
      <strong>🎯 ${tf('challengeMode','Mode défi')}</strong>
      <p class="small" style="margin:4px 0 0;">${tf('chooseSlotToOverwrite','Tous les emplacements sont occupés. Quelle carrière souhaites-tu remplacer ?')}</p>
    </div>
    ${SLOTS.map((slot, idx) => {
      if(!slot) return '';
      const r = slot.state && slot.state.rider;
      const label = r ? `${r.flag||''} ${r.name} — ${tf('seasonLabel','Saison')} ${r.season}` : tf('unknownCareer','Carrière inconnue');
      return `<div class="race-item" onclick="confirmChallengeOverwrite(${idx})" style="cursor:pointer;">
        <div>
          <strong>${tf('slot','Emplacement')} ${idx+1}</strong>
          <p class="small" style="margin:2px 0 0;">${label}</p>
        </div>
        <span style="color:var(--red);font-weight:700;">⚠️ ${tf('overwrite','Écraser')}</span>
      </div>`;
    }).join('')}
    <button class="btn ghost" onclick="renderChallenge()">${tf('back','← Retour')}</button>
  `);
}

function confirmChallengeOverwrite(slotIdx){
  const slot = SLOTS[slotIdx];
  const r = slot && slot.state && slot.state.rider;
  const label = r ? `${r.flag||''} ${r.name} (${tf('seasonLabel','Saison')} ${r.season}${r.retired?`, ${tf('careerOver','Carrière terminée')}`:''})` : tf('unknownCareer','Carrière inconnue');
  setHTML(`
    <div class="card center">
      <h1 class="h1-as-h2">🗑️ ${tf('overwriteConfirmTitle','Écraser cette carrière ?')}</h1>
      <p>${label} ${tf('willBeErased','sera')} <strong>${tf('permanentlyErased','définitivement effacé')}</strong> ${tf('fromThisSlot',"de cet emplacement — impossible de revenir en arrière.")}</p>
      <button class="btn" style="background:var(--red);box-shadow:0 6px 0 #C23B3B, 0 10px 20px -8px rgba(194,59,59,0.45);" onclick="_launchChallengeInSlot(${slotIdx})">${tf('overwriteConfirmButton','Écraser et lancer le défi')}</button>
      <button class="btn ghost" onclick="renderChallengeSlotPicker()">${tf('cancel','← Annuler')}</button>
    </div>
  `);
}

function _launchChallengeInSlot(slotIdx){
  const ch = window._pendingChallenge;
  if(!ch) return renderMainMenu();
  CURRENT_SLOT = slotIdx;
  const riderName = generateRiderName(ch.country.code);
  window._creation = {
    name: riderName,
    country: ch.country.code,
    style: ch.style.id,
    challengeMode: true,
    challengeObj: ch.obj,
    challengeTeamId: ch.team.id,
  };
  confirmCreation();
}
