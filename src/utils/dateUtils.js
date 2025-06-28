export const formatDateForInput = (dateString) => {
  console.log('[formatDateForInput] Input:', dateString, typeof dateString);
  
  if (!dateString) {
    console.log('[formatDateForInput] Aucune date fournie, retourne chaîne vide');
    return '';
  }

  // Cas spécial: si c'est juste un nombre (le jour du mois)
  if (typeof dateString === 'string' && /^\d{1,2}$/.test(dateString)) {
    const day = parseInt(dateString, 10);
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    
    // Crée une date avec l'année/mois courant et le jour fourni
    const formattedDate = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    console.log('[formatDateForInput] Converti jour seul en:', formattedDate);
    return formattedDate;
  }

  // Si c'est un objet Date ou une string ISO
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    console.error('[formatDateForInput] Date invalide:', dateString);
    return '';
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  const formattedDate = `${year}-${month}-${day}`;
  console.log('[formatDateForInput] Date formatée:', formattedDate);
  
  return formattedDate;
};