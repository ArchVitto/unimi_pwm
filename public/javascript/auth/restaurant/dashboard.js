function mealsApp() {
    return {
      meals: [],
      filteredMeals: [],
      searchTerm: '',
      showPricePopup: false,
      priceInput: '',
      currentMealId: null,
      showDeletePopup: false,
      
      loadMeals() {
        fetch('/meals')
          .then(res => res.json())
          .then(data => {
            this.meals = data;
            this.filteredMeals = [...data]; // Inizializza con tutti i piatti
          })
          .catch(e => console.error('Errore caricamento pasti:', e));
      },
      
      filterMeals() {
        if (!this.searchTerm.trim()) {
          this.filteredMeals = [...this.meals];
          return;
        }
        
        const term = this.searchTerm.toLowerCase();
        this.filteredMeals = this.meals.filter(meal => {
          // Cerca nel nome
          const nameMatch = meal.strMeal.toLowerCase().includes(term);
          
          // Cerca nei tag (se presenti)
          let tagMatch = false;
          if (meal.strTags) {
            tagMatch = meal.strTags.toLowerCase().includes(term);
          }
          
          // Cerca nell'area (paese)
          const areaMatch = meal.strArea.toLowerCase().includes(term);
          
          // Cerca nel prezzo (convertito in stringa, con due decimali, se presente)
          let priceMatch = false;
          if (meal.price !== null && meal.price !== undefined) {
            priceMatch = meal.price.toFixed(2).includes(term);
          }
          
          return nameMatch || tagMatch || areaMatch || priceMatch;
        });
      },
      
      showPopup(mealId) {
        this.currentMealId = mealId;
        this.showPricePopup = true;
        this.priceInput = '';
      },
      
      closePopup() {
        this.showPricePopup = false;
        this.currentMealId = null;
      },
      
      async submitPrice() {
        if (!this.priceInput || isNaN(parseFloat(this.priceInput)) || this.priceInput > 1000) {
          alert('Inserisci un prezzo valido');
          return;
        }
      
        try {
          const response = await fetch('/meals/newPrice/', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              mealId: this.currentMealId,
              price: parseFloat(this.priceInput)
            })
          });
      
          if (!response.ok) {
            let errorMessage = 'Invio fallito';
            try {
              const errorData = await response.json();
              errorMessage = errorData.message || errorMessage;
            } catch (jsonErr) {
              const text = await response.text();
              console.error('Errore non JSON ricevuto dal server:', text);
              errorMessage = text || errorMessage;
            }
      
            alert('Errore: ' + errorMessage);
            return;
          }
      
          this.searchTerm = '';
          this.closePopup();
          this.loadMeals();
      
        } catch (error) {
          alert('Errore di rete o server: ' + error.message);
        }
      },
      
      // ✅ Gestione popup eliminazione
      showPopupDelete(mealId) {
        this.currentMealId = mealId;
        this.showDeletePopup = true;
      },
  
      closeDeletePopup() {
        this.currentMealId = null;
        this.showDeletePopup = false;
      },
  
      async confirmDelete() {
        const res = await fetch(`/meals/${this.currentMealId}`, {
          method: 'DELETE'
        });
  
        if (res.ok) {
          this.meals = this.meals.filter(m => m._id !== this.currentMealId);
          this.searchTerm = '';
          this.closeDeletePopup();
          this.loadMeals();
        }
      }
    }
  }
  