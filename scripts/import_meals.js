import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { Meal } from '../models/meal.js';
dotenv.config();

const filePath = path.resolve('./data/meals.json');

mongoose.connect(process.env.CONNECTION_URL)
.then(async () => {
  console.log('✅ Connesso al database');

  const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  // Rimuovo _id e aggiungo partita_iva = "0"
  const cleanedData = jsonData.map(meal => {
    const { _id, ...rest } = meal;
    return {
      ...rest,
      partita_iva: "0"
    };
  });

  try {
    await Meal.deleteMany(); // Rimuove tutti i pasti esistenti
    await Meal.insertMany(cleanedData);
    console.log('✅ Meals importati con successo');
    process.exit(0);
  } catch (err) {
    console.error('❌ Errore durante l\'importazione:', err);
    process.exit(1);
  }
})
.catch(err => {
  console.error('❌ Connessione fallita:', err);
  process.exit(1);
});
