import express from 'express'
import { authenticateToken,authorizeRole } from '../middlewares/auth.js';
import {getMostPurchasedProduct,deleteAccount,modifyCostumerAccount,getAccountData,accountPage,orderPage,getOrders,restaurantPage,dashboardPage } from '../controllers/costumer.js'

const router = express.Router()

//GET
router.get('/dashboard',authenticateToken,authorizeRole('costumer'), dashboardPage)
router.get('/getorders', authenticateToken,authorizeRole('costumer'),getOrders);
router.get('/neworder',authenticateToken,authorizeRole('costumer'), orderPage)
router.get('/account',authenticateToken,authorizeRole('costumer'), accountPage)
router.get('/accountData',authenticateToken,authorizeRole('costumer'), getAccountData)

router.get('/favoriteproduct',authenticateToken,authorizeRole('costumer'), getMostPurchasedProduct)


router.get('/:id',authenticateToken,authorizeRole('costumer'), restaurantPage)

router.put('/modifyAccount',authenticateToken,authorizeRole('costumer'), modifyCostumerAccount)

router.delete('/deleteAccount',authenticateToken,authorizeRole('costumer'), deleteAccount)

export default router
