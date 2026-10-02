import { Router } from 'express';
import * as orderController from '../controllers/order.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validateCreateOrder } from '../middleware/validate.middleware.js';

const router = Router();

// Order creation - strictly requires authentication via Supabase Bearer token
router.post('/', requireAuth, validateCreateOrder, orderController.createOrder);

// User order history (strictly requires authentication)
router.get('/', requireAuth, orderController.getUserOrders);

// Order details by ID (strictly requires authentication and user ownership)
router.get('/:id', requireAuth, orderController.getOrderById);

export default router;
