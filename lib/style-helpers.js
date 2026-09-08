function styleBadgeHTML(styleId){
  const [c1,c2] = STYLE_BADGE_COLORS[styleId] || ['var(--text-soft)','var(--text-soft)'];
  return `<div class="style-badge" style="background:linear-gradient(135deg, ${c1}, ${c2});">
    <svg viewBox="0 0 24 24" width="26" height="26">${STYLE_BADGE_ICONS[styleId]||''}</svg>
  </div>`;
}

/* Retourne true si la course est dans le domaine de prédilection du style du coureur.
   Utilisé pour le bonus de perf et le badge ⭐ dans le calendrier. */
function raceMatchesStyle(race, styleId){
  const style = STYLES.find(s=>s.id===styleId);
  if(!style) return false;
  if(style.id==='polyvalent') return false; // le polyvalent n'a pas de bonus ciblé
  // Match sur le type de course
  const typeMatch = style.raceTypes.includes(race.type);
  // Le sprinteur et le puncheur matchent sur le type seul (leurs stat clés — sprint/classiques —
  // ne sont pas dans le focus des events mais c'est bien leur terrain de prédilection)
  if(style.id === 'sprinteur' || style.id === 'puncheur') return typeMatch;
  // Pour les autres profils : match sur type ET sur au moins une stat focus présente dans les events
  const focusStats = new Set();
  if(race.events) race.events.forEach(e=>{ if(e.focus) e.focus.forEach(f=>focusStats.add(f)); });
  const focusMatch = style.raceFocus.length === 0 || style.raceFocus.some(f=>focusStats.has(f));
  return typeMatch && focusMatch;
}
