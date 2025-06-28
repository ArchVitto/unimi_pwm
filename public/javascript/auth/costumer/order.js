function userOrders() {
    return {
      orders: [],
      loading: true,
      searchTerm: '',
      filteredOrders: [],
      showToast: false,
      toastTitle: '',
      toastMessage: '',
      toastType: 'success',
      
      
      init() {
        this.fetchOrders();
      },
      
      fetchOrders() {
        fetch('/costumer/getorders', { credentials: 'include' })
          .then(response => {
            if (!response.ok) {
              throw new Error('Errore nel recupero degli ordini');
            }
            return response.json();
          })
          .then(data => {
            if (data.success) {
              this.orders = data.orders || [];
            } else {
              this.showNotification('Errore', data.message || 'Impossibile recuperare gli ordini', 'error');
            }
          })
          .catch(error => {
            this.showNotification('Errore', 'Errore di comunicazione col server', 'error');
            console.error('Errore:', error);
          })
          .finally(() => {
            this.loading = false;
          });
      },
      
      filterOrders() {
        if (!this.searchTerm) {
          this.filteredOrders = [];
          return;
        }
        
        const term = this.searchTerm.toLowerCase();
        this.filteredOrders = this.orders.filter(order => 
          order._id.toLowerCase().includes(term) ||
          order.products.some(p => p.name && p.name.toLowerCase().includes(term))
        );
      },
      
      showNotification(title, message, type = 'success') {
        this.toastTitle = title;
        this.toastMessage = message;
        this.toastType = type;
        this.showToast = true;
        
        setTimeout(() => {
          this.showToast = false;
        }, 3000);
      }
    }
  }