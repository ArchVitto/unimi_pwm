import { Restaurant } from "../models/user.js";
import { MealWithPrice }  from '../models/meal_price.js';
import { Order } from '../models/order.js';
import { Meal } from '../models/meal.js';


export const dashboardPage = async (req, res) => {
    try {
        // Invia il file HTML direttamente
        res.sendFile('html/auth/restaurant/dashboard.html', { root: './public' });
    } catch (error) {
        console.error('Error serving login page:', error);
        res.status(500).send('Internal Server Error');
    }
}
export const newOrderPage = async (req, res) => {

  try {
      // Invia il file HTML direttamente
      res.sendFile('html/auth/restaurant/order.html', { root: './public' });
  } catch (error) {
      console.error('Error serving login page:', error);
      res.status(500).send('Internal Server Error');
  }
}
export const mealPage = (req, res) => {
    try {
        // Invia il file HTML direttamente
        res.sendFile('html/auth/restaurant/meal.html', { root: './public' });
    } catch (error) {
        console.error('Error serving login page:', error);
        res.status(500).send('Internal Server Error');
    }
}

export const newPage = (req, res) => {
    try {
        // Invia il file HTML direttamente
        res.sendFile('html/auth/restaurant/new.html', { root: './public' });
    } catch (error) {
        console.error('Error serving login page:', error);
        res.status(500).send('Internal Server Error');
    }
}
export const accountPage = (req, res) => {
    try {
        // Invia il file HTML direttamente
        res.sendFile('html/auth/restaurant/account.html', { root: './public' });
    } catch (error) {
        console.error('Error serving login page:', error);
        res.status(500).send('Internal Server Error');
    }
}


export const modifyAccount = async (req, res) => {
    try {
      const userId = req.user.id;
      const updateData = { ...req.body };
  
      const user = await Restaurant.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, error: 'Utente non trovato' });
      }
  
      // Validazione e aggiornamento campi
      const allowedFields = [
        'nome',
        'cognome',
        'email',
        'nome_ristorante',
        'indirizzo_ristorante',
        'partita_iva',
        'numero_telefono',
        'immagine',
        'descrizione'
      ];
  
      for (const key of allowedFields) {
        if (key in updateData) {
          const value = updateData[key]?.trim?.() ?? '';
  
          switch (key) {
            case 'email':
              if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                return res.status(400).json({ success: false, error: 'Email non valida' });
              }
              break;
            case 'partita_iva':
              if (!/^\d{11}$/.test(value)) {
                return res.status(400).json({ success: false, error: 'Partita IVA non valida (11 cifre)' });
              }
              break;
            case 'numero_telefono':
              if (!/^\+?[0-9]{8,15}$/.test(value)) {
                return res.status(400).json({ success: false, error: 'Numero di telefono non valido' });
              }
              break;
            case 'immagine':
              if (value && !/^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i.test(value)) {
                return res.status(400).json({ success: false, error: 'URL immagine non valido' });
              }
              break;
            case 'descrizione':
              if (value.length > 1000) {
                return res.status(400).json({ success: false, error: 'Descrizione troppo lunga (max 1000 caratteri)' });
              }
              break;
          }
  
          user[key] = value;
        }
      }
  
      // Gestione password
      if ('password' in updateData && updateData.password.trim() !== '') {
        if (updateData.password.length < 5) {
          return res.status(400).json({ success: false, error: 'La password deve contenere almeno 5 caratteri' });
        }
        user.password = updateData.password; // sarà hashata da pre-save
      }
  
      await user.save();
  
      res.status(200).json({ success: true });
    } catch (err) {
      console.error('Errore modifica account:', err);
      res.status(400).json({
        success: false,
        error: err.message || 'Errore durante la modifica'
      });
    }
  };
  

export const getAccountData = async (req, res) => {

    try {
      const userId = req.user.id;
      const user = await Restaurant.findById(userId);
      if (!user) return res.sendStatus(404);
      res.json(user); // Viene trasformato in JSON già senza password
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};

export const getAllActiveRestaurant = async (req, res) => {
    try {
        // 1. Recupera tutte le partita_iva uniche da MealWithPrice
        const partitaIvaList = await MealWithPrice.distinct('partita_iva');

        // 2. Cerca solo i ristoranti che hanno quella partita_iva
        const restaurants = await Restaurant.find({
            partita_iva: { $in: partitaIvaList }
        });

        res.status(200).json(restaurants);
    } catch (error) {
        console.error('Errore nel recupero dei ristoranti:', error);
        res.status(500).json({ message: 'Errore del server' });
    }
};

export const newOrder = async (req, res) => {


  const { cart, cardHolder, partitaIva, cardNumber, expiry, cvc } = req.body;
  const username = req.user.username; 

  if (!username) {
    return res.status(401).json({ success: false, message: 'Utente non autenticato' });
  }

  if (!cart || !Array.isArray(cart) || cart.length === 0) {
    return res.status(400).json({ success: false, message: 'Carrello vuoto' });
  }

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);


  const ordine = new Order({
    username,
    cardHolder,
    partitaIva,
    total: total.toFixed(2),
    products: cart,
  });

  try {
    await ordine.save();

    // Inviare notifica real-time via Socket.IO
    req.io.to(partitaIva).emit('newOrder', ordine);
    console.log(`✅ Notifica ordine inviata alla stanza: ${partitaIva}`);

    return res.json({
      success: true,
      message: 'Ordine ricevuto e salvato!',
    });
  } catch (err) {
    console.error('❌ Errore nel salvataggio ordine:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Errore nel salvataggio dell’ordine',
    });
  }
};


