/**
 * Funzione che gestisce lo stato di un form per creare nuovi piatti (meal)
 * Mantiene una lista dinamica di ingredienti con nome e quantità
 * @returns {Object} Stato iniziale del form con array di ingredienti
 */
function newMealForm() {
  return {
    // Array di ingredienti, ciascuno con:
    // - ingredient: nome dell'ingrediente (string)
    // - measure: quantità/unità di misura (string)
    ingredients: [
      { ingredient: '', measure: '' }  // Oggetto iniziale vuoto
    ]
  }
}