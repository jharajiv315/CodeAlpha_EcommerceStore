import React, { useState, useEffect } from 'react';
import { orderService } from '../services/orderService';
import { useAuth } from '../context/AuthContext';
import { Order } from '../types';
import { formatPrice } from '../utils/currency';
import { formatDate } from '../utils/id';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { EmptyState } from '../components/common/EmptyState';
import { productImages } from '../data/productImages';
import { OrderStatusBadge, OrderStatusProgress } from '../components/orders/OrderStatusIndicator';
import {
  Package,
  Truck,
  Calendar,
  ChevronRight,
  X,
  ExternalLink,
  ShoppingBag,
} from 'lucide-react';

interface OrdersPageProps {
  onNavigateHome: () => void;
  onNavigateShop: () => void;
  onSelectProduct: (productId: string) => void;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({
  onNavigateHome,
  onNavigateShop,
  onSelectProduct,
}) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    orderService.getOrders(user?.id).then(data => {
      setOrders(data);
      setIsLoading(false);
    });
  }, [user]);

  const breadcrumbs = [
    { label: 'Home', onClick: onNavigateHome },
    { label: 'My Orders', active: true },
  ];

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6 animate-pulse">
        <div className="w-32 h-4 bg-[#E4E1DA] rounded" />
        <div className="w-64 h-8 bg-[#E4E1DA] rounded" />
        <div className="space-y-4">
          <div className="w-full h-28 bg-[#FFFFFF] border border-[#E4E1DA] rounded-xl" />
          <div className="w-full h-28 bg-[#FFFFFF] border border-[#E4E1DA] rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbs} />

      {/* Heading */}
      <div className="pb-4 border-b border-[#E4E1DA] flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
        <div>
          <h1 className="text-3xl font-semibold text-[#171A19] tracking-tight">
            Order History
          </h1>
          <p className="text-xs text-[#666B67] mt-1">
            Track fulfillment progress and view receipts for past purchases.
          </p>
        </div>
        <span className="text-xs text-[#666B67] tabular-nums">
          {orders.length} total {orders.length === 1 ? 'order' : 'orders'} recorded
        </span>
      </div>

      {orders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No orders found"
          description="You haven't placed any orders yet. Discover our collection of precision workplace essentials."
          actionLabel="Browse Collection"
          onAction={onNavigateShop}
        />
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const itemCount = order.items.reduce((acc, i) => acc + i.quantity, 0);

            return (
              <div
                key={order.id}
                className="bg-[#FFFFFF] border border-[#E4E1DA] hover:border-[#171A19]/40 rounded-xl p-6 transition-all duration-150"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E4E1DA]/60">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#EDE4D2]/60 text-[#123C35] flex items-center justify-center">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <strong className="text-sm font-semibold text-[#171A19]">{order.id}</strong>
                        <OrderStatusBadge status={order.status} />
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#666B67] mt-0.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Placed on {formatDate(order.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6">
                    <div className="text-left sm:text-right">
                      <span className="text-xs text-[#666B67] block">Total Amount</span>
                      <strong className="text-sm font-bold text-[#171A19] tabular-nums">
                        {formatPrice(order.total)}
                      </strong>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedOrder(order)}
                      className="px-4 py-2 bg-[#F7F5F0] hover:bg-[#EDE4D2] text-[#123C35] text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>View Receipt</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Fulfillment Status Progress Stepper */}
                <div className="py-2.5 px-4 my-3 bg-[#FDFCFB] rounded-lg border border-[#E4E1DA]/60">
                  <OrderStatusProgress status={order.status} />
                </div>

                {/* Items Summary Row */}
                <div className="pt-4 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2 overflow-hidden">
                      {order.items.slice(0, 3).map((item, idx) => (
                        <div
                          key={idx}
                          className="w-10 h-10 rounded-lg bg-[#F7F5F0] border-2 border-[#FFFFFF] p-1 flex items-center justify-center shadow-xs"
                          title={item.name}
                        >
                          <img
                            src={(item.image && (item.image.startsWith('data:') || item.image.startsWith('http') || item.image.startsWith('/'))) ? item.image : productImages.arcHeadphones.main}
                            alt={item.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      ))}
                    </div>
                    <span className="text-xs text-[#666B67]">
                      {itemCount} {itemCount === 1 ? 'item' : 'items'} ({order.items.map(i => i.name).join(', ').slice(0, 40)}...)
                    </span>
                  </div>

                  <span className="text-xs font-medium text-[#123C35] flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5" />
                    <span>{order.estimatedDelivery}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-[#171A19]/50 backdrop-blur-xs transition-opacity"
            onClick={() => setSelectedOrder(null)}
          />
          <div className="relative w-full max-w-2xl bg-[#FFFFFF] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col z-10">
            {/* Header */}
            <div className="px-6 py-5 border-b border-[#E4E1DA] flex items-center justify-between bg-[#F7F5F0]">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#123C35]">Order Details</span>
                <h3 className="text-lg font-semibold text-[#171A19]">{selectedOrder.id}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-[#666B67] hover:text-[#171A19] rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Delivery Status & Fulfillment Stepper */}
              <div className="p-5 bg-[#FDFCFB] rounded-xl border border-[#E4E1DA] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[#666B67]">Status:</span>
                    <OrderStatusBadge status={selectedOrder.status} size="md" />
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[#171A19]">
                    <Truck className="w-3.5 h-3.5 text-[#123C35]" />
                    <span className="text-[#666B67]">Est. Delivery:</span>
                    <strong className="font-semibold">{selectedOrder.estimatedDelivery}</strong>
                  </div>
                </div>

                {/* Progress Stepper */}
                <div className="pt-3 border-t border-[#E4E1DA]/60">
                  <OrderStatusProgress status={selectedOrder.status} />
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#666B67]">
                  Items Ordered
                </h4>
                <div className="border border-[#E4E1DA] rounded-xl divide-y divide-[#E4E1DA] overflow-hidden">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 bg-[#F7F5F0] border border-[#E4E1DA] rounded-lg p-1.5 shrink-0 flex items-center justify-center">
                          <img
                            src={(item.image && (item.image.startsWith('data:') || item.image.startsWith('http') || item.image.startsWith('/'))) ? item.image : productImages.arcHeadphones.main}
                            alt={item.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div>
                          <h5
                            onClick={() => {
                              setSelectedOrder(null);
                              onSelectProduct(item.productId);
                            }}
                            className="text-sm font-semibold text-[#171A19] hover:text-[#123C35] cursor-pointer"
                          >
                            {item.name}
                          </h5>
                          <span className="text-xs text-[#666B67]">
                            Qty: {item.quantity} · {formatPrice(item.price)} each
                          </span>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-[#171A19] tabular-nums">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping & Payment Meta */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-[#F7F5F0] rounded-xl space-y-1">
                  <h5 className="font-semibold text-[#171A19] mb-1">Destination Address</h5>
                  <p className="font-medium text-[#171A19]">{selectedOrder.shippingAddress.fullName}</p>
                  <p className="text-[#666B67]">{selectedOrder.shippingAddress.addressLine}</p>
                  <p className="text-[#666B67]">
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode}
                  </p>
                  <p className="text-[#666B67] pt-1">Phone: {selectedOrder.shippingAddress.phone}</p>
                </div>

                <div className="p-4 bg-[#F7F5F0] rounded-xl space-y-1">
                  <h5 className="font-semibold text-[#171A19] mb-1">Payment & Logistics</h5>
                  <p className="text-[#666B67]">
                    Method: <strong className="text-[#171A19] uppercase">{selectedOrder.paymentMethod}</strong>
                  </p>
                  <p className="text-[#666B67]">
                    Courier: <strong className="text-[#171A19]">{selectedOrder.deliveryMethod === 'express' ? 'Air Express' : 'Ground Standard'}</strong>
                  </p>
                  <p className="text-[#666B67]">
                    Tracking: <strong className="text-[#171A19]">{selectedOrder.trackingNumber || 'Pending'}</strong>
                  </p>
                </div>
              </div>

              {/* Financial Totals */}
              <div className="space-y-2 pt-2 border-t border-[#E4E1DA] text-xs text-[#666B67] max-w-xs ml-auto">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#171A19] tabular-nums">{formatPrice(selectedOrder.subtotal)}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-[#2F6B57]">
                    <span>Discount</span>
                    <span className="font-semibold tabular-nums">-{formatPrice(selectedOrder.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-medium text-[#171A19] tabular-nums">
                    {selectedOrder.shipping === 0 ? 'Complimentary' : formatPrice(selectedOrder.shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-[#666B67]">
                  <span>GST (Included)</span>
                  <span className="tabular-nums">{formatPrice(selectedOrder.tax)}</span>
                </div>
                <div className="pt-2 border-t border-[#E4E1DA] flex justify-between text-base font-bold text-[#171A19]">
                  <span>Total Amount</span>
                  <span className="tabular-nums">{formatPrice(selectedOrder.total)}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#F7F5F0] border-t border-[#E4E1DA] flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-2 bg-[#123C35] hover:bg-[#0D302A] text-[#FFFFFF] text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
