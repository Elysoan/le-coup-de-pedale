function generateSponsorOffers(rider){
  const picks = shuffleArr(SPONSOR_BRANDS.slice()).slice(0,3);
  return picks.map(b=>{
    const personality = Math.random()<0.5 ? 'exigeant' : 'fidele';
    const basePay = (800 + Math.round(rider.reputation*25)) * (1 + rider.reputation/300);
    const pay = Math.round(personality==='exigeant' ? basePay*1.5 : basePay);
    const seasons = 1 + Math.floor(Math.random()*3);
    return {...b, personality, pay, seasonsLeft:seasons};
  });
}

/* ---------- RÔLE DE MENTOR EN FIN DE CARRIÈRE ----------
   Proposé une seule fois, dès 33 ans, si un coéquipier récurrent est présent : sacrifier
   une partie de ses propres ambitions pour investir dans la progression du coéquipier —
   une vraie alternative narrative à "courir jusqu'au bout pour soi-même". Reste un écran
   à part (contrairement au reste du démarrage de saison) : c'est rare et ça mérite son
   propre moment plutôt qu'une case de plus dans un formulaire. */
function renderMentorOffer(){
  if(STATE) STATE._screen='mentoroffer';
  const tm = STATE.rider.teammate;
  setHTML(`
    ${riderHeaderHTML()}
    <div class="card">
      <h1 class="h1-as-h2">🧑‍🏫 ${tf('mentorTitle','Basculer vers un rôle de mentor ?')}</h1>
      <p>${tf('mentorDesc1','Tu approches de la fin de ta carrière. Tu pourrais désormais investir une partie de ton énergie à faire progresser')} ${tm.name} ${tf('mentorDesc1b',"plutôt qu'à courir uniquement pour toi-même.")}</p>
      <p class="small">${tf('mentorDesc2','En tant que mentor')} : ${tf('mentorDesc2b','ta complicité avec')} ${tm.name} ${tf('mentorDesc2c',"progresse plus vite, ta réputation grandit doucement chaque saison (le peloton respecte ce rôle), mais tu renonces aux objectifs et défis de saison — ta priorité, désormais, c'est lui.")}</p>
      <button class="btn" onclick="acceptMentorRole()">${tf('becomeMentor','Devenir mentor')}</button>
      <button class="btn ghost" onclick="declineMentorRole()">${tf('keepRacingForSelf','Continuer à courir pour toi-même')}</button>
    </div>
  `);
}
function acceptMentorRole(){
  const r = STATE.rider;
  r.isMentor = true;
  if(r.teammate) r.teammate.bond = clamp(r.teammate.bond + 10, 0, 100);
  renderSeasonSetupScreen();
}
function declineMentorRole(){
  STATE.rider.mentorOfferDeclined = true;
  renderSeasonSetupScreen();
}
