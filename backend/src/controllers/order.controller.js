import { orderService } from '../services/order.service.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

export const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, deliveryMethod, paymentMethod, discountCode } = req.body;
    const userId = req.user ? req.user.id : undefined;

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
    const userId = req.user ? req.user.id : null;
    const order = await orderService.getOrderById(id, userId);

    if (!order) {
      return sendError(res, 'Order not found', 404, 'ORDER_NOT_FOUND');
    }

    return sendSuccess(res, order, 'Order details retrieved');
  } catch (err) {
    next(err);
  }
};
