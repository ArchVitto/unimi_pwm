function restaurantsData() {
  return {
    restaurants: [],
    filteredRestaurants: [],
    searchTerm: '',
    error: null,

    async fetchRestaurants() {
      try {
        const res = await fetch('/restaurant/activeList');
        if (!res.ok) throw new Error('Errore HTTP: ' + res.status);
        this.restaurants = await res.json();
        this.filteredRestaurants = this.restaurants;
      } catch (e) {
        this.error = 'Errore nel caricamento: ' + e.message;
      }
    },

    filterRestaurants() {
      const term = this.searchTerm.toLowerCase();
      
      this.filteredRestaurants = this.restaurants.filter(r => {
        // Cerca sia nel nome che nell'indirizzo
        const matchesName = r.nome_ristorante.toLowerCase().includes(term);
        const matchesAddress = r.indirizzo_ristorante.toLowerCase().includes(term);
        
        // Mostra i risultati che corrispondono a uno dei due criteri
        return matchesName || matchesAddress;
      });
    }
  }
}