import { getClient, query } from '../config/db.js';

const FREE_SHIPPING_THRESHOLD = 2000;
const STANDARD_SHIPPING_FEE = 199;
const EXPRESS_SURCHARGE = 250;

const PROMO_CODES = {
  'NEXORA10': 10,
  'WELCOME15': 15,
  'STUDIO20': 20,
};

/**
 * Calculates estimated delivery date string
 */
function getEstimatedDeliveryDate(daysFromNow) {
  const date = new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000);
  return new Intl.DateTimeFormat('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

/**
 * Maps database order row and its items to frontend Order contract
 */
export const mapOrderRow = (orderRow, itemsRows = []) => {
  return {
    id: orderRow.order_number, // User-facing order ID (e.g. NX-2026-10291)
    internalId: orderRow.id,
    userId: orderRow.user_id || undefined,
    items: itemsRows.map(item => ({
      productId: item.product_id || item.productId,
      name: item.product_name || item.name,
      price: Number(item.unit_price ?? item.unitPrice ?? item.price ?? 0),
      quantity: Number(item.quantity),
      image: item.product_image || item.image,
      category: item.category,
    })),
    subtotal: Number(orderRow.subtotal),
    shipping: Number(orderRow.shipping_amount),
    tax: Number(orderRow.tax_amount),
    discount: Number(orderRow.discount_amount),
    discountCode: orderRow.discount_code || undefined,
    total: Number(orderRow.total_amount),
    shippingAddress: {
      fullName: orderRow.shipping_name,
      email: orderRow.shipping_email,
      phone: orderRow.shipping_phone,
      addressLine: orderRow.shipping_address,
      city: orderRow.shipping_city,
      state: orderRow.shipping_state,
      postalCode: orderRow.shipping_postal_code,
      country: orderRow.shipping_country || 'India',
    },
    deliveryMethod: orderRow.delivery_method,
    paymentMethod: orderRow.payment_method,
    status: orderRow.status,
    createdAt: orderRow.created_at,
    estimatedDelivery: orderRow.estimated_delivery,
    trackingNumber: orderRow.tracking_number,
  };
};

class OrderService {
  /**
   * Creates an order transactionally with row-level locks and server-authoritative calculations
   */
  async createOrder({
    userId,
    items,
    shippingAddress,
    deliveryMethod = 'standard',
    paymentMethod = 'cod',
    discountCode,
  }) {
    if (!userId) {
      const err = new Error('Authentication required to place an order.');
      err.statusCode = 401;
      err.errorCode = 'AUTH_REQUIRED';
      throw err;
    }

    const client = await getClient();

    try {
      await client.query('BEGIN');

      const productIds = items.map(i => i.productId);

      // Lock product rows for update to prevent concurrent stock race conditions
      const productQuery = `
        SELECT id, name, price, stock, category, image_url
        FROM products
        WHERE id = ANY($1)
        FOR UPDATE
      `;
      const { rows: dbProducts } = await client.query(productQuery, [productIds]);
      const productMap = new Map(dbProducts.map(p => [p.id, p]));

      // 1. Verify all products exist and check stock
      let calculatedSubtotal = 0;
      const orderItemsToInsert = [];

      for (const item of items) {
        const dbProduct = productMap.get(item.productId);

        if (!dbProduct) {
          const err = new Error(`Product not found: ${item.productId}`);
          err.statusCode = 404;
          err.errorCode = 'PRODUCT_NOT_FOUND';
          throw err;
        }

        const requestedQty = Number(item.quantity);
        if (dbProduct.stock < requestedQty) {
          const err = new Error(
            `Insufficient stock for "${dbProduct.name}". Only ${dbProduct.stock} units remaining.`
          );
          err.statusCode = 409;
          err.errorCode = 'INSUFFICIENT_STOCK';
          throw err;
        }

        const unitPrice = Number(dbProduct.price);
        const itemSubtotal = unitPrice * requestedQty;
        calculatedSubtotal += itemSubtotal;

        orderItemsToInsert.push({
          productId: dbProduct.id,
          name: dbProduct.name,
          image: dbProduct.image_url,
          category: dbProduct.category,
          quantity: requestedQty,
          unitPrice,
          subtotal: itemSubtotal,
        });
      }

      // 2. Server-authoritative financial calculation
      let discountAmount = 0;
      let validPromoCode = null;

      if (discountCode) {
        const normCode = discountCode.trim().toUpperCase();
        if (PROMO_CODES[normCode]) {
          const pct = PROMO_CODES[normCode];
          discountAmount = Math.round((calculatedSubtotal * pct) / 100);
          validPromoCode = normCode;
        }
      }

      const isFreeShipping = calculatedSubtotal >= FREE_SHIPPING_THRESHOLD;
      const baseShipping = isFreeShipping ? 0 : STANDARD_SHIPPING_FEE;
      const expressFee = deliveryMethod === 'express' ? EXPRESS_SURCHARGE : 0;
      const totalShipping = baseShipping + expressFee;

      const taxableBase = Math.max(0, calculatedSubtotal - discountAmount);
      // GST 18% embedded
      const taxAmount = Math.round((taxableBase * 0.18) / 1.18);
      const totalAmount = Math.max(0, taxableBase + totalShipping);

      // 3. Generate identifiers
      const internalId = `ord_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const orderNumber = `NX-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      const deliveryDays = deliveryMethod === 'express' ? 2 : 4;
      const estimatedDelivery = getEstimatedDeliveryDate(deliveryDays);
      const trackingNumber = `NX-EXP-${Math.floor(1000000 + Math.random() * 9000000)}`;

      // 4. Insert order
      const insertOrderSql = `
        INSERT INTO orders (
          id, order_number, user_id, subtotal, shipping_amount, tax_amount,
          discount_amount, discount_code, total_amount, delivery_method,
          payment_method, status, shipping_name, shipping_email, shipping_phone,
          shipping_address, shipping_city, shipping_state, shipping_postal_code,
          shipping_country, tracking_number, estimated_delivery
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
          $11, $12, $13, $14, $15, $16, $17, $18, $19,
          $20, $21, $22
        )
        RETURNING *
      `;

      const orderParams = [
        internalId,
        orderNumber,
        userId || null,
        calculatedSubtotal,
        totalShipping,
        taxAmount,
        discountAmount,
        validPromoCode,
        totalAmount,
        deliveryMethod,
        paymentMethod,
        'Confirmed',
        shippingAddress.fullName.trim(),
        shippingAddress.email.trim(),
        shippingAddress.phone.trim(),
        shippingAddress.addressLine.trim(),
        shippingAddress.city.trim(),
        shippingAddress.state.trim(),
        shippingAddress.postalCode.trim(),
        shippingAddress.country || 'India',
        trackingNumber,
        estimatedDelivery,
      ];

      const { rows: insertedOrders } = await client.query(insertOrderSql, orderParams);
      const createdOrder = insertedOrders[0];

      // 5. Insert order items & update stock
      for (const item of orderItemsToInsert) {
        await client.query(
          `INSERT INTO order_items (
            order_id, product_id, product_name, product_image, category, quantity, unit_price, subtotal
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            internalId,
            item.productId,
            item.name,
            item.image,
            item.category,
            item.quantity,
            item.unitPrice,
            item.subtotal,
          ]
        );

        // Deduct inventory atomically
        await client.query(
          `UPDATE products
           SET stock = stock - $1, updated_at = CURRENT_TIMESTAMP
           WHERE id = $2`,
          [item.quantity, item.productId]
        );
      }

      await client.query('COMMIT');

      return mapOrderRow(createdOrder, orderItemsToInsert);
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  /**
   * Retrieves orders for an authenticated user (sorted newest first)
   */
  async getUserOrders(userId) {
    const ordersRes = await query(
      `SELECT * FROM orders
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );

    if (ordersRes.rows.length === 0) {
      return [];
    }

    const orderIds = ordersRes.rows.map(o => o.id);
    const itemsRes = await query(
      `SELECT * FROM order_items WHERE order_id = ANY($1)`,
      [orderIds]
    );

    const itemsByOrderId = new Map();
    itemsRes.rows.forEach(item => {
      const list = itemsByOrderId.get(item.order_id) || [];
      list.push(item);
      itemsByOrderId.set(item.order_id, list);
    });

    return ordersRes.rows.map(order =>
      mapOrderRow(order, itemsByOrderId.get(order.id) || [])
    );
  }

  /**
   * Retrieves a single order by public order_number or internal id
   */
  async getOrderById(orderRef, userId = null) {
    const orderRes = await query(
      `SELECT * FROM orders WHERE id = $1 OR order_number = $1`,
      [orderRef]
    );

    if (orderRes.rows.length === 0) {
      return null;
    }

    const order = orderRes.rows[0];

    // Enforce authorization: all orders require authentication and user ownership
    if (!userId) {
      const err = new Error('Authentication required to view this order.');
      err.statusCode = 401;
      err.errorCode = 'UNAUTHORIZED';
      throw err;
    }
    if (order.user_id && order.user_id !== userId) {
      const err = new Error('Unauthorized to view this order.');
      err.statusCode = 403;
      err.errorCode = 'FORBIDDEN';
      throw err;
    }

    const itemsRes = await query(
      `SELECT * FROM order_items WHERE order_id = $1`,
      [order.id]
    );

    return mapOrderRow(order, itemsRes.rows);
  }
}

export const orderService = new OrderService();
