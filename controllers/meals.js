// controllers/mealController.js
import mongoose from 'mongoose';
import { Meal } from '../models/meal.js';
import { MealWithPrice } from '../models/meal_price.js';
import { console } from 'inspector';


export const getMealById = async (req, res) => {
  const { id } = req.params; // <-- parametro nell'URL

  try {
    const meal = await Meal.findOne({ idMeal: id }); 
    if (!meal) return res.status(404).json({ message: 'Piatto non trovato' });

    res.status(200).json(meal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllMeals = async (req, res) => {
  try {
    const userPartitaIva = req.user.partita_iva;

    // Prendi tutti i pasti
    const allMeals = await Meal.find();

    // Filtra i pasti visibili all'utente
    const filteredMeals = allMeals.filter(meal => {
      return meal.partita_iva === "0" || meal.partita_iva === userPartitaIva;
    });

    // Ordina: prima quelli dell'utente, poi quelli pubblici
    filteredMeals.sort((a, b) => {
      if (a.partita_iva === userPartitaIva && b.partita_iva !== userPartitaIva) return -1;
      if (a.partita_iva !== userPartitaIva && b.partita_iva === userPartitaIva) return 1;
      return 0;
    });

    // Prendi i prezzi personalizzati per l'utente
    const customPrices = await MealWithPrice.find({ partita_iva: userPartitaIva });

    // Crea mappa idMeal => price
    const priceMap = new Map();
    customPrices.forEach(entry => {
      priceMap.set(entry.idMeal, entry.price);
    });

    // Aggiungi price: number o price: null
    const mealsWithForcedPrice = filteredMeals.map(meal => {
      
      const mealObj = meal.toObject();
      const price = priceMap.get(meal._id.toString());
      mealObj.price = price !== undefined ? price : null;
      return mealObj;
    });
    mealsWithForcedPrice.sort((a, b) => {
      if (a.price !== null && b.price === null) return -1;
      if (a.price === null && b.price !== null) return 1;
      return 0;
    });
    res.status(200).json(mealsWithForcedPrice);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};



export const newMeal = async (req, res) => {
  try {
    const {
      strMeal,
      strMealAlternate,
      strCategory,
      strArea,
      strInstructions,
      strMealThumb,
      strTags,
      strYoutube,
      strSource,
      strImageSource,
      strCreativeCommonsConfirmed,
      dateModified,
      ingredients,
      measures,

    } = req.body;

    // Assumi che il middleware di autenticazione abbia valorizzato req.user.partitaIVA
    const partita_iva = req.user.partita_iva;  // o req.user.partita_iva a seconda di come hai chiamato il campo nel token

    if (!partita_iva) {
      return res.status(400).json({ message: 'Partita IVA non trovata nel token' });
    }

    const newMeal = new Meal({
      strMeal,
      strMealAlternate: strMealAlternate || null,
      strCategory,
      strArea,
      strInstructions,
      strMealThumb,
      strTags,
      strYoutube,
      strSource: strSource || null,
      strImageSource: strImageSource || null,
      strCreativeCommonsConfirmed: strCreativeCommonsConfirmed || null,
      dateModified: dateModified || null,
      ingredients: Array.isArray(ingredients) ? ingredients : [],
      measures: Array.isArray(measures) ? measures : [],
      partita_iva  // assegno quella estratta dalla JWT
    });

    await newMeal.save();

    newMeal.idMeal = newMeal._id.toString();
    await newMeal.save();

    res.status(201).json({
      redirect: '/restaurant/dashboard',
      meal: newMeal
    });

  } catch (error) {
    console.error('Errore durante il salvataggio del piatto:', error);
    res.status(409).json({ message: error.message });
  }
};


export const updateMeal = async (req, res) => {
  try {
    const {
      _id,
      strMeal,
      strMealAlternate,
      strCategory,
      strArea,
      strInstructions,
      strMealThumb,
      strTags,
      strYoutube,
      strSource,
      strImageSource,
      strCreativeCommonsConfirmed,
      dateModified,
      ingredients,
      measures
    } = req.body;

    const partita_iva = req.user.partita_iva;

    if (!partita_iva) {
      return res.status(400).json({ message: 'Partita IVA non trovata nel token' });
    }

    // Trova il piatto da aggiornare e assicurati che appartenga al ristoratore loggato
    const meal = await Meal.findOne({ _id: _id, partita_iva });

    if (!meal) {
      return res.status(404).json({ message: 'Piatto non trovato o non autorizzato' });
    }

    // Aggiorna i campi
    meal.strMeal = strMeal;
    meal.strMealAlternate = strMealAlternate || null;
    meal.strCategory = strCategory;
    meal.strArea = strArea;
    meal.strInstructions = strInstructions;
    meal.strMealThumb = strMealThumb;
    meal.strTags = strTags;
    meal.strYoutube = strYoutube;
    meal.strSource = strSource || null;
    meal.strImageSource = strImageSource || null;
    meal.strCreativeCommonsConfirmed = strCreativeCommonsConfirmed || null;
    meal.dateModified = dateModified || new Date();
    meal.ingredients = Array.isArray(ingredients) ? ingredients : [];
    meal.measures = Array.isArray(measures) ? measures : [];

    await meal.save();

    res.status(200).json({
      message: 'Piatto aggiornato con successo',
      meal
    });

  } catch (error) {
    console.error('Errore durante l\'aggiornamento del piatto:', error);
    res.status(500).json({ message: error.message });
  }
};



export const deleteMealById = async (req, res) => {
  const { id } = req.body; // <-- prende l'id dal body della richiesta
  const partita_iva = req.user.partita_iva;

  if (!id) {
    return res.status(400).json({ message: 'ID mancante nel body della richiesta' });
  }

  try {
    const deletedMeal = await Meal.findOneAndDelete({ idMeal: id });
    if (!deletedMeal) {
      return res.status(404).json({ message: 'Piatto non trovato' });
    }
    await MealWithPrice.findOneAndDelete({ idMeal: id, partita_iva });

    res.status(200).json({ 
      message: 'Piatto eliminato con successo', 
      redirect: '/restaurant/dashboard/' 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const insertMealWithPrice = async (req, res) => {
  try {
    const { mealId, price } = req.body;
    const partita_iva = req.user.partita_iva;

    if (!mealId || !price || !partita_iva) {
      return res.status(400).json({ message: 'Parametri mancanti' });
    }

    // Cancella eventuale record già presente
    await MealWithPrice.findOneAndDelete({ idMeal: mealId, partita_iva });

    // Inserisce il nuovo
    const newMealPrice = new MealWithPrice({
      idMeal: mealId,
      partita_iva,
      price
    });

    await newMealPrice.save();

    return res.status(201).json({ message: 'Piatto con prezzo aggiornato correttamente' });
  } catch (error) {
    console.error('Errore aggiornamento piatto con prezzo:', error);
    return res.status(500).json({ message: 'Errore interno del server' });
  }
};

export const deleteMealWithPrice = async (req, res) => {
  try {
    const { id: mealId } = req.params;
    
    if (!mealId) {
      return res.status(400).json({ message: 'mealId mancante' });
    }

    // Cerca e rimuove il pasto dal modello MealWithPrice usando idMeal
    const deletedMeal = await MealWithPrice.findOneAndDelete({ idMeal: mealId });

    if (!deletedMeal) {
      return res.status(404).json({ message: 'Pasto non trovato nel listino prezzi' });
    }

    res.status(200).json({ message: 'Prezzo del piatto rimosso con successo', meal: deletedMeal });
  } catch (error) {
    console.error('Errore durante la rimozione del prezzo:', error);
    res.status(500).json({ message: 'Errore interno del server' });
  }
};

export const getAllMealRestaurant = async (req, res) => {
  try {
    const partitaIvaParam = req.params.id;

    // Prendi tutti i pasti
    const allMeals = await Meal.find();

    // Filtra i pasti visibili all'utente
    const filteredMeals = allMeals.filter(meal =>
      meal.partita_iva === "0" || meal.partita_iva === partitaIvaParam
    );

    // Ordina priorità: prima quelli del ristorante specifico
    filteredMeals.sort((a, b) => {
      if (a.partita_iva === partitaIvaParam && b.partita_iva !== partitaIvaParam) return -1;
      if (a.partita_iva !== partitaIvaParam && b.partita_iva === partitaIvaParam) return 1;
      return 0;
    });

    // Recupera i prezzi personalizzati per quel ristorante
    const customPrices = await MealWithPrice.find({ partita_iva: partitaIvaParam });

    // Mappa per assegnare i prezzi
    const priceMap = new Map();
    customPrices.forEach(entry => {
      priceMap.set(entry.idMeal, entry.price);
    });

    // Assegna i prezzi ai meal
    const mealsWithForcedPrice = filteredMeals.map(meal => {
      const mealObj = meal.toObject();
      const price = priceMap.get(meal._id.toString());
      mealObj.price = price !== undefined ? price : null;
      return mealObj;
    });

    // FILTRO: Solo pasti con prezzo definito
    const pricedMeals = mealsWithForcedPrice.filter(meal => meal.price !== null);

    // Ordina per prezzo decrescente o come preferisci
    pricedMeals.sort((a, b) => b.price - a.price);

    res.status(200).json(pricedMeals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
