function accountForm() {
    return {
      /* === Stato === */
      form: {
        nome: '',
        cognome: '',
        username: '',
        email: '',
        indirizzo_consegna: '',
        telefono: ''
      },
      success: false,
      error: false,
      message: '',

      /* === Metodi === */
      async fetchData() {
        try {
          const res = await fetch('/costumer/accountData', { credentials: 'include' });
          if (!res.ok) throw new Error('Errore caricamento dati');
          const data = await res.json();
          this.form = {
            nome: data.nome || '',
            cognome: data.cognome || '',
            username: data.username || '',
            email: data.email || '',
            indirizzo_consegna: data.indirizzo_consegna || '',
            telefono: data.telefono || ''
          };
        } catch (e) {
          this.error = true;
          this.message = '❌ Impossibile caricare i dati utente';
        }
      },

      handleResponse(responseText) {
        try {
          const data = JSON.parse(responseText);
          if (data.success) {
            this.success = true;
            this.error = false;
            this.message = '✅ Modifiche salvate con successo!';
          } else {
            this.error = true;
            this.message = data.error || '❌ Errore sconosciuto';
          }
        } catch {
          this.error = true;
          this.message = '❌ Risposta del server non valida';
        }
      },

      async logout() {
        try {
          const res = await fetch('/auth/logout', { method: 'POST', credentials: 'include' });
          if (res.ok) {
            const data = await res.json();
            window.location.href = data.redirect || '/';
          } else {
            alert('Errore durante il logout');
          }
        } catch {
          alert('Errore durante il logout');
        }
      },
      async deleteAccount() {
          if (!confirm('Sei sicuro di voler eliminare il tuo account? Questa azione è irreversibile.')) return;

          try {
              const res = await fetch('/costumer/deleteAccount', {
              method: 'DELETE',
              credentials: 'include'
              });
              if (res.ok) {
              const data = await res.json();
              alert('✅ Account eliminato con successo');
              window.location.href = data.redirect || '/';
              } else {
              const error = await res.json();
              this.error = true;
              this.message = error.message || '❌ Errore durante l’eliminazione';
              }
          } catch {
              this.error = true;
              this.message = '❌ Errore di rete durante l’eliminazione';
          }
      }
    };
    
  }
  