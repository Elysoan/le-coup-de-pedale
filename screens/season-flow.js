function rivalsCardHTML(){
  if(!STATE.rivals || STATE.rivals.length===0) return '';
  return `<div class="card">
    <h3>🥊 ${tf('careerRivals','Rivaux de carrière')}</h3>
    ${STATE.rivals.map(rv=>{
      const rec = STATE.rivalRecords[rv.name] || {wins:0, losses:0};
      const country = COUNTRIES.find(c=>c.code===rv.countryCode);
      return `<div class="race-item" style="cursor:default;">
        <div>
          <strong>${country?country.flag:''} ${rv.name}</strong>
          <p class="small" style="margin:2px 0 0;">${STYLES.find(s=>s.id===rv.styleId).name}${rv.age?` · ${rv.age} ${tf('yo','ans')}`:''} · ${rivalTierLabel(rv.strength)}</p>
        </div>
        <span class="pill mono">${rec.wins}${tf('winAbbr','V')} - ${rec.losses}${tf('lossAbbr','D')}</span>
      </div>`;
    }).join('')}
  </div>`;
}

function startNewSeason(){
  STATE._seasonEnding = false;
  STATE.trainingFocus = null;
  STATE.rider.isNationalChampion = false;
  STATE.seasonWorldMods = {};
  STATE.activeWorldEvents = [];
  STATE._seasonMaxFatigue = 0;
  /* Globetrotter : arrive en début de saison avec une fatigue résiduelle — il tourne
     trop, ne récupère jamais vraiment. Contrepartie : accès plus rapide aux équipes sup. */
  if(STATE.rider.trajectory === 'globetrotter' && STATE.rider.season > 1){
    STATE.rider.fatigue = clamp((STATE.rider.fatigue || 0) + 8, 0, 100);
  }
  const r = STATE.rider;
  if(r.age>=33 && r.teammate && !r.isMentor && !r.mentorOfferDeclined){
    renderMentorOffer();
  } else {
    renderSeasonSetupScreen();
  }
}
