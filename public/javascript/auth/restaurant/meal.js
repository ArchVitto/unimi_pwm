function mealPage() {
    return {
      meal: null,
      ingredients: [],
      message: '',
      error: null,
      success: false, 
      showDeletePopup: false,

      get editable() {
        return this.meal?.partita_iva && this.meal.partita_iva != 0;
      },

      async fetchMeal() {
        try {
          const id = window.location.pathname.split('/').pop();
          const res = await fetch(`/meals/${id}`);
          if (!res.ok) throw new Error('Errore recupero pasto');

          const data = await res.json();

          const ings = [];
          for (let i = 1; i <= 20; i++) {
            const ing = data[`strIngredient${i}`] || (data.ingredients ? data.ingredients[i - 1] : '');
            const meas = data[`strMeasure${i}`] || (data.measures ? data.measures[i - 1] : '');
            if (ing && ing.trim()) ings.push({ ingredient: ing, measure: meas });
          }

          this.meal = { ...data, partita_iva: data.partita_iva || 0 };
          this.ingredients = ings.length ? ings : [{ ingredient: '', measure: '' }];
        } catch (e) {
          this.error = 'Impossibile caricare il pasto.';
          console.error(e);
        }
      },

      async updateMeal() {
        try {
          const mealToSend = {
            ...this.meal,
            ingredients: this.ingredients.map(i => i.ingredient),
            measures: this.ingredients.map(i => i.measure)
          };

          const response = await fetch(`/meals/updateMeal/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(mealToSend)
          });

          const data = await response.json();

          if (response.ok) {
            this.message = data.message || 'Pasto aggiornato con successo!';
            this.success = true;
            setTimeout(() => this.success = false, 3000);
          } else {
            throw new Error(data.message || 'Errore durante l\'aggiornamento');
          }
        } catch (error) {
          this.message = 'Errore: ' + error.message;
        }
      },

      // APRE il popup di conferma
      confirmDelete() {
        this.showDeletePopup = true;
      },

      // CHIUDE il popup senza fare nulla
      closeDeletePopup() {
        this.showDeletePopup = false;
      },

      // CONFERMA e manda DELETE al backend
      async confirmDeletePopup() {
        try {
          const response = await fetch('/meals/deleteMeal', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: this.meal.idMeal }), // <-- usa this.meal.idMeal
          });

          const data = await response.json();

          if (response.ok) {
            this.message = data.message || 'Pasto eliminato con successo!';
            this.success = true;
            this.showDeletePopup = false;

            // Redirect dopo un breve delay
            setTimeout(() => {
              window.location.href = data.redirect;
            }, 1500);
          } else {
            throw new Error(data.message || 'Errore durante l\'eliminazione');
          }
        } catch (error) {
          this.message = 'Errore: ' + error.message;
          this.success = false;
          this.showDeletePopup = false;
        }
      }
    }
  }