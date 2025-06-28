import express from 'express'
import {deleteAccountData,updateMinute,getOrders,getPartitaIva,newOrderPage,newOrder,getAllActiveRestaurant, getAccountData,modifyAccount,newPage,mealPage, dashboardPage, accountPage, markAsDelivered} from '../controllers/restaurant.js';
import {authorizeRole, authenticateToken,validateCardData } from '../middlewares/auth.js';

const router = express.Router()

//GET
router.get('/dashboard',authenticateToken,authorizeRole('restaurant'), dashboardPage)
router.get('/new',authenticateToken,authorizeRole('restaurant'), newPage)
router.get('/account',authenticateToken,authorizeRole('restaurant'), accountPage)
router.get('/accountData',authenticateToken,authorizeRole('restaurant'), getAccountData)
router.get('/activeList',authenticateToken, getAllActiveRestaurant)

router.get('/neworder',authenticateToken,authorizeRole('restaurant'), newOrderPage)

router.post('/neworder',authenticateToken,authorizeRole('costumer'),validateCardData, newOrder)
router.get('/partitaiva', authenticateToken,authorizeRole('restaurant'), getPartitaIva);


router.get('/getorders', authenticateToken,authorizeRole('restaurant'),getOrders);


router.get('/:id',authenticateToken,authorizeRole('restaurant'), mealPage)
router.put('/account',authenticateToken,authorizeRole('restaurant'), modifyAccount)

router.put('/updateOrderMinutes',authenticateToken,authorizeRole('restaurant'), updateMinute)
router.put('/markasdelivered',authenticateToken,authorizeRole('restaurant'), markAsDelivered)


router.delete('/deleteRestaurant',authenticateToken,authorizeRole('restaurant'), deleteAccountData)

export default router