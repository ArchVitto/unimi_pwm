import mongoose from 'mongoose';

const mealSchema = new mongoose.Schema({
  idMeal: {
    type: String,
  },
  strMeal: {
    type: String,
    required: true,
  },
  strMealAlternate: String,
  strCategory: {
    type: String,
  },
  strArea: {
    type: String,
    required: true,
  },
  strInstructions: {
    type: String,
    required: true,
  },
  strMealThumb: {
    type: String,
  },
  strTags: {
    type: String,
  },
  strYoutube: {
    type: String,
  },
  strSource: {
    type: String,
  },
  strImageSource: String,
  strCreativeCommonsConfirmed: String,
  dateModified: String,
  ingredients: {
    type: [String],
  },
  measures: {
    type: [String],
  },
  partita_iva: {
    type: String,
    required: true,
    trim: true,
  }
});


export const Meal = mongoose.model('Meal', mealSchema);
