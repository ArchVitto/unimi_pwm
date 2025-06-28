/**
 * @swagger
 * tags:
 *   - name: Meal API
 *     description: Operazioni relative alla gestione dei piatti
 */

/**
 * @swagger
 * /meals/menu/{id}:
 *   get:
 *     summary: Recupera tutti i piatti di un ristorante 
 *     tags: [Costumer API]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: Partita IVA del ristorante
 *     responses:
 *       200:
 *         description: Lista piatti con prezzi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Meal'
 *       500:
 *         description: Errore interno del server
 *       401:
 *         description: Token non trovato
 *       403:
 *         description: Utente non costumer */

/**
 * @swagger
 * /meals/{id}:
 *   get:
 *     summary: Recupera un piatto per ID (per ristoratore)
 *     tags: [Meal API]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: ID del piatto
 *     responses:
 *       200:
 *         description: Dettagli del piatto
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Meal'
 *       404:
 *         description: Piatto non trovato
 *       500:
 *         description: Errore interno del server
 *       401:
 *         description: Token non trovato
 *       403:
 *         description: Utente non restaurant */

/**
 * @swagger
 * /meals/:
 *   get:
 *     summary: Recupera tutti i piatti del ristorante loggato
 *     tags: [Meal API]
 *     responses:
 *       200:
 *         description: Lista piatti con prezzi personalizzati
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Meal'
 *       500:
 *         description: Errore interno del server
 *       401:
 *         description: Token non trovato
 *       403:
 *         description: Utente non restaurant */

/**
 * @swagger
 * /meals/new:
 *   post:
 *     summary: Crea un nuovo piatto
 *     tags: [Meal API]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Meal'
 *     responses:
 *       201:
 *         description: Piatto creato con successo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 redirect:
 *                   type: string
 *                 meal:
 *                   $ref: '#/components/schemas/Meal'
 *       400:
 *         description: Partita IVA mancante o dati non validi
 *       409:
 *         description: Errore durante il salvataggio
 *       500:
 *         description: Errore interno del server
 *       401:
 *         description: Token non trovato
 *       403:
 *         description: Utente non restaurant */

/**
 * @swagger
 * /meals/newPrice:
 *   put:
 *     summary: Aggiunge/aggiorna il prezzo di un piatto
 *     tags: [Meal API]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mealId:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Prezzo aggiornato correttamente
 *       400:
 *         description: Parametri mancanti
 *       500:
 *         description: Errore interno del server
 *       401:
 *         description: Token non trovato
 *       403:
 *         description: Utente non restaurant */

/**
 * @swagger
 * /meals/updateMeal:
 *   put:
 *     summary: Aggiorna un piatto esistente
 *     tags: [Meal API]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Meal'
 *     responses:
 *       200:
 *         description: Piatto aggiornato con successo
 *       400:
 *         description: Partita IVA mancante o dati non validi
 *       404:
 *         description: Piatto non trovato o non autorizzato
 *       500:
 *         description: Errore interno del server
 *       401:
 *         description: Token non trovato
 *       403:
 *         description: Utente non restaurant */

/**
 * @swagger
 * /meals/{id}:
 *   patch:
 *     summary: Aggiorna parzialmente un piatto
 *     tags: [Meal API]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Meal'
 *     responses:
 *       200:
 *         description: Piatto aggiornato con successo
 *       404:
 *         description: Piatto non trovato
 *       500:
 *         description: Errore interno del server
 *       401:
 *         description: Token non trovato
 *       403:
 *         description: Utente non restaurant */

/**
 * @swagger
 * /meals/deleteMeal:
 *   delete:
 *     summary: Elimina un piatto
 *     tags: [Meal API]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Piatto eliminato con successo
 *       400:
 *         description: ID mancante
 *       404:
 *         description: Piatto non trovato
 *       500:
 *         description: Errore interno del server
 *       401:
 *         description: Token non trovato
 *       403:
 *         description: Utente non restaurant */

/**
 * @swagger
 * /meals/{id}:
 *   delete:
 *     summary: Rimuove il prezzo personalizzato di un piatto
 *     tags: [Meal API]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Prezzo rimosso con successo
 *       404:
 *         description: Prezzo non trovato
 *       500:
 *         description: Errore interno del server
 *       401:
 *         description: Token non trovato
 *       403:
 *         description: Utente non restaurant */