import { orderService } from '../services/order.service.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

export const createOrder = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return sendError(
        res,
        'Authentication required. You must sign in to place an order.',
        401,
        'AUTH_REQUIRED'
      );
    }

    const { items, shippingAddress, deliveryMethod, paymentMethod, discountCode } = req.body;
    // Strictly bind order to verified server-side user ID, ignoring any client-provided userId
    const userId = req.user.id;

    const order = await orderService.createOrder({
      userId,
      items,
      shippingAddress,
      deliveryMethod,
      paymentMethod,
      discountCode,
    });

    return sendSuccess(res, order, 'Order confirmed successfully', 201);
  } catch (err) {
    next(err);
  }
};

export const getUserOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getUserOrders(req.user.id);
    return sendSuccess(res, orders, 'Orders retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!req.user || !req.user.id) {
      return sendError(
        res,
        'Authentication required to view order details.',
        401,
        'AUTH_REQUIRED'
      );
    }
    const userId = req.user.id;
    const order = await orderService.getOrderById(id, userId);

    if (!order) {
      return sendError(res, 'Order not found', 404, 'ORDER_NOT_FOUND');
    }

    return sendSuccess(res, order, 'Order details retrieved');
  } catch (err) {
    next(err);
  }
};
