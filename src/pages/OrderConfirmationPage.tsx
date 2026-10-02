import React from 'react';
import { Order } from '../types';
import { formatPrice } from '../utils/currency';
import { formatDate } from '../utils/id';
import { CheckCircle2, Package, Truck, ArrowRight, Home } from 'lucide-react';
import { productImages } from '../data/productImages';

interface OrderConfirmationPageProps {
  order: Order;
  onNavigateOrders: () => void;
  onNavigateHome: () => void;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({
  order,
  onNavigateOrders,
  onNavigateHome,
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Top Banner */}
      <div className="bg-[#FFFFFF] border border-[#E4E1DA] rounded-2xl p-8 sm:p-12 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#EDE4D2] text-[#123C35] flex items-center justify-center mx-auto mb-2">
          <CheckCircle2 className="w-8 h-8 stroke-[2]" />
        </div>

        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#123C35]">
          Order Processed Successfully
        </span>

        <h1 className="text-3xl sm:text-4xl font-semibold text-[#171A19] tracking-tight">
          Thank you for choosing Nexora.
        </h1>

        <p className="text-sm text-[#666B67] max-w-lg mx-auto leading-relaxed">
          Your order is confirmed and currently being prepared in our climate-controlled fulfillment studio.
          An electronic receipt has been dispatched to <strong className="text-[#171A19]">{order.shippingAddress.email}</strong>.
        </p>

        {/* Order Reference Box */}
        <div className="inline-flex flex-wrap items-center justify-center gap-6 p-4 bg-[#F7F5F0] border border-[#E4E1DA] rounded-xl text-xs text-[#171A19] mt-4">
          <div>
            <span className="text-[#666B67] block">Order Identifier</span>
            <strong className="font-semibold text-sm">{order.id}</strong>
          </div>
          <div className="h-8 w-[1px] bg-[#E4E1DA] hidden sm:block" />
          <div>
            <span className="text-[#666B67] block">Estimated Delivery</span>
            <strong className="font-semibold text-sm text-[#123C35]">{order.estimatedDelivery}</strong>
          </div>
          <div className="h-8 w-[1px] bg-[#E4E1DA] hidden sm:block" />
          <div>
            <span className="text-[#666B67] block">Tracking Reference</span>
            <strong className="font-semibold text-sm">{order.trackingNumber || 'Pending Courier Scan'}</strong>
          </div>
        </div>
      </div>

      {/* Itemized Order Breakdown */}
      <div className="bg-[#FFFFFF] border border-[#E4E1DA] rounded-2xl p-6 sm:p-8 space-y-6">
        <h3 className="text-base font-semibold text-[#171A19] pb-4 border-b border-[#E4E1DA] flex items-center gap-2">
          <Package className="w-4 h-4 text-[#123C35]" />
          <span>Purchased Instruments & Accessories</span>
        </h3>

        <div className="divide-y divide-[#E4E1DA]/60">
          {order.items.map((item, idx) => (
            <div key={idx} className="py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-[#F7F5F0] border border-[#E4E1DA] rounded-lg p-1.5 shrink-0 flex items-center justify-center">
                  <img
                    src={(item.image && (item.image.startsWith('data:') || item.image.startsWith('http') || item.image.startsWith('/'))) ? item.image : productImages.arcHeadphones.main}
                    alt={item.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#171A19]">{item.name}</h4>
                  <span className="text-xs text-[#666B67]">
                    Qty: {item.quantity} · {item.category}
                  </span>
                </div>
              </div>
              <div className="text-sm font-semibold text-[#171A19] tabular-nums">
                {formatPrice(item.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>

        {/* Financial Recapitulation */}
        <div className="pt-4 border-t border-[#E4E1DA] space-y-2 text-xs text-[#666B67] max-w-sm ml-auto">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-medium text-[#171A19] tabular-nums">{formatPrice(order.subtotal)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-[#2F6B57]">
              <span>Applied Discount</span>
              <span className="font-semibold tabular-nums">-{formatPrice(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Shipping ({order.deliveryMethod === 'express' ? 'Express Priority' : 'Standard'})</span>
            <span className="font-medium text-[#171A19] tabular-nums">
              {order.shipping === 0 ? 'Complimentary' : formatPrice(order.shipping)}
            </span>
          </div>
          <div className="flex justify-between text-[#666B67]">
            <span>18% GST (Component)</span>
            <span className="tabular-nums">{formatPrice(order.tax)}</span>
          </div>
          <div className="pt-2 border-t border-[#E4E1DA] flex justify-between text-base font-bold text-[#171A19]">
            <span>Total Paid / Payable</span>
            <span className="tabular-nums">{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Shipping & Payment Meta */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-[#FFFFFF] border border-[#E4E1DA] rounded-xl p-6 space-y-2 text-xs">
          <h4 className="font-semibold uppercase tracking-wider text-[#666B67] mb-2 flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-[#123C35]" />
            <span>Shipping Address</span>
          </h4>
          <p className="font-semibold text-[#171A19] text-sm">{order.shippingAddress.fullName}</p>
          <p className="text-[#666B67]">{order.shippingAddress.addressLine}</p>
          <p className="text-[#666B67]">
            {order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.postalCode}
          </p>
          <p className="text-[#666B67] pt-1">Phone: {order.shippingAddress.phone}</p>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E4E1DA] rounded-xl p-6 space-y-2 text-xs">
          <h4 className="font-semibold uppercase tracking-wider text-[#666B67] mb-2">
            Payment & Method
          </h4>
          <p className="font-semibold text-[#171A19] text-sm">
            {order.paymentMethod === 'cod'
              ? 'Cash on Delivery (Pay at doorstep)'
              : order.paymentMethod === 'upi_mock'
              ? 'Instant UPI'
              : 'Credit / Debit Card'}
          </p>
          <p className="text-[#666B67]">Date: {formatDate(order.createdAt)}</p>
          <p className="text-[#2F6B57] font-medium pt-1">
            Status: {order.status}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <button
          type="button"
          onClick={onNavigateOrders}
          className="w-full sm:w-auto px-8 py-3.5 bg-[#123C35] hover:bg-[#0D302A] text-[#FFFFFF] text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
        >
          <span>View in My Orders</span>
          <ArrowRight className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={onNavigateHome}
          className="w-full sm:w-auto px-8 py-3.5 bg-[#FFFFFF] border border-[#E4E1DA] hover:border-[#171A19] text-[#171A19] text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <Home className="w-4 h-4 text-[#666B67]" />
          <span>Return to Homepage</span>
        </button>
      </div>
    </div>
  );
};
