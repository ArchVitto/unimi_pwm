import express from 'express'
import { logout,loginCostumer,loginRestaurant,loginPageCostumer,loginPageRestaurant,registerCostumer,registerRestaurant,loginPage,registerPage,registerPageCostumer,registerPageRestaurant } from "../controllers/auth.js";
import { authenticateToken } from '../middlewares/auth.js';


const router = express.Router()
//router.post('/register', register)


router.get('/login', loginPage)
router.get('/register', registerPage)

router.get('/register/costumer',registerPageCostumer)
router.get('/register/restaurant',registerPageRestaurant)

router.get('/login/costumer',loginPageCostumer)
router.get('/login/restaurant',loginPageRestaurant)

router.post('/login/costumer',loginCostumer)
router.post('/login/restaurant',loginRestaurant)

router.post('/register/costumer',registerCostumer);
router.post('/register/restaurant',registerRestaurant)

router.post('/logout',authenticateToken,logout)
export default router

