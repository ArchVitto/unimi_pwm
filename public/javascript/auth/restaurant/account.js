function accountForm() {
    return {
      form: {
        nome: '',
        cognome: '',
        email: '',
        nome_ristorante: '',
        indirizzo_ristorante: '',
        partita_iva: '',
        numero_telefono: '',
        immagine: '',
        descrizione: ''
      },
      success: false,
      error: false,
      message: '',
      showDeletePopup:false,
      successRemove: true,

      async fetchData() {
        try {
          const res = await fetch('/restaurant/accountData', { credentials: 'include' });
          if (!res.ok) throw new Error('Errore caricamento dati');
          const data = await res.json();
          this.form = {
            nome: data.nome || '',
            cognome: data.cognome || '',
            email: data.email || '',
            nome_ristorante: data.nome_ristorante || '',
            indirizzo_ristorante: data.indirizzo_ristorante || '',
            partita_iva: data.partita_iva || '',
            numero_telefono: data.numero_telefono || '',
            immagine: data.immagine || '',
            descrizione: data.descrizione || ''
          };
        } catch (e) {
          this.success = false;
          this.error = true;
          this.message = '❌ Impossibile caricare i dati utente';
        }
      },

      handleResponse(responseText) {
        try {
          const data = JSON.parse(responseText);
          if (data.success) {
            this.success = true;
            this.error = false;
            this.message = '✅ Modifiche salvate con successo!';
          } else {
            this.success = false;
            this.error = true;
            this.message = data.error || '❌ Errore sconosciuto';
          }
        } catch (e) {
          this.success = false;
          this.error = true;
          this.message = '❌ Risposta del server non valida';
        }
      },

      async logout() {
        try {
          const res = await fetch('/auth/logout', {
            method: 'POST',
            credentials: 'include'
          });

          if (res.ok) {
            const data = await res.json();
            if (data.redirect) {
              window.location.href = data.redirect;
            } else {
              alert('Logout effettuato, ma nessun redirect specificato.');
            }
          } else {
            alert('Errore durante il logout');
          }
        } catch (err) {
          alert('Errore durante il logout');
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
      
      async confirmDeletePopup() {
        try {
          const response = await fetch('/restaurant/deleteRestaurant', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          const data = await response.json();

          if (response.ok) {
            this.message = data.message || 'Ristorante eliminato con successo!';
            this.successRemove = true;
            this.showDeletePopup = false;

            // Redirect dopo un breve delay
            setTimeout(() => {
              window.location.href = data.redirect;
            }, 1500);
          } else {
            throw new Error(data.error);
            
          }
        } catch (error) {
          this.message = 'Errore: ' + error.message;
          this.successRemove = false;
          setTimeout(() => {
            this.showDeletePopup = false;
            this.successRemove = true;
          }, 3000);

        }
      }
    }
  }