import express from 'express'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec from '../docs/swagger.js'
import { authorizeRole, authenticateToken } from '../middlewares/auth.js'


const router = express.Router()

router.use('/restaurant', authenticateToken,authorizeRole('restaurant'),swaggerUi.serve, swaggerUi.setup(swaggerSpec))
router.use('/costumer',authenticateToken,authorizeRole('costumer'),swaggerUi.serve, swaggerUi.setup(swaggerSpec))



export default router