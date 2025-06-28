// Importazione delle librerie necessarie
import express from 'express' // Framework per creare il server web
import mongoose from 'mongoose' // ODM per MongoDB
import cors from 'cors' // Middleware per abilitare CORS
import dotenv from 'dotenv' // Per leggere le variabili d'ambiente da .env
import cookieParser from 'cookie-parser' // Per parsare i cookie nelle richieste
import http from 'http' // Modulo HTTP nativo di Node
import { Server } from 'socket.io' // Libreria per WebSocket
import sanitize from 'express-mongo-sanitize' //Librearia per prevenire no-sql injection

// Importazione dei router definiti separatamente
import mealsRoutes from './routes/meals.js' // Route per la gestione dei pasti
import authRoutes from './routes/auth.js' // Route per l'autenticazione
import costumerRoutes from './routes/costumer.js' // Route per i clienti (nota: typo "costumer" invece di "customer")
import restaurantRoutes from './routes/restaurant.js' // Route per i ristoranti
import apiRoutes from './routes/api.js' // Route per API generiche

// Inizializzazione dell'app Express
const app = express()

// Caricamento delle variabili d'ambiente dal file .env
dotenv.config()

// Impostazione della porta, prende da .env o usa 3000 come default
const PORT = process.env.PORT || 3000

/******************************************
 * Configurazione del Server HTTP e WebSocket
 ******************************************/

// Creazione del server HTTP usando il modulo nativo
// (necessario per Socket.IO)
const server = http.createServer(app)

// Creazione dell'istanza di Socket.IO per le connessioni realtime
const io = new Server(server, {
  cors: {
    origin: '*', // Accetta connessioni da qualsiasi origine (in produzione limitare!)
    methods: ['GET', 'POST'] // Metodi HTTP permessi
  }
})

/******************************************
 * Middleware
 ******************************************/
app.use(express.json()) // Middleware per parsare il body in JSON
app.use(cors()) // Abilita CORS per tutte le routes
app.use(express.urlencoded({ extended: true })) // Parsa i dati delle form URL-encoded
app.use(cookieParser()) // Abilita la gestione dei cookie
app.use(express.static('public')) // Serve file statici dalla cartella 'public'
app.use(sanitize()) //Prevengo no-sql injection

// Middleware personalizzato per iniettare l'istanza di Socket.IO nelle request
// Permette di usare io nei controller con req.io
app.use((req, res, next) => {
  req.io = io
  next()
})

/******************************************
 * Definizione delle Routes
 ******************************************/
app.use('/meals', mealsRoutes) // Tutte le routes per i pasti iniziano con /meals
app.use('/auth', authRoutes) // Routes per l'autenticazione (/auth/login, /auth/register ecc.)
app.use('/costumer', costumerRoutes) // Routes per le operazioni dei clienti
app.use('/restaurant', restaurantRoutes) // Routes per le operazioni dei ristoranti
app.use('/api', apiRoutes) // Altre API generiche

// Route di fallback per gestire gli URL non trovati (404)
app.use((req, res, next) => {
  res.status(404).sendFile('html/404.html', { root: 'public' })
})

/******************************************
 * Connessione al Database e Avvio Server
 ******************************************/
mongoose.connect(process.env.CONNECTION_URL) // Connessione a MongoDB usando l'URL dal .env
  .then(() => {
      // Avvio del server solo dopo la connessione al DB
      server.listen(PORT, '0.0.0.0', () => { // '0.0.0.0' rende accessibile in LAN
        console.log(`🚀 Server avviato su http://localhost:${PORT}`)
        console.log(`🌍 Accessibile in LAN su http://local_ip:${PORT}`)
      })
  })
  .catch(error => console.error(error)) // Gestione degli errori di connessione

/******************************************
 * Gestione delle Connessioni WebSocket
 ******************************************/
io.on('connection', socket => {
  console.log(`🟢 Nuova connessione socket: ${socket.id}`)

  // Gestione dell'evento 'joinRoom' - un client si unisce a una stanza
  socket.on('joinRoom', partitaIva => {
    socket.join(partitaIva) // Il client entra in una stanza identificata dalla partita IVA
    console.log(`🔔 Socket ${socket.id} è entrato nella stanza: ${partitaIva}`)
  })

  // Gestione della disconnessione del client
  socket.on('disconnect', () => {
    console.log(`🔴 Disconnessione socket: ${socket.id}`)
  })
})