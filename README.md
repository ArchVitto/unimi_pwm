# Progetto PWM 2025/26
<p align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/a/ad/Unimi-logo.png" alt="Logo UNIMI">
</p>

## Autore 
**Nominativo:** Vittorio Moretti  
**Data:** 07/2025  
**Corso:** SSRI Unimi  
**Matricola:** 61623A  

---

## Indice  
[Introduzione](#1-introduzione)  
[Materiale fornito](#2-materiale-fornito)  
[Funzionalità Principali](#3-funzionalità-principali)  
[Realizzazione](#4-realizzazione)  
[Deployment](#5-deployment)
---

# 1. Introduzione  
### 1.1 Definizione del problema  
Il progetto richiede lo sviluppo di un'applicazione web per l'ordinazione e la gestione di piatti in un contesto di fast food. L'applicazione deve supportare quattro macro-aree funzionali:  
1. **Gestione del profilo utente**  
2. **Gestione del ristorante** 
3. **Gestione degli ordini**
4. **Gestione delle consegne**   

### 1.2 Strumenti usati  
#### **Frontend**  
- HTML5, CSS3, Bootstrap  
- AlpineJS,HTMX,JavaScript

#### **Backend**  
- NodeJS + Express 
- Mongoose  

#### **Database**  
- MongoDB 

---

# 2. Materiale fornito

Per la realizzazione del progetto è stato fornito:
- Relazione pdf contenente la struttura del problema a grandi linee
- File JSON contenente 302 record di piatti comuni a tutti i ristoranti

Per creare:
- **Il Codice sorgente**   
- **Relazione PDF** 
- **Schermate dimostrative**  

---

# 3. Funzionalità Principali  
### 3.1 **Gestione Profilo Utente**  
- Registrazione/login per **clienti** e **ristoratori**.  
- Modifica/cancellazione account.  
- Scelta tipologia utenza (cliente/ristoratore) in fase di registrazione.  

### 3.2 **Gestione Ristorante**  
- Inserimento/modifica di:  
  - Dati ristorante (nome, indirizzo, partita IVA).  
  - Menu (piatti selezionabili da una lista comune o personalizzati).  
- Gestione di:  
  - Foto, ingredienti, allergeni, prezzi dei piatti.  

### 3.3 **Gestione Ordini**  
- Creazione ordini con carrello.  
- Modalità di ritiro:  
  - **In loco**: Tempo di attesa calcolato in base alla coda.  
- Flusso stati ordine:  
  `Ordinato → In preparazione → Consegnato`.  

### 3.4 **Gestione Consegne**  
- Aggiornamento stato ordine (es. segnalazione "consegnato").

---

# 4. Realizzazione
## 4.1 Struttura del progetto

```
Root
├── controllers
│   ├── auth.js
│   ├── costumer.js
│   ├── meals.js
│   └── restaurant.js
├── data <== Contiene il json iniziale dei meal
│   └── meals.json
├── docs <== Contiene i dati per lo swagger
│   ├── components.yaml
│   ├── data
│   │   ├── auth.js
│   │   ├── costumer.js
│   │   ├── meals.js
│   │   └── restaurant.js
│   └── swagger.js
├── index.js
├── middlewares
│   └── auth.js
├── models <== modelli per mongoDB
│   ├── meal.js
│   ├── meal_price.js
│   ├── order.js
│   └── user.js
├── node_modules  <== omesso il contenuto per leggibilità
├── package.json
├── package-lock.json
├── public <== contiene i file statici
│   ├── css
│   │   ├── auth
│   │   │   ├── costumer
│   │   │   │   ├── account.css
│   │   │   │   ├── dashboard.css
│   │   │   │   ├── menu.css
│   │   │   │   └── order.css
│   │   │   └── restaurant
│   │   │       ├── account.css
│   │   │       ├── dashboard.css
│   │   │       ├── meal.css
│   │   │       ├── new.css
│   │   │       └── order.css
│   │   └── login_register
│   │       ├── login.css
│   │       └── register.css
│   ├── html
│   │   ├── 404.html
│   │   ├── auth
│   │   │   ├── costumer
│   │   │   │   ├── account.html
│   │   │   │   ├── dashboard.html
│   │   │   │   ├── menu.html
│   │   │   │   └── order.html
│   │   │   └── restaurant
│   │   │       ├── account.html
│   │   │       ├── dashboard.html
│   │   │       ├── meal.html
│   │   │       ├── new.html
│   │   │       └── order.html
│   │   └── login_register
│   │       ├── login_costumer.html
│   │       ├── login.html
│   │       ├── login_restaurant.html
│   │       ├── register_costumer.html
│   │       ├── register.html
│   │       └── register_restaurant.html
│   └── javascript
│       ├── 404.js
│       ├── auth
│       │   ├── costumer
│       │   │   ├── account.js
│       │   │   ├── dashboard.js
│       │   │   ├── menu.js
│       │   │   └── order.js
│       │   └── restaurant
│       │       ├── account.js
│       │       ├── dashboard.js
│       │       ├── meal.js
│       │       ├── new.js
│       │       └── order.js
│       └── login_register
│           ├── login_costumer.js
│           ├── login.js
│           ├── login_restaurant.js
│           ├── register_costumer.js
│           ├── register.js
│           └── register_restaurant.js
├── README.md
├── routes <== gestisce le rotte
│   ├── api.js
│   ├── auth.js
│   ├── costumer.js
│   ├── meals.js
│   └── restaurant.js
└── scripts <== Script per popolare il database con i dati del json (/data/meal.json)
    └── import_meals.js


```

## 4.2 Architettura Backend
Il backend è stato implementato utilizzando **Node.js** con **Express** come framework, seguendo un'architettura organizzata in routes e controller. Le principali componenti sono:

- **Server HTTP/WebSocket**: Configurato per gestire sia richieste REST che comunicazioni real-time.
- **Middleware**: Stack essenziali per sicurezza e parsing dei dati.
- **Database**: Connessione a MongoDB tramite Mongoose (proteggendo da no-sql injection).
- **API Routes**: Endpoint divisi in rotte.

## 4.3 Gestione delle Routes

Le API sono organizzate in moduli strutturati per garantire una chiara separazione delle responsabilità:

```javascript
// Configurazione delle routes principali
app.use('/auth', authRoutes)        // Autenticazione e registrazione
app.use('/meals', mealsRoutes)      // Gestione dei piatti
app.use('/costumer', costumerRoutes)// Operazioni specifiche per i clienti
app.use('/restaurant', restaurantRoutes) // Operazioni specifiche per i ristoratori
app.use('/api', apiRoutes)          // Contenente le 2 pagine dello swagger
```

### 4.3.1 Gestione Autenticazione (/auth)

Il router `/auth` gestisce tutti i processi di autenticazione e registrazione per clienti e ristoratori. Le principali funzionalità includono: 
- la gestione del login/registrazione gli utenti
- la gestione delle pagine html per il login/registrazione
- la creazione di una sessione
- la separazione di privilegi fra cliente e ristoratore 
- la distruzione di una sessione

### 4.3.2 Gestione Piatti (/meals)

Il controller `/meals` gestisce tutte le operazioni relative alla gestione del CRUD dei piatti. Le principali funzionalità includono:

- La gestione CRUD dei piatti
- La gestione dei prezzi personalizzati per ogni ristoratore
- La visualizzazione differenziata tra piatti pubblici e privati
- L'organizzazione dei piatti per ristorante

### 4.3.3 Gestione Clienti (/costumer)

Il router `/costumer` gestisce tutte le operazioni relative all'area cliente dell'applicazione. Le principali caratteristiche includono:
- La gestione CRUD del profilo del cliente
- La possibilità di fare nuovi ordini di grandezza variabile da un singolo ristorante
- Visualizzazione dello storico ordini
- Accesso alle pagine dell'interfaccia utente
- La personalizzazione dell'account evidenziando il piatto e i tag preferiti
- Eliminazione dell'account


### 4.3.4 Gestione Ristorante (/restaurant)

Il controller `/restaurant` gestisce tutte le operazioni relative alla gestione del ristorante, degli ordini e dell'account. Le principali funzionalità includono:

- La gestione delle pagine HTML per l'area ristoratore
- La gestione CRUD del profilo del ristorante
- L'elaborazione e tracking degli ordini
- La gestione dei tempi di preparazione
- La gestione del socket per avere la notifica di nuovi ordini in tempo reale 

### 4.3.5 Gestione Swagger (/api)

Il controller `/api` gestisce le due pagine dello swagger una per il cliente e una per il ristorante 

## 4.4 Middleware

## 4.4.1 Auth

Quasi tutte le rotte sono protette da due middleware di autenticazione (ad eccezione di `/auth` che presenta la gran parte delle rotte scoperte).

Per accedere è necessario possedere un token nei cookie che verra validato da authenticateToken e authorizeRole

La gran parte quindi si presenta cosi
```javascript
router.metodoHTTP('/rotta',authenticateToken,authorizeRole('ruolo'), metodoNodeJS)
```

**authenticateToken**: Verifica la validità del JWT estratto dai cookie utilizzando la chiave segreta. Gestisce due possibili errori:

- 401 Unauthorized: Token non presente nei cookie
- 403 Forbidden: Token non valido o scaduto

```javascript
export const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;  // Legge il token dal cookie

    if (!token) {
        return res.sendStatus(401);  // Token non presente
    }

    jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
        if (error) {
            console.log(error);
            return res.sendStatus(403);  // Token non valido/scaduto
        }

        req.user = user;  // Aggiunge i dati dell'utente alla request
        next();
    });
};
```

**authorizeRole**: Controlla che l'utente autenticato abbia uno dei ruoli richiesti. Genera un errore:

- 403 Forbidden: Ruolo dell'utente non tra quelli autorizzati

```javascript
export const authorizeRole = (...allowedRoles) => {
    return (req, res, next) => {
        console.log('Ruolo nel token:', req.user.role); 
        console.log('Ruoli ammessi:', allowedRoles); 
        
        if (!allowedRoles.includes(req.user.role)) {
            return res.sendStatus(403);  // Ruolo non autorizzato
        }
        next();
    };
};
```
## 4.4.2 Validazione 
Sono inoltre presenti altri middleware per validare il contenuto dei form come ad esempio;

```javascript
//Snippet del middleware per validare i dati della carta
export const validateCardData = (req, res, next) => {
    const { cardNumber, cardHolder, expiry, cvc } = req.body;
  
    // Log dei dati ricevuti
    console.log('🔍 Validazione dati carta...');
    console.log('💳 Numero carta:', cardNumber);
    console.log('👤 Intestatario:', cardHolder);
    console.log('📅 Scadenza:', expiry);
    console.log('🔒 CVC:', cvc);
  
    // Controlli logici base
    const isCardNumberValid = /^[0-9]{16}$/.test(cardNumber);
    const isExpiryValid = /^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry); // MM/YY
    const isCVCValid = /^[0-9]{3,4}$/.test(cvc);
    const isHolderValid = typeof cardHolder === 'string' && cardHolder.trim().length > 0;
  
    // Log dei risultati di validazione
    console.log('✅ Numero carta valido?', isCardNumberValid);
    console.log('✅ Scadenza valida?', isExpiryValid);
    console.log('✅ CVC valido?', isCVCValid);
    console.log('✅ Intestatario valido?', isHolderValid);
  
    if (!isCardNumberValid || !isExpiryValid || !isCVCValid || !isHolderValid) {
      console.warn('❌ Validazione fallita.');
      return res.status(400).json({
        success: false,
        message: 'Dati della carta non validi. Controlla e riprova.'
      });
    }
  
    console.log('✅ Validazione superata, si procede all\'ordine.');
    next();
  };
```
## 4.5 Model e DB
# Schemi Mongoose - Tabelle

Sono presenti 5 tabelle:

- **Restaurant**: memorizza i dati degli utenti ristoratori e le loro informazioni aziendali.  
- **Costumer**: memorizza i dati degli utenti clienti e le loro informazioni di contatto e autenticazione.  
- **Meal**: contiene i dettagli dei piatti offerte dai ristoranti, inclusi ingredienti e istruzioni.  
- **MealPrice**: associa il prezzo di ogni pasto alla partita IVA del ristorante che lo propone.  
- **Order**: registra gli ordini effettuati dai clienti, con dettagli prodotti, stato e date.  

---

### 4.5.1. Restaurant Schema

| Campo               | Tipo     | Descrizione & Note                                      |
|---------------------|----------|---------------------------------------------------------|
| tipo_utente         | String   | Tipo utente, default: 'ristoratore', enum: ['ristoratore']|
| nome                | String   | Nome (**obbligatorio**, trim, minlength 2)              |
| cognome             | String   | Cognome (**obbligatorio**, trim, minlength 2)           |
| email               | String   | Email unica, valida, lowercase, trim (**obbligatorio**)  |
| password            | String   | Password (**obbligatorio**, minlength 5)                 |
| nome_ristorante     | String   | Nome ristorante (**obbligatorio**, trim, 2-100 caratteri)|
| indirizzo_ristorante| String   | Indirizzo ristorante (**obbligatorio**, trim, minlength 5)|
| numero_telefono     | String   | Numero telefono valido (regex), **obbligatorio**        |
| immagine            | String   | URL immagine valida (regex)                              |
| descrizione         | String   | Descrizione (max 1000 caratteri)                         |
| partita_iva         | String   | Partita IVA valida (11 cifre), unica, trim, **obbligatorio** |
| data_registrazione  | Date     | Data registrazione, default: Date.now                    |

**Metodi:**
- `verifyPassword(password)` — verifica la password hashata
- `generateAuthToken()` — genera token JWT

---

### 4.5.2. Costumer Schema

| Campo               | Tipo     | Descrizione & Note                                    |
|---------------------|----------|-------------------------------------------------------|
| tipo_utente         | String   | Tipo utente, default: 'cliente', enum: ['cliente']    |
| nome                | String   | Nome cliente (**obbligatorio**, trim, minlength 2)    |
| cognome             | String   | Cognome cliente (**obbligatorio**, trim, minlength 2) |
| username            | String   | Username unico (**obbligatorio**, trim, 3-30 caratteri)|
| email               | String   | Email unica, valida, lowercase, trim (**obbligatorio**)|
| password            | String   | Password (**obbligatorio**, minlength 5)              |
| indirizzo_consegna  | String   | Indirizzo di consegna, default: '' (trim)             |
| telefono            | String   | Numero telefono, validato da regex, default: ''       |
| data_registrazione  | Date     | Data di registrazione, default: Date.now               |

**Metodi:**
- `verifyPassword(password)` — verifica la password hashata
- `generateAuthToken()` — genera token JWT

---

### 4.5.3. Meal Schema

| Campo                        | Tipo       | Descrizione                                |
|-----------------------------|------------|--------------------------------------------|
| idMeal                      | String     | ID del pasto                               |
| strMeal                     | String     | Nome del pasto (**obbligatorio**)          |
| strMealAlternate            | String     | Nome alternativo del pasto                 |
| strCategory                 | String     | Categoria del pasto                        |
| strArea                     | String     | Area geografica (**obbligatorio**)         |
| strInstructions             | String     | Istruzioni di preparazione (**obbligatorio**)|
| strMealThumb                | String     | URL immagine del pasto                     |
| strTags                     | String     | Tag descrittivi          |
| strYoutube                  | String     | Link al video YouTube                      |
| strSource                   | String     | Fonte della ricetta                        |
| strImageSource              | String     | Fonte dell'immagine                        |
| strCreativeCommonsConfirmed | String     | Conferma licenza Creative Commons          |
| dateModified                | String     | Data di modifica                           |
| ingredients                 | [String]   | Lista ingredienti                          |
| measures                    | [String]   | Lista misure corrispondenti agli ingredienti |
| partita_iva                 | String     | Partita IVA (**obbligatorio**, con trim)   |

---

### 4.5.4. MealPrice Schema

| Campo       | Tipo   | Descrizione                 |
|-------------|--------|-----------------------------|
| idMeal      | String | ID del pasto                |
| partita_iva | String | Partita IVA del fornitore   |
| price       | Number | Prezzo del pasto            |

---

### 4.5. Order Schema

| Campo        | Tipo             | Descrizione                                                                 |
|--------------|------------------|-----------------------------------------------------------------------------|
| username     | String           | Nome utente (**obbligatorio**)                                             |
| cardHolder   | String           | Intestatario della carta (**obbligatorio**)                                |
| partitaIva   | String           | Partita IVA del ristorante (**obbligatorio**)                              |
| total        | Number           | Totale dell’ordine (**obbligatorio**)                                      |
| products     | Array di oggetti | Elenco dei prodotti ordinati                                               |
| └─ name      | String           | Nome del prodotto                                                           |
| └─ price     | Number           | Prezzo del prodotto                                                         |
| └─ quantity  | Number           | Quantità del prodotto                                                       |
| status       | Oggetto          | Stato dell’ordine                                                           |
| └─ status    | String (enum)    | Stato attuale (`ordinato`, `in preparazione`, `consegnato`, `annullato`)   |
| └─ startDate | Date             | Data inizio preparazione (facoltativo)                                     |
| └─ expireDate| Date             | Data prevista di consegna (facoltativa)                                    |
| orderDate    | Date             | Data dell’ordine (default: **Date.now**)                                   |

### 4.6 Front-end

#### 1. Pagina 404
- `404.html`: Pagina di errore standard per URL non trovati

#### 2. Area di Autenticazione (`auth/`)
Contiene le pagine riservate agli utenti autenticati, divise per tipologia:

#### Per Clienti (`costumer/`)
- `account.html`: Gestione profilo utente
- `dashboard.html`: Pagina principale dopo il login
- `menu.html`: Visualizzazione menù ristorante scelto con possibilità di ordine
- `order.html`: Visualizazione ordini attuali e passati

#### Per Ristoranti (`restaurant/`)
- `account.html`: Gestione profilo ristorante
- `dashboard.html`: Pannello di controllo
- `meal.html`: Gestione piatti
- `new.html`: Creazione nuovi piatti (presumibilmente)
- `order.html`: Gestione ordini ricevuti

### 3. Login e Registrazione (`login_register/`)
Pagine per l'accesso e la registrazione, differenziate per tipologia di utente:

#### Pagine di Login
- `login.html`: Pagina generica/login principale
- `login_costumer.html`: Login specifico per clienti
- `login_restaurant.html`: Login specifico per ristoranti

#### Pagine di Registrazione
- `register.html`: Pagina generica/registrazione principale
- `register_costumer.html`: Registrazione clienti
- `register_restaurant.html`: Registrazione ristoranti

### 4.7 Socket

Lato ordini si è deciso di configurare un web socket per garantire l'aggiornamento degli ordini anche senza un refresh della pagina; a seguito ecco un diagramma architetturale

```Mermaid
sequenceDiagram
    participant Client as Client (Frontend)'
    participant ServerWS as WebSocket Server
    participant ServerHTTP as HTTP Server
    
    Client->>ServerWS: Connessione WS (con cookie sessione)
    ServerWS-->>Client: Ack connessione
    Client->>ServerWS: joinRoom(partitaIva)
    
    loop Monitoraggio DB
        ServerHTTP->>ServerWS: Notifica nuovo ordine
    end
    
    ServerWS->>Client: Evento "newOrder"
    Client->>ServerHTTP: GET /restaurant/getorders
    ServerHTTP-->>Client: Dati ordini (JSON)
```

----

# 5. Deployment
Per installare il server occorre configurare il .env

```javascript
JWT_SECRET=latuajwt
CONNECTION_URL=mongodb://localhost:27017/pwm_project
PORT=3000
JWT_EXPIRES_IN ='1h'
MAX_AGE=3600000
```
Importarsi i meal con lo script `npm start import-meals` ed  eseguire i comandi `npm install` e `npm start`

