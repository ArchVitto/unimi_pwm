import express from 'express'
import { updateMeal,getAllMealRestaurant,deleteMealWithPrice,insertMealWithPrice,getMealById, getAllMeals, newMeal, deleteMealById } from '../controllers/meals.js';
import { authorizeRole,authenticateToken } from '../middlewares/auth.js';

const router = express.Router()

//GET
router.get('/menu/:id',authenticateToken,authorizeRole('costumer'),getAllMealRestaurant)
router.get('/:id',authenticateToken, authorizeRole('restaurant'),getMealById)////
router.get('/', authenticateToken,authorizeRole('restaurant'),getAllMeals)

//INSERT
router.post('/new',authenticateToken, authorizeRole('restaurant'),newMeal)
router.put('/newPrice',authenticateToken, authorizeRole('restaurant'),insertMealWithPrice)

router.put('/updateMeal',authenticateToken,authorizeRole('restaurant'),updateMeal)

//MODIFY
router.patch('/:id', authenticateToken,authorizeRole('restaurant'),updateMeal)

//DELETE
router.delete('/deleteMeal',authenticateToken,authorizeRole('restaurant'),deleteMealById)

router.delete('/:id',authenticateToken,authorizeRole('restaurant'),deleteMealWithPrice)


export default router
