/**
 * @swagger
 * tags:
 *   - name: Authentication API
 *     description: Operazioni di autenticazione e gestione utenti
 *   - name: Auth Pages
 *     description: Endpoint per il rendering delle pagine HTML
 */


/**
 * @swagger
 * /auth/login:
 *   get:
 *     summary: Restituisce la pagina HTML di login generica
 *     tags: [Auth Pages]
 *     responses:
 *       200:
 *         description: Pagina HTML di login
 *       500:
 *         description: Errore interno del server
 */

/**
 * @swagger
 * /auth/login/costumer:
 *   get:
 *     summary: Restituisce la pagina HTML di login per clienti
 *     tags: [Auth Pages]
 *     responses:
 *       200:
 *         description: Pagina HTML di login per clienti
 *       500:
 *         description: Errore interno del server
 */

/**
 * @swagger
 * /auth/login/restaurant:
 *   get:
 *     summary: Restituisce la pagina HTML di login per ristoratori
 *     tags: [Auth Pages]
 *     responses:
 *       200:
 *         description: Pagina HTML di login per ristoratori
 *       500:
 *         description: Errore interno del server
 */

/**
 * @swagger
 * /auth/register:
 *   get:
 *     summary: Restituisce la pagina HTML di registrazione generica
 *     tags: [Auth Pages]
 *     responses:
 *       200:
 *         description: Pagina HTML di registrazione
 *       500:
 *         description: Errore interno del server
 */

/**
 * @swagger
 * /auth/register/costumer:
 *   get:
 *     summary: Restituisce la pagina HTML di registrazione per clienti
 *     tags: [Auth Pages]
 *     responses:
 *       200:
 *         description: Pagina HTML di registrazione per clienti
 *       500:
 *         description: Errore interno del server
 */

/**
 * @swagger
 * /auth/register/restaurant:
 *   get:
 *     summary: Restituisce la pagina HTML di registrazione per ristoratori
 *     tags: [Auth Pages]
 *     responses:
 *       200:
 *         description: Pagina HTML di registrazione per ristoratori
 *       500:
 *         description: Errore interno del server
 */

/**
 * @swagger
 * /auth/login/costumer:
 *   post:
 *     summary: Effettua il login di un cliente
 *     tags: [Authentication API]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: "mariorossi"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Login effettuato con successo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 token:
 *                   type: string
 *                 redirect:
 *                   type: string
 *                 costumer:
 *                   $ref: '#/components/schemas/Costumer'
 *       400:
 *         description: Dati mancanti o non validi
 *       401:
 *         description: Credenziali non valide
 *       500:
 *         description: Errore interno del server
 */

/**
 * @swagger
 * /auth/login/restaurant:
 *   post:
 *     summary: Effettua il login di un ristoratore
 *     tags: [Authentication API]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - partita_iva
 *               - password
 *             properties:
 *               partita_iva:
 *                 type: string
 *                 example: "12345678901"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Login effettuato con successo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 token:
 *                   type: string
 *                 redirect:
 *                   type: string
 *                 restaurant:
 *                   $ref: '#/components/schemas/Restaurant'
 *       400:
 *         description: Dati mancanti o non validi
 *       401:
 *         description: Credenziali non valide
 *       500:
 *         description: Errore interno del server
 */

/**
 * @swagger
 * /auth/register/costumer:
 *   post:
 *     summary: Registra un nuovo cliente
 *     tags: [Authentication API]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - cognome
 *               - username
 *               - email
 *               - password
 *               - conferma_password
 *             properties:
 *               nome:
 *                 type: string
 *                 example: "Mario"
 *               cognome:
 *                 type: string
 *                 example: "Rossi"
 *               username:
 *                 type: string
 *                 example: "mariorossi"
 *               email:
 *                 type: string
 *                 example: "mario.rossi@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               conferma_password:
 *                 type: string
 *                 example: "password123"
 *               indirizzo_consegna:
 *                 type: string
 *                 example: "Via Roma 123, Milano"
 *               telefono:
 *                 type: string
 *                 example: "+393331234567"
 *     responses:
 *       201:
 *         description: Registrazione completata con successo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 redirect:
 *                   type: string
 *                 token:
 *                   type: string
 *                 costumer:
 *                   $ref: '#/components/schemas/Costumer'
 *       400:
 *         description: Dati mancanti o non validi
 *       409:
 *         description: Username o email già in uso
 *       500:
 *         description: Errore interno del server
 */

/**
 * @swagger
 * /auth/register/restaurant:
 *   post:
 *     summary: Registra un nuovo ristoratore
 *     tags: [Authentication API]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - cognome
 *               - email
 *               - password
 *               - conferma_password
 *               - nome_ristorante
 *               - indirizzo_ristorante
 *               - partita_iva
 *               - numero_telefono
 *             properties:
 *               nome:
 *                 type: string
 *                 example: "Luigi"
 *               cognome:
 *                 type: string
 *                 example: "Bianchi"
 *               email:
 *                 type: string
 *                 example: "luigi.bianchi@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               conferma_password:
 *                 type: string
 *                 example: "password123"
 *               nome_ristorante:
 *                 type: string
 *                 example: "Ristorante Buona Tavola"
 *               indirizzo_ristorante:
 *                 type: string
 *                 example: "Via Dante 45, Roma"
 *               partita_iva:
 *                 type: string
 *                 example: "12345678901"
 *               numero_telefono:
 *                 type: string
 *                 example: "+390612345678"
 *               immagine:
 *                 type: string
 *                 example: "https://example.com/restaurant.jpg"
 *               descrizione:
 *                 type: string
 *                 example: "Ristorante tradizionale italiano"
 *     responses:
 *       201:
 *         description: Registrazione completata con successo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 redirect:
 *                   type: string
 *                 token:
 *                   type: string
 *                 restaurant:
 *                   $ref: '#/components/schemas/Restaurant'
 *       400:
 *         description: Dati mancanti o non validi
 *       409:
 *         description: Email o partita IVA già in uso
 *       500:
 *         description: Errore interno del server
 */

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Effettua il logout dell'utente
 *     tags: [Authentication API]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Logout effettuato con successo
 *       500:
 *         description: Errore interno del server
 *       401:
 *         description: Token non trovato 
 */