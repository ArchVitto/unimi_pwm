document.addEventListener('alpine:init', () => {
  Alpine.data('restaurantMeals', () => ({
    meals: [],
    cart: [],
    error: null,
    favoriteMeal: null,
    favoriteTags: [],
    isLoading: false,

    async init() {
      await this.fetchFavoriteProduct();
      await this.fetchMeals();
    },

    async fetchMeals() {
      try {
        this.isLoading = true;
        const urlParts = window.location.pathname.split('/');
        const partitaIva = urlParts[urlParts.length - 1];
        
        const res = await fetch(`/meals/menu/${partitaIva}`);
        if (!res.ok) throw new Error('Errore nel recupero dei piatti');
        
        const data = await res.json();
        this.meals = data.map(meal => ({ 
          ...meal, 
          price: meal.price || (Math.random() * 20 + 5)
        }));
        
      } catch (e) {
        this.error = 'Impossibile caricare i piatti.';
        console.error(e);
      } finally {
        this.isLoading = false;
      }
    },

    async fetchFavoriteProduct() {
      try {
        const response = await fetch('/costumer/favoriteproduct');
        if (!response.ok) return;
        
        const data = await response.json();
        if (data.success && data.mostPurchasedProduct) {
          this.favoriteMeal = {
            _id: data.mostPurchasedProduct._id,
            name: data.mostPurchasedProduct.name,
            quantity: data.mostPurchasedProduct.totalQuantity,
            tag: data.mostPurchasedProduct.tag
          };
          
          // Estrai i tag preferiti
          if (this.favoriteMeal.tag) {
            this.favoriteTags = this.favoriteMeal.tag.split(',')
              .map(tag => tag.trim().toLowerCase());
          }
        }
      } catch (err) {
        console.error('Errore nel recupero del piatto preferito:', err);
      }
    },

    isFavorite(mealId) {
      return this.favoriteMeal && this.favoriteMeal._id === mealId;
    },

    isFavoriteTag(tag) {
      return this.favoriteTags.includes(tag.trim().toLowerCase());
    },
    
    // ... (resto delle funzioni addToCart, removeFromCart, clearCart, cartTotal, submitOrder rimangono identiche)
    addToCart(meal) {
      let item = this.cart.find(i => i._id === meal._id);
      if (item) {
        item.quantity++;
      } else {
        this.cart.push({ ...meal, quantity: 1 });
      }
    },

    removeFromCart(id) {
      this.cart = this.cart.filter(i => i._id !== id);
    },

    clearCart() {
      this.cart = [];
    },

    cartTotal() {
      return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    },

    async submitOrder() {
      const form = document.querySelector('#paymentModal form');
      const formData = new FormData(form);

      const payload = {
        partitaIva: window.location.pathname.split('/').pop(),
        cart: this.cart,
        cardNumber: formData.get('cardNumber'),
        cardHolder: formData.get('cardHolder'),
        expiry: formData.get('expiry'),
        cvc: formData.get('cvc')
      };

      if (!payload.cardNumber || !payload.cardHolder || !payload.expiry || !payload.cvc) {
        alert("Inserisci tutti i dati della carta.");
        return;
      }

      try {
        const res = await fetch('/restaurant/newOrder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error('Errore nell\'invio ordine');
        
        const data = await res.json();
        alert('Ordine confermato!');
        this.clearCart();
        const modal = bootstrap.Modal.getInstance(document.getElementById('paymentModal'));
        modal.hide();
        form.reset();
      } catch (err) {
        alert('Errore durante l\'ordine: ' + err.message);
        console.error(err);
      }
    }
  }));
});