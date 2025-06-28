/**
 * @swagger
 * tags:
 *   - name: Costumer Pages
 *     description: Pagine HTML per l'interfaccia cliente
 *   - name: Costumer API
 *     description: API per la gestione del cliente
 */

/**
 * @swagger
 * /costumer/dashboard:
 *   get:
 *     summary: Pagina dashboard del cliente
 *     tags: [Costumer Pages]
 *     responses:
 *       200:
 *         description: Pagina HTML della dashboard
 *       500:
 *         description: Errore interno del server
 *       401:
 *         description: Token non trovato
 *       403:
 *         description: Utente non costumer
 */

/**
 * @swagger
 * /costumer/getorders:
 *   get:
 *     summary: Recupera tutti gli ordini del cliente
 *     tags: [Costumer API]
 *     responses:
 *       200:
 *         description: Lista ordini con dettagli piatti
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 orders:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *       500:
 *         description: Errore interno del server
 *       401:
 *         description: Token non trovato
 *       403:
 *         description: Utente non costumer */

/**
 * @swagger
 * /costumer/neworder:
 *   get:
 *     summary: Pagina per effettuare nuovi ordini
 *     tags: [Costumer Pages]
 *     responses:
 *       200:
 *         description: Pagina HTML per nuovi ordini
 *       500:
 *         description: Errore interno del server
 *       401:
 *         description: Token non trovato
 *       403:
 *         description: Utente non costumer */

/**
 * @swagger
 * /costumer/account:
 *   get:
 *     summary: Pagina gestione account cliente
 *     tags: [Costumer Pages]
 *     responses:
 *       200:
 *         description: Pagina HTML dell'account
 *       500:
 *         description: Errore interno del server
 *       401:
 *         description: Token non trovato
 *       403:
 *         description: Utente non costumer */

/**
 * @swagger
 * /costumer/accountData:
 *   get:
 *     summary: Recupera dati account cliente
 *     tags: [Costumer API]
 *     responses:
 *       200:
 *         description: Dati dell'account cliente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Costumer'
 *       404:
 *         description: Cliente non trovato
 *       500:
 *         description: Errore interno del server
 *       401:
 *         description: Token non trovato
 *       403:
 *         description: Utente non costumer */

/**
 * @swagger
 * /costumer/{id}:
 *   get:
 *     summary: Pagina dettaglio ristorante
 *     tags: [Costumer Pages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pagina HTML del ristorante
 *       500:
 *         description: Errore interno del server
 *       401:
 *         description: Token non trovato
 *       403:
 *         description: Utente non costumer */

/**
 * @swagger
 * /costumer/modifyAccount:
 *   put:
 *     summary: Modifica dati account cliente
 *     tags: [Costumer API]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               cognome:
 *                 type: string
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               indirizzo_consegna:
 *                 type: string
 *               telefono:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Account aggiornato con successo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *       400:
 *         description: Dati non validi
 *       404:
 *         description: Cliente non trovato
 *       500:
 *         description: Errore interno del server
 *       401:
 *         description: Token non trovato
 *       403:
 *         description: Utente non costumer */

/**
 * @swagger
 * /costumer/deleteAccount:
 *   delete:
 *     summary: Elimina account cliente
 *     tags: [Costumer API]
 *     responses:
 *       200:
 *         description: Account eliminato con successo
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
 *       404:
 *         description: Cliente non trovato
 *       500:
 *         description: Errore interno del server
 *       401:
 *         description: Token non trovato
 *       403:
 *         description: Utente non costumer */

/**
 * @swagger
 * /customer/favoriteproduct:
 *   get:
 *     summary: Ottiene il prodotto più acquistato dall'utente
 *     description: Restituisce il piatto che l'utente ha acquistato più frequentemente con la quantità totale
 *     tags: [Customer API]
 *     responses:
 *       200:
 *         description: Successo - Restituisce il prodotto più acquistato
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 mostPurchasedProduct:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "507f1f77bcf86cd799439011"
 *                     name:
 *                       type: string
 *                       example: "Pasta alla Carbonara"
 *                     totalQuantity:
 *                       type: number
 *                       example: 5
 *       401:
 *         description: Utente non autenticato
 *       404:
 *         description: Nessun ordine trovato o prodotto non esistente
 *       500:
 *         description: Errore interno del server
 */