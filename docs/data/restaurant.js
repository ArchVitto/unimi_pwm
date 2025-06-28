/**
 * @swagger
 * tags:
 *   - name: Restaurant Pages
 *     description: Pagine HTML per l'interfaccia ristoratore
 *   - name: Restaurant API
 *     description: API per la gestione del ristorante
 */

/**
 * @swagger
 * /restaurant/dashboard:
 *   get:
 *     summary: Pagina dashboard del ristoratore
 *     tags: [Restaurant Pages]
 *     responses:
 *       200:
 *         description: Pagina HTML della dashboard
 *       500:
 *         description: Errore interno del server
 *       401:
 *         description: Token non trovato
 *       403:
 *         description: Utente non restaurant
 */

/**
 * @swagger
 * /restaurant/neworder:
 *   get:
 *     summary: Pagina per nuovi ordini 
 *     tags: [Restaurant Pages]
 *     responses:
 *       200:
 *         description: Pagina HTML per gestione ordini
 *       500:
 *         description: Errore interno del server
 *       401:
 *         description: Token non trovato
 *       403:
 *         description: Utente non restaurant
 */

/**
 * @swagger
 * /restaurant/{id}:
 *   get:
 *     summary: Pagina dettaglio piatto
 *     tags: [Restaurant Pages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pagina HTML del piatto
 *       404:
 *         description: Piatto non trovato
 *       500:
 *         description: Errore interno del server
 *       401:
 *         description: Token non trovato
 *       403:
 *         description: Utente non restaurant
 */

/**
 * @swagger
 * /restaurant/new:
 *   get:
 *     summary: Pagina per aggiungere nuovi piatti
 *     tags: [Restaurant Pages]
 *     responses:
 *       200:
 *         description: Pagina HTML per creazione piatto
 *       500:
 *         description: Errore interno del server
 *       401:
 *         description: Token non trovato
 *       403:
 *         description: Utente non restaurant
 */

/**
 * @swagger
 * /restaurant/account:
 *   get:
 *     summary: Pagina gestione account
 *     tags: [Restaurant Pages]
 *     responses:
 *       200:
 *         description: Pagina HTML dell'account
 *       500:
 *         description: Errore interno del server
 *       401:
 *         description: Token non trovato
 *       403:
 *         description: Utente non restaurant
 */

/**
 * @swagger
 * /restaurant/accountData:
 *   get:
 *     summary: Recupera dati account ristoratore
 *     tags: [Restaurant API]
 *     responses:
 *       200:
 *         description: Dati del ristorante
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Restaurant'
 *       404:
 *         description: Ristorante non trovato
 *       500:
 *         description: Errore interno del server
 *       401:
 *         description: Token non trovato
 *       403:
 *         description: Utente non restaurant
 */

/**
 * @swagger
 * /restaurant/activeList:
 *   get:
 *     summary: Lista ristoranti attivi
 *     tags: [Restaurant API]
 *     responses:
 *       200:
 *         description: Lista ristoranti con piatti disponibili
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Restaurant'
 *       500:
 *         description: Errore interno del server
 *       401:
 *         description: Token non trovato
 */

/**
 * @swagger
 * /restaurant/neworder:
 *   post:
 *     summary: Crea un nuovo ordine 
 *     tags: [Costumer API]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cart:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     price:
 *                       type: number
 *                     quantity:
 *                       type: number
 *               cardHolder:
 *                 type: string
 *               partitaIva:
 *                 type: string
 *     responses:
 *       200:
 *         description: Ordine creato con successo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Dati ordine non validi
 *       500:
 *         description: Errore interno del server
 *       401:
 *         description: Token non trovato
 *       403:
 *         description: Utente non costumer
 */

/**
 * @swagger
 * /restaurant/partitaiva:
 *   get:
 *     summary: Recupera partita IVA ristoratore
 *     tags: [Restaurant API]
 *     responses:
 *       200:
 *         description: Partita IVA del ristorante autenticato
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 partita_iva:
 *                   $ref: '#/components/schemas/Restaurant/properties/partita_iva'
 *       400:
 *         description: Partita IVA non trovata
 *       500:
 *         description: Errore interno del server
 *       401:
 *         description: Token non trovato
 *       403:
 *         description: Utente non restaurant
 */

/**
 * @swagger
 * /restaurant/getorders:
 *   get:
 *     summary: Recupera ordini del ristorante
 *     tags: [Restaurant API]
 *     responses:
 *       200:
 *         description: Lista ordini con dettagli piatti
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       500:
 *         description: Errore interno del server
 *       401:
 *         description: Token non trovato
 *       403:
 *         description: Utente non restaurant
 */

/**
 * @swagger
 * /restaurant/account:
 *   put:
 *     summary: Aggiorna dati account
 *     tags: [Restaurant API]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Restaurant'
 *     responses:
 *       200:
 *         description: Account aggiornato
 *       400:
 *         description: Dati non validi
 *       404:
 *         description: Ristorante non trovato
 *       500:
 *         description: Errore interno del server
 *       401:
 *         description: Token non trovato
 *       403:
 *         description: Utente non restaurant
 */

/**
 * @swagger
 * /restaurant/updateOrderMinutes:
 *   put:
 *     summary: Aggiorna tempo preparazione ordine
 *     tags: [Restaurant API]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: string
 *               minuti:
 *                 type: number
 *     responses:
 *       200:
 *         description: Tempo aggiornato
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Dati non validi
 *       404:
 *         description: Ordine non trovato
 *       500:
 *         description: Errore interno del server
 *       401:
 *         description: Token non trovato
 *       403:
 *         description: Utente non restaurant
 */

/**
 * @swagger
 * /restaurant/markasdelivered:
 *   put:
 *     summary: Segna ordine come consegnato
 *     tags: [Restaurant API]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Ordine aggiornato
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: ID ordine mancante
 *       404:
 *         description: Ordine non trovato
 *       500:
 *         description: Errore interno del server
 *       401:
 *         description: Token non trovato
 *       403:
 *         description: Utente non restaurant
 */

/**
 * @swagger
 * /restaurant/deleteRestaurant:
 *   delete:
 *     summary: Elimina account ristoratore
 *     tags: [Restaurant API]
 *     responses:
 *       200:
 *         description: Account eliminato
 *       400:
 *         description: Partita IVA mancante
 *       404:
 *         description: Ristorante non trovato
 *       500:
 *         description: Errore interno del server
 *       401:
 *         description: Token non trovato
 *       403:
 *         description: Utente non restaurant oppure Ordini attivi presenti
 */