import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { DeliveryMethod, Order, PaymentMethod, ShippingAddress } from '../types';
import { formatPrice } from '../utils/currency';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { useToast } from '../context/ToastContext';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  QrCode,
  Banknote,
  Lock,
  ArrowRight,
  Check,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface CheckoutPageProps {
  onNavigateHome: () => void;
  onNavigateCart: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  onNavigateHome,
  onNavigateCart,
  onOrderSuccess,
}) => {
  const { cart, summary, clearCart } = useCart();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [address, setAddress] = useState<ShippingAddress>({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    addressLine: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  });

  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('standard');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If user has saved addresses, prefill the first one
  useEffect(() => {
    if (user?.savedAddresses && user.savedAddresses.length > 0) {
      const saved = user.savedAddresses[0];
      setAddress({
        fullName: saved.fullName || user.name,
        email: saved.email || user.email,
        phone: saved.phone || '',
        addressLine: saved.addressLine || '',
        city: saved.city || '',
        state: saved.state || '',
        postalCode: saved.postalCode || '',
        country: 'India',
      });
    } else if (user) {
      setAddress(prev => ({
        ...prev,
        fullName: user.name,
        email: user.email,
      }));
    }
  }, [user]);

  const handleInputChange = (field: keyof ShippingAddress, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleFastFill = () => {
    setAddress({
      fullName: 'Vikram Malhotra',
      email: 'vikram.malhotra@studio.in',
      phone: '+91 98201 54321',
      addressLine: 'Flat 904, Tower B, Horizon Heights, Golf Course Ext Rd',
      city: 'Gurugram',
      state: 'Haryana',
      postalCode: '122002',
      country: 'India',
    });
    setErrors({});
    addToast('Sample address loaded', 'info', 'Prepared for quick evaluation flow');
  };

  const expressSurcharge = deliveryMethod === 'express' ? 250 : 0;
  const finalTotal = summary.total + expressSurcharge;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      addToast('Cannot checkout', 'error', 'Your shopping bag is empty.');
      onNavigateCart();
      return;
    }

    const validation = orderService.validateShippingAddress(address);
    if (!validation.valid) {
      setErrors(validation.errors);
      const firstError = Object.values(validation.errors)[0];
      addToast('Please complete required fields', 'error', firstError);
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate realistic network roundtrip
      await new Promise(resolve => setTimeout(resolve, 800));

      const adjustedSummary = {
        ...summary,
        shipping: summary.shipping + expressSurcharge,
        total: finalTotal,
      };

      const order = await orderService.createOrder({
        userId: user?.id,
        items: cart,
        summary: adjustedSummary,
        shippingAddress: address,
        deliveryMethod,
        paymentMethod,
      });

      await clearCart();
      addToast('Order confirmed!', 'success', `Order ID: ${order.id}`);
      onOrderSuccess(order);
    } catch (err: any) {
      addToast('Order processing failed', 'error', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const breadcrumbs = [
    { label: 'Home', onClick: onNavigateHome },
    { label: 'Shopping Bag', onClick: onNavigateCart },
    { label: 'Checkout', active: true },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbs} />

      {/* Heading */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-4 border-b border-[#E4E1DA]">
        <div>
          <h1 className="text-3xl font-semibold text-[#171A19] tracking-tight">
            Checkout & Dispatch
          </h1>
          <p className="text-xs text-[#666B67] mt-1">
            Complete your delivery destination and confirm your order.
          </p>
        </div>
        <button
          type="button"
          onClick={handleFastFill}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#EDE4D2] hover:bg-[#E4D5BC] text-[#123C35] rounded-lg text-xs font-semibold tracking-wide transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Fast-fill sample address</span>
        </button>
      </div>

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Form Details */}
          <div className="lg:col-span-7 space-y-8">
            {/* Section 1: Contact Information */}
            <div className="bg-[#FFFFFF] border border-[#E4E1DA] rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E4E1DA]">
                <h3 className="text-base font-semibold text-[#171A19] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#123C35] text-[#FFFFFF] text-xs flex items-center justify-center font-bold">1</span>
                  <span>Contact Information</span>
                </h3>
                {user && (
                  <span className="text-xs text-[#2F6B57] font-medium">
                    Signed in as {user.name}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#666B67] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={address.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="e.g. Vikram Malhotra"
                    className={`w-full bg-[#F7F5F0] border ${errors.fullName ? 'border-[#A94747]' : 'border-[#E4E1DA]'} focus:border-[#123C35] rounded-lg px-3.5 py-2.5 text-sm text-[#171A19]`}
                  />
                  {errors.fullName && (
                    <p className="text-xs text-[#A94747] mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.fullName}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#666B67] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={address.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="e.g. vikram@studio.in"
                    className={`w-full bg-[#F7F5F0] border ${errors.email ? 'border-[#A94747]' : 'border-[#E4E1DA]'} focus:border-[#123C35] rounded-lg px-3.5 py-2.5 text-sm text-[#171A19]`}
                  />
                  {errors.email && (
                    <p className="text-xs text-[#A94747] mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#666B67] mb-1">
                    Mobile Phone (For courier SMS & OTP) *
                  </label>
                  <input
                    type="tel"
                    value={address.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className={`w-full bg-[#F7F5F0] border ${errors.phone ? 'border-[#A94747]' : 'border-[#E4E1DA]'} focus:border-[#123C35] rounded-lg px-3.5 py-2.5 text-sm text-[#171A19]`}
                  />
                  {errors.phone && (
                    <p className="text-xs text-[#A94747] mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.phone}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 2: Shipping Destination */}
            <div className="bg-[#FFFFFF] border border-[#E4E1DA] rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E4E1DA]">
                <h3 className="text-base font-semibold text-[#171A19] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#123C35] text-[#FFFFFF] text-xs flex items-center justify-center font-bold">2</span>
                  <span>Delivery Address</span>
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#666B67] mb-1">
                    Street Address & Apartment / Suite *
                  </label>
                  <input
                    type="text"
                    value={address.addressLine}
                    onChange={(e) => handleInputChange('addressLine', e.target.value)}
                    placeholder="e.g. Flat 904, Tower B, Horizon Heights"
                    className={`w-full bg-[#F7F5F0] border ${errors.addressLine ? 'border-[#A94747]' : 'border-[#E4E1DA]'} focus:border-[#123C35] rounded-lg px-3.5 py-2.5 text-sm text-[#171A19]`}
                  />
                  {errors.addressLine && (
                    <p className="text-xs text-[#A94747] mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.addressLine}</span>
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#666B67] mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      value={address.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="e.g. Gurugram"
                      className={`w-full bg-[#F7F5F0] border ${errors.city ? 'border-[#A94747]' : 'border-[#E4E1DA]'} focus:border-[#123C35] rounded-lg px-3.5 py-2.5 text-sm text-[#171A19]`}
                    />
                    {errors.city && (
                      <p className="text-xs text-[#A94747] mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.city}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#666B67] mb-1">
                      State / Province *
                    </label>
                    <input
                      type="text"
                      value={address.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      placeholder="e.g. Haryana"
                      className={`w-full bg-[#F7F5F0] border ${errors.state ? 'border-[#A94747]' : 'border-[#E4E1DA]'} focus:border-[#123C35] rounded-lg px-3.5 py-2.5 text-sm text-[#171A19]`}
                    />
                    {errors.state && (
                      <p className="text-xs text-[#A94747] mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.state}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#666B67] mb-1">
                      Postal PIN Code *
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={address.postalCode}
                      onChange={(e) => handleInputChange('postalCode', e.target.value)}
                      placeholder="e.g. 122002"
                      className={`w-full bg-[#F7F5F0] border ${errors.postalCode ? 'border-[#A94747]' : 'border-[#E4E1DA]'} focus:border-[#123C35] rounded-lg px-3.5 py-2.5 text-sm text-[#171A19]`}
                    />
                    {errors.postalCode && (
                      <p className="text-xs text-[#A94747] mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.postalCode}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#666B67] mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    disabled
                    value="India (Domestic deliveries only)"
                    className="w-full bg-[#EFECE6] border border-[#E4E1DA] rounded-lg px-3.5 py-2.5 text-xs text-[#666B67] cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Delivery Speed */}
            <div className="bg-[#FFFFFF] border border-[#E4E1DA] rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E4E1DA]">
                <h3 className="text-base font-semibold text-[#171A19] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#123C35] text-[#FFFFFF] text-xs flex items-center justify-center font-bold">3</span>
                  <span>Delivery Method</span>
                </h3>
              </div>

              <div className="space-y-3">
                <label
                  onClick={() => setDeliveryMethod('standard')}
                  className={`flex items-start justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                    deliveryMethod === 'standard'
                      ? 'border-[#123C35] bg-[#EDE4D2]/25 ring-1 ring-[#123C35]'
                      : 'border-[#E4E1DA] hover:border-[#171A19]/30 bg-[#FFFFFF]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="delivery"
                      checked={deliveryMethod === 'standard'}
                      onChange={() => setDeliveryMethod('standard')}
                      className="accent-[#123C35] mt-1"
                    />
                    <div>
                      <div className="text-sm font-semibold text-[#171A19]">Standard Insured Ground Courier</div>
                      <div className="text-xs text-[#666B67] mt-0.5">Estimated delivery: 3–4 business days</div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-[#171A19] tabular-nums">
                    {summary.shipping === 0 ? 'Complimentary' : formatPrice(summary.shipping)}
                  </span>
                </label>

                <label
                  onClick={() => setDeliveryMethod('express')}
                  className={`flex items-start justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                    deliveryMethod === 'express'
                      ? 'border-[#123C35] bg-[#EDE4D2]/25 ring-1 ring-[#123C35]'
                      : 'border-[#E4E1DA] hover:border-[#171A19]/30 bg-[#FFFFFF]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="delivery"
                      checked={deliveryMethod === 'express'}
                      onChange={() => setDeliveryMethod('express')}
                      className="accent-[#123C35] mt-1"
                    />
                    <div>
                      <div className="text-sm font-semibold text-[#171A19] flex items-center gap-2">
                        <span>Express Air Priority</span>
                        <span className="text-[10px] uppercase font-bold tracking-wider bg-[#EDE4D2] text-[#123C35] px-1.5 py-0.5 rounded">Fastest</span>
                      </div>
                      <div className="text-xs text-[#666B67] mt-0.5">Guaranteed delivery: 1–2 business days via Bluedart/Delhivery</div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-[#171A19] tabular-nums">
                    +₹250
                  </span>
                </label>
              </div>
            </div>

            {/* Section 4: Payment Confirmation */}
            <div className="bg-[#FFFFFF] border border-[#E4E1DA] rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E4E1DA]">
                <h3 className="text-base font-semibold text-[#171A19] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#123C35] text-[#FFFFFF] text-xs flex items-center justify-center font-bold">4</span>
                  <span>Payment Settlement</span>
                </h3>
                <span className="text-xs text-[#666B67] flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-[#123C35]" />
                  <span>256-bit Encrypted</span>
                </span>
              </div>

              {/* Prototype Disclosure Note */}
              <div className="p-3 bg-[#F7F5F0] border border-[#E4E1DA] rounded-lg text-xs text-[#666B67]">
                <strong className="text-[#171A19]">Prototype Notice:</strong> Transactions are processed in realistic simulated mode. No live funds are deducted from your bank accounts or cards.
              </div>

              <div className="space-y-3">
                {/* Cash on Delivery */}
                <label
                  onClick={() => setPaymentMethod('cod')}
                  className={`flex items-start justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-[#123C35] bg-[#EDE4D2]/25 ring-1 ring-[#123C35]'
                      : 'border-[#E4E1DA] hover:border-[#171A19]/30 bg-[#FFFFFF]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="accent-[#123C35] mt-1"
                    />
                    <div>
                      <div className="text-sm font-semibold text-[#171A19] flex items-center gap-2">
                        <Banknote className="w-4 h-4 text-[#123C35]" />
                        <span>Cash on Delivery (COD)</span>
                      </div>
                      <div className="text-xs text-[#666B67] mt-0.5">
                        Pay with cash or UPI QR code directly to the courier agent upon doorstep inspection.
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-[#2F6B57]">Zero Fee</span>
                </label>

                {/* Simulated UPI */}
                <label
                  onClick={() => setPaymentMethod('upi_mock')}
                  className={`flex items-start justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'upi_mock'
                      ? 'border-[#123C35] bg-[#EDE4D2]/25 ring-1 ring-[#123C35]'
                      : 'border-[#E4E1DA] hover:border-[#171A19]/30 bg-[#FFFFFF]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'upi_mock'}
                      onChange={() => setPaymentMethod('upi_mock')}
                      className="accent-[#123C35] mt-1"
                    />
                    <div>
                      <div className="text-sm font-semibold text-[#171A19] flex items-center gap-2">
                        <QrCode className="w-4 h-4 text-[#123C35]" />
                        <span>Instant UPI (Google Pay, PhonePe, Paytm)</span>
                      </div>
                      <div className="text-xs text-[#666B67] mt-0.5">
                        Instant 1-click confirmation with zero waiting.
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-[#123C35]">Instant</span>
                </label>

                {/* Simulated Card */}
                <label
                  onClick={() => setPaymentMethod('card_mock')}
                  className={`flex items-start justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'card_mock'
                      ? 'border-[#123C35] bg-[#EDE4D2]/25 ring-1 ring-[#123C35]'
                      : 'border-[#E4E1DA] hover:border-[#171A19]/30 bg-[#FFFFFF]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'card_mock'}
                      onChange={() => setPaymentMethod('card_mock')}
                      className="accent-[#123C35] mt-1"
                    />
                    <div>
                      <div className="text-sm font-semibold text-[#171A19] flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-[#123C35]" />
                        <span>Credit / Debit Card (Visa, MasterCard, RuPay)</span>
                      </div>
                      <div className="text-xs text-[#666B67] mt-0.5">
                        Simulated card gateway authorization.
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-[#123C35]">Instant</span>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Review & Sticky Summary */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            <div className="bg-[#FFFFFF] border border-[#E4E1DA] rounded-xl p-6 space-y-5">
              <h3 className="text-base font-semibold text-[#171A19] pb-3 border-b border-[#E4E1DA] flex items-center justify-between">
                <span>Items in Order</span>
                <span className="text-xs font-normal text-[#666B67]">({cart.length} distinct items)</span>
              </h3>

              {/* Item Previews */}
              <div className="max-h-60 overflow-y-auto divide-y divide-[#E4E1DA]/60 pr-1">
                {cart.map(({ product, quantity }) => (
                  <div key={product.id} className="py-3 flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#F7F5F0] border border-[#E4E1DA] rounded-lg p-1 shrink-0 flex items-center justify-center">
                      <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-semibold text-[#171A19] truncate">{product.name}</h5>
                      <span className="text-[11px] text-[#666B67]">Qty: {quantity}</span>
                    </div>
                    <div className="text-xs font-semibold text-[#171A19] tabular-nums">
                      {formatPrice(product.price * quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary Financials */}
              <div className="space-y-2.5 pt-3 border-t border-[#E4E1DA] text-xs text-[#666B67]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#171A19] tabular-nums">{formatPrice(summary.subtotal)}</span>
                </div>
                {summary.discount > 0 && (
                  <div className="flex justify-between text-[#2F6B57]">
                    <span>Discount ({summary.discountCode})</span>
                    <span className="font-semibold tabular-nums">-{formatPrice(summary.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Standard Shipping</span>
                  <span className="font-medium text-[#171A19] tabular-nums">
                    {summary.shipping === 0 ? 'Complimentary' : formatPrice(summary.shipping)}
                  </span>
                </div>
                {deliveryMethod === 'express' && (
                  <div className="flex justify-between text-[#123C35]">
                    <span>Express Air Upgrade</span>
                    <span className="font-semibold tabular-nums">+₹250</span>
                  </div>
                )}
                <div className="flex justify-between text-[#666B67]">
                  <span>18% GST (Included)</span>
                  <span className="tabular-nums">{formatPrice(summary.tax)}</span>
                </div>
                <div className="pt-3 border-t border-[#E4E1DA] flex justify-between text-lg font-bold text-[#171A19]">
                  <span>Total Amount</span>
                  <span className="tabular-nums">{formatPrice(finalTotal)}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#123C35] hover:bg-[#0D302A] text-[#FFFFFF] text-xs font-semibold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:translate-y-[-1px] active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span>Securing & Authorizing Order...</span>
                ) : (
                  <>
                    <span>Confirm Order ({formatPrice(finalTotal)})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-[11px] text-[#666B67] text-center">
                By placing your order, you agree to Nexora's Terms of Sale and Delivery Policy.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
