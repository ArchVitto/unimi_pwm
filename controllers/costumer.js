import { Order } from '../models/order.js';
import { Meal } from '../models/meal.js';
import { Costumer } from '../models/user.js';
export const getOrders = async (req, res) => {
    try {
      const username = req.user.username;
      if (!username) {
        return res.status(401).json({
          success: false,
          message: 'Utente non autenticato o username non trovato'
        });
      }
  
      const orders = await Order.find({ username }).sort({ orderDate: -1 }).lean();
  
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
  

export const dashboardPage = async (req, res) => {
    try {
        // Invia il file HTML direttamente
        res.sendFile('html/auth/costumer/dashboard.html', { root: './public' });
    } catch (error) {
        console.error('Error serving login page:', error);
        res.status(500).send('Internal Server Error');
    }
}


export const restaurantPage = async (req, res) => {
    try {
        // Invia il file HTML direttamente
        res.sendFile('html/auth/costumer/menu.html', { root: './public' });
    } catch (error) {
        console.error('Error serving login page:', error);
        res.status(500).send('Internal Server Error');
    }
}


export const orderPage = async (req, res) => {
    try {
        // Invia il file HTML direttamente
        res.sendFile('html/auth/costumer/order.html', { root: './public' });
    } catch (error) {
        console.error('Error serving login page:', error);
        res.status(500).send('Internal Server Error');
    }
}

export const accountPage = async (req, res) => {
  try {
      // Invia il file HTML direttamente
      res.sendFile('html/auth/costumer/account.html', { root: './public' });
  } catch (error) {
      console.error('Error serving login page:', error);
      res.status(500).send('Internal Server Error');
  }
}

export const getAccountData = async (req, res) => {
  try {
    const costumerName = req.user.username;
    console.log(costumerName)
    const costumer = await Costumer.findOne({ username: costumerName });    
    if (!costumer) return res.sendStatus(404);
    res.json(costumer); 
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export const modifyCostumerAccount = async (req, res) => {
  try {
    const username = req.user.username;
    const updateData = { ...req.body };

    const user = await Costumer.findOne({ username });
    if (!user) {
      return res.status(404).json({ success: false, error: 'Utente non trovato' });
    }

    const allowedFields = [
      'nome',
      'cognome',
      'username',
      'email',
      'indirizzo_consegna',
      'telefono'
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
          case 'telefono':
            if (value && !/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{3,}[-\s.]?[0-9]{4,}$/.test(value)) {
              return res.status(400).json({ success: false, error: 'Numero di telefono non valido' });
            }
            break;
          case 'username':
            if (value.length < 5 || value.length > 30) {
              return res.status(400).json({ success: false, error: 'Username deve avere tra 5 e 30 caratteri' });
            }
            break;
        }

        user[key] = value;
      }
    }

    // Password
    if ('password' in updateData && updateData.password.trim() !== '') {
      if (updateData.password.length < 5) {
        return res.status(400).json({ success: false, error: 'La password deve contenere almeno 5 caratteri' });
      }
      user.password = await bcrypt.hash(updateData.password, 10);
    }

    await user.save();
    res.status(200).json({ success: true });

  } catch (err) {
    console.error('Errore modifica account cliente:', err);
    res.status(400).json({
      success: false,
      error: err.message || 'Errore durante la modifica'
    });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const costumerName = req.user.username;
    console.log(`Eliminazione account richiesta per: ${costumerName}`);

    const deleted = await Costumer.findOneAndDelete({ username: costumerName });

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Utente non trovato' });
    }

    // Cancella il cookie del token, proprio come nel logout
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    return res.status(200).json({
      success: true,
      message: 'Account eliminato con successo',
      redirect: '/auth/login', 
     });

  } catch (err) {
    console.error('Errore durante l’eliminazione account:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getMostPurchasedProduct = async (req, res) => {
  try {
    const username = req.user.username;
    if (!username) {
      return res.status(401).json({
        success: false,
        message: 'Utente non autenticato o username non trovato'
      });
    }

    const result = await Order.aggregate([
      { $match: { username: username } },
      { $unwind: '$products' },
      { 
        $group: {
          _id: '$products._id', // Ora usiamo l'ID del prodotto
          totalQuantity: { $sum: '$products.quantity' }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 1 }
    ]);

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Nessun ordine trovato per questo utente'
      });
    }

    // Recupera i dettagli del pasto dal database
    const meal = await Meal.findById(result[0]._id).lean();
    
    if (!meal) {
      return res.status(404).json({
        success: false,
        message: 'Prodotto non trovato nel database'
      });
    }

    res.json({
      success: true,
      mostPurchasedProduct: {
        _id: result[0]._id,
        name: meal.strMeal,
        totalQuantity: result[0].totalQuantity,
        tag: meal.strTags
      }
    });

  } catch (error) {
    console.error('Errore durante il recupero del prodotto più acquistato:', error);
    res.status(500).json({
      success: false,
      message: 'Errore del server'
    });
  }
};