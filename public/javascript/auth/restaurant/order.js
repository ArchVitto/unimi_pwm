/**
 * Funzione che gestisce la dashboard degli ordini per il ristorante
 * Utilizza Alpine.js per la gestione dello stato e delle interazioni
 */
function orderDashboard() {
  return {
    // Stato iniziale del componente
    partitaIva: '',          // Partita IVA del ristorante
    ordini: [],              // Lista degli ordini ricevuti
    socket: null,            // Connessione Socket.IO per aggiornamenti in tempo reale
    searchTerm: '',          // Termine di ricerca per filtrare gli ordini
    filteredOrders: [],      // Ordini filtrati in base al searchTerm
    showToast: false,        // Flag per mostrare/nascondere le notifiche toast
    toastTitle: '',          // Titolo della notifica toast
    toastMessage: '',        // Messaggio della notifica toast
    toastType: 'success',    // Tipo di notifica (success/error)
    
    /**
     * Funzione di inizializzazione del componente
     * Viene eseguita al mount del componente
     */
    init() {
      // Recupera la partita IVA del ristorante
      fetch('/restaurant/partitaiva', { credentials: 'include' })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            this.partitaIva = data.partita_iva;

            // Inizializza la connessione Socket.IO
            this.socket = io('http://localhost:3000');
            
            // Gestione eventi Socket.IO
            this.socket.on('connect', () => {
              console.log('Connesso al server Socket.IO, id:', this.socket.id);
              // Entra nella room specifica per questa partita IVA
              this.socket.emit('joinRoom', this.partitaIva);
            });

            // Ascolta per nuovi ordini
            this.socket.on('newOrder', () => {
              console.log('Nuovo ordine ricevuto via websocket');
              
              // Recupera i nuovi ordini dal server
              fetch('/restaurant/getorders', { credentials: 'include' })
                .then(res => res.json())
                .then(data => {
                  if (data.success && Array.isArray(data.orders)) {
                    // Assicura che ogni ordine abbia il campo minuti
                    data.orders.forEach(o => {
                      if (!('minuti' in o)) o.minuti = 0;
                    });

                    // Filtra solo i nuovi ordini (non già presenti)
                    const nuoviOrdini = data.orders.filter(o => !this.ordini.some(e => e._id === o._id));
                    // Aggiungi i nuovi ordini in cima alla lista
                    this.ordini = [...nuoviOrdini, ...this.ordini];
                    // Mostra notifica
                    this.showNotification('Nuovo ordine!', 'È stato ricevuto un nuovo ordine', 'success');
                  }
                })
                .catch(err => {
                  console.error('Errore durante il recupero degli ordini', err);
                });
            });

            // Carica gli ordini esistenti al primo caricamento
            this.loadInitialOrders();
          }
        })
        .catch(err => {
          this.showNotification('Errore', 'Errore nella comunicazione col server', 'error');
          console.error(err);
        });

      // Avvia il timer per l'aggiornamento del tempo rimanente
      this.updateTimeRemaining();
    },
    
    /**
     * Carica gli ordini iniziali al primo caricamento della pagina
     */
    loadInitialOrders() {
      fetch('/restaurant/getorders', { credentials: 'include' })
        .then(res => res.json())
        .then(data => {
          if (data.success && Array.isArray(data.orders)) {
            // Inizializza il campo minuti se mancante
            data.orders.forEach(o => {
              if (!('minuti' in o)) o.minuti = 0;
            });
            this.ordini = data.orders;
          }
        });
    },
    
    /**
     * Filtra gli ordini in base al termine di ricerca
     */
    filterOrders() {
      if (!this.searchTerm) {
        this.filteredOrders = [];
        return;
      }
    
      const term = this.searchTerm.toLowerCase();
      this.filteredOrders = this.ordini.filter(order => 
        order._id.toLowerCase().includes(term) ||          // Cerca per ID ordine
        order.cardHolder.toLowerCase().includes(term) ||   // Cerca per nome cliente
        order.products.some(p => p.name.toLowerCase().includes(term)) // Cerca per prodotto
      );
    },
    
    /**
     * Mostra una notifica toast
     * @param {string} title - Titolo della notifica
     * @param {string} message - Messaggio della notifica
     * @param {string} type - Tipo di notifica (success/error)
     */
    showNotification(title, message, type = 'success') {
      this.toastTitle = title;
      this.toastMessage = message;
      this.toastType = type;
      this.showToast = true;
      
      // Nasconde automaticamente la notifica dopo 3 secondi
      setTimeout(() => {
        this.showToast = false;
      }, 3000);
    },

    /**
     * Aggiorna il tempo di preparazione per un ordine
     * @param {string} orderId - ID dell'ordine da aggiornare
     */
    submitMinutes(orderId) {
      const ordine = this.ordini.find(o => o._id === orderId);
      if (!ordine) return;

      // Invia l'aggiornamento al server
      fetch('/restaurant/updateOrderMinutes', {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              orderId: orderId,
              minuti: ordine.minuti
          })
      })
      .then(response => {
          if (!response.ok) throw new Error('Errore nella risposta del server');
          return response.json();
      })
      .then(data => {
          if (data.success) {
              this.showNotification('Successo', 'Tempo di attesa aggiornato con successo!', 'success');
              // Ricarica la pagina dopo 1 secondo
              setTimeout(() => window.location.reload(), 1000);
          }
      })
      .catch(error => {
          this.showNotification('Errore', 'Errore nell\'aggiornamento dei minuti', 'error');
          console.error('Errore:', error);
      });
    },

    /**
     * Segna un ordine come consegnato
     * @param {string} orderId - ID dell'ordine da segnare come consegnato
     */
    markAsDelivered(orderId) {
      fetch('/restaurant/markasdelivered', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: orderId })
      })
      .then(response => {
        if (!response.ok) throw new Error('Errore nella risposta del server');
        return response.json();
      })
      .then(data => {
        if (data.success) {
          this.showNotification('Successo', 'Ordine segnalato come consegnato!', 'success');
          // Aggiorna lo stato locale dell'ordine
          const orderIndex = this.ordini.findIndex(o => o._id === orderId);
          if (orderIndex !== -1) {
            this.ordini[orderIndex].status.status = 'consegnato';
            this.ordini = [...this.ordini]; // Forza il re-rendering
          }
        }
      })
      .catch(error => {
        this.showNotification('Errore', 'Errore di comunicazione col server', 'error');
        console.error('Errore:', error);
      });
    },

    /**
     * Verifica se il tempo di un ordine è scaduto
     * @param {string} expireDate - Data di scadenza
     * @returns {boolean} True se il tempo è scaduto
     */
    isTimeExpired(expireDate) {
      if (!expireDate) return false;
      return new Date(expireDate) <= new Date();
    },

    /**
     * Calcola il tempo rimanente per un ordine
     * @param {string} expireDate - Data di scadenza
     * @returns {string} Tempo rimanente formattato
     */
    calculateTimeRemaining(expireDate) {
      if (!expireDate) return 'Non specificato';
      if (this.isTimeExpired(expireDate)) return 'Tempo scaduto';
      
      const diffMins = Math.round((new Date(expireDate) - new Date()) / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const remainingMins = diffMins % 60;
      
      if (diffHours > 0) {
        return `${diffHours}h ${remainingMins}m`;
      }
      return `${diffMins}m`;
    },

    /**
     * Verifica se il tempo rimanente è in stato di warning (<15 min)
     * @param {string} expireDate - Data di scadenza
     * @returns {boolean} True se il tempo è in warning
     */
    isTimeWarning(expireDate) {
      if (!expireDate) return false;
      const now = new Date();
      const expire = new Date(expireDate);
      const diffMins = Math.round((expire - now) / 60000);
      return diffMins > 0 && diffMins <= 15;
    },

    /**
     * Verifica se il tempo rimanente è in stato di pericolo (scaduto)
     * @param {string} expireDate - Data di scadenza
     * @returns {boolean} True se il tempo è scaduto
     */
    isTimeDanger(expireDate) {
      if (!expireDate) return false;
      const now = new Date();
      const expire = new Date(expireDate);
      const diffMins = Math.round((expire - now) / 60000);
      return diffMins <= 0;
    },

    /**
     * Avvia il timer per l'aggiornamento periodico del tempo rimanente
     * Aggiorna ogni minuto
     */
    updateTimeRemaining() {
      setInterval(() => {
        this.ordini.forEach(ordine => {
          if (ordine.status?.expireDate) {
            // Forza l'aggiornamento del DOM
            ordine.status.expireDate = new Date(ordine.status.expireDate);
          }
        });
      }, 60000);
    }
  }
}