import mongoose from 'mongoose';

const mealPriceSchema = new mongoose.Schema({
  idMeal: String,
  partita_iva: String,
  price: Number

});

export const MealWithPrice = mongoose.model('MealWithPrice', mealPriceSchema);