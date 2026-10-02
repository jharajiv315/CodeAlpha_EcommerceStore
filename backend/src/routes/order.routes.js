import { Router } from 'express';
import * as orderController from '../controllers/order.controller.js';
import { requireAuth, optionalAuth } from '../middleware/auth.middleware.js';
import { validateCreateOrder } from '../middleware/validate.middleware.js';

const router = Router();

// Order creation - attaches authenticated user if logged in
router.post('/', optionalAuth, validateCreateOrder, orderController.createOrder);

// User order history (strictly requires authentication)
router.get('/', requireAuth, orderController.getUserOrders);

// Order details by ID (authenticated users can only view their own order)
router.get('/:id', optionalAuth, orderController.getOrderById);

export default router;