export const getPartitaIva = (req, res) => {
  try {
    const userPartitaIva = req.user.partita_iva;
    if (!userPartitaIva) {
      return res.status(400).json({ success: false, message: 'Partita IVA non trovata' });
    }
    return res.json({ success: true, partita_iva: userPartitaIva });
  } catch (error) {
    console.error('Errore nel recupero partita IVA:', error);
    return res.status(500).json({ success: false, message: 'Errore interno' });
  }
};

export const getOrders = async (req, res) => {
  try {
    const partitaIva = req.user.partita_iva;
    if (!partitaIva) {
      return res.status(401).json({
        success: false,
        message: 'Utente non autenticato o partita IVA non trovata'
      });
    }

    const orders = await Order.find({ partitaIva }).sort({ orderDate: -1 }).lean();

    // Per ogni ordine
    for (const order of orders) {
      // Per ogni prodotto nell'ordine
      for (const product of order.products) {
        // Recupera il meal dal DB usando _id del prodotto
        const meal = await Meal.findById(product._id).lean();

        // Se trovato, aggiungi il nome del piatto al prodotto
        if (meal) {
          product.name = meal.strMeal;
        } else {
          product.name = null; // o una stringa di default
        }
      }
    }

    res.json({
      success: true,
      orders
    });

  } catch (error) {
    console.error('Errore durante il recupero degli ordini:', error);
    res.status(500).json({
      success: false,
      message: 'Errore del server'
    });
  }
};

export const updateMinute = async (req, res) => {


    try {
        const { orderId, minuti } = req.body;

        // Validazione input
        if (!orderId || minuti === undefined) {
            return res.status(400).json({ 
                success: false, 
                message: 'ID ordine e minuti sono obbligatori' 
            });
        }

        // Conversione e validazione minuti
        const minutesNumber = Number(minuti);
        if (isNaN(minutesNumber) || minutesNumber < 1) {
            return res.status(400).json({ 
                success: false, 
                message: 'Minuti deve essere un numero maggiore di 0' 
            });
        }

        // Calcolo delle date
        const now = new Date();
        const expireDate = new Date(now.getTime() + minutesNumber * 60000);

        console.log("Valori da salvare:", {
            startDate: now,
            expireDate: expireDate
        });

        // Aggiornamento nel database
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { 
                'status.startDate': now,
                'status.expireDate': expireDate,
                'status.status': 'in preparazione' // Imposta lo stato
            },
            { new: true } // Restituisce il documento aggiornato
        );

        if (!updatedOrder) {
            return res.status(404).json({ 
                success: false, 
                message: 'Ordine non trovato' 
            });
        }
        // Risposta di successo
        return res.status(200).json({ 
            success: true, 
            message: 'Tempi di preparazione aggiornati con successo',

        });

    } catch (error) {
        console.error('Errore durante l\'aggiornamento dei tempi:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Errore interno del server',
            error: error.message 
        });
    }
};


export const markAsDelivered = async (req, res) => {

  const { orderId } = req.body;

  if (!orderId) {
    return res.status(400).json({ message: 'orderId mancante nel body della richiesta' });
  }

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        $set: {
          'status.status': 'consegnato',
        },
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Ordine non trovato' });
    }

    return res.status(200).json({ message: 'Ordine consegnato', order: updatedOrder });
  } catch (error) {
    console.error('Errore durante la consegna:', error);
    return res.status(500).json({ message: 'Errore del server' });
  }
};

export const deleteAccountData = async (req, res) => {
  try {
    const partitaIva = req.user.partita_iva;


    if (!partitaIva) {
      return res.status(400).json({ error: "partita_iva is required" });
    }

    // 1. Verifica presenza ordini attivi
    const existingOrders = await Order.findOne({
      partitaIva: partitaIva,
      'status.status': { $in: ['ordinato', 'in preparazione'] }
    });

    if (existingOrders) {

      return res.status(403).json({
        error: "Impossibile eliminare l'account: ci sono ordini attivi ('ordinato' o 'in preparazione')"
      });
    }

    // 2. Elimina il ristorante
    const deletedRestaurant = await Restaurant.findOneAndDelete({ partita_iva: partitaIva });

    if (!deletedRestaurant) {
      return res.status(404).json({ error: "Nessun ristorante trovato con questa partita_iva" });
    }

    // 3. Elimina tutti i MealWithPrice associati
    await MealWithPrice.deleteMany({ partita_iva: partitaIva });

      // Rimuove il cookie
      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
      });

    res.status(200).json({
      success: true,
      message: 'Account eliminato con successo',
      redirect: '/auth/login'
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
