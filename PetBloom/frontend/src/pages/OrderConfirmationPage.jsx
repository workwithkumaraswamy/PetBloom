import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Package, Truck, Printer, ArrowRight, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { orderService } from '../services/api';

export const OrderConfirmationPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fire festive confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#7A8B7B', '#EDE5D8', '#404040'],
    });

    const fetchOrder = async () => {
      try {
        const res = await orderService.getOrderById(id);
        if (res.data.success) {
          setOrder(res.data.order);
        }
      } catch (err) {
        console.warn('Failed to load order:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory-50 flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-sage-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-charcoal-500">Retrieving your order invoice...</p>
        </div>
      </div>
    );
  }

  const shippingAddr = order?.shippingAddressSnapshot
    ? typeof order.shippingAddressSnapshot === 'string'
      ? JSON.parse(order.shippingAddressSnapshot)
      : order.shippingAddressSnapshot
    : {};

  return (
    <div className="min-h-screen bg-ivory-50 py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-ivory-100/80 border border-ivory-300 rounded-2xl p-8 sm:p-12 shadow-sm space-y-8">
          {/* Header */}
          <div className="text-center space-y-3 pb-6 border-b border-ivory-200">
            <div className="w-16 h-16 bg-sage-100 text-sage-700 rounded-full flex items-center justify-center mx-auto border border-sage-200 shadow-sm">
              <CheckCircle2 className="w-8 h-8 stroke-[1.8]" />
            </div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-sage-600 font-semibold block">
              Order Confirmed &amp; In Preparation
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-charcoal-900 tracking-tight">
              Thank You for Trusting PetBloom.
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-600 max-w-md mx-auto font-light leading-relaxed">
              Your pet's grooming parcel is being carefully inspected, packed in our botanical apothecary, and prepared for express air dispatch.
            </p>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="bg-ivory-50 border border-ivory-200 p-3 rounded-lg">
              <span className="text-[10px] text-charcoal-500 uppercase tracking-wider block font-semibold">
                Order Number
              </span>
              <span className="text-xs font-serif font-bold text-charcoal-900 mt-0.5 block">
                {order?.orderNumber || 'PR-2024-XXXX'}
              </span>
            </div>
            <div className="bg-ivory-50 border border-ivory-200 p-3 rounded-lg">
              <span className="text-[10px] text-charcoal-500 uppercase tracking-wider block font-semibold">
                Payment Status
              </span>
              <span
                className={`text-xs font-semibold mt-0.5 block uppercase ${
                  order?.paymentStatus === 'PAID' ? 'text-sage-700' : 'text-gold-700'
                }`}
              >
                {order?.paymentStatus || 'PENDING'}
              </span>
            </div>
            <div className="bg-ivory-50 border border-ivory-200 p-3 rounded-lg">
              <span className="text-[10px] text-charcoal-500 uppercase tracking-wider block font-semibold">
                Estimated Delivery
              </span>
              <span className="text-xs font-semibold text-charcoal-800 mt-0.5 block">
                3 to 5 Days
              </span>
            </div>
            <div className="bg-ivory-50 border border-ivory-200 p-3 rounded-lg">
              <span className="text-[10px] text-charcoal-500 uppercase tracking-wider block font-semibold">
                Total Amount
              </span>
              <span className="text-xs font-bold text-charcoal-900 mt-0.5 block">
                ₹{order?.totalAmount?.toLocaleString('en-IN') || 0}
              </span>
            </div>
          </div>

          {/* Items Breakdown */}
          <div className="space-y-4 pt-4 border-t border-ivory-200">
            <h3 className="font-serif text-lg font-semibold text-charcoal-900">
              Curated Essentials in This Parcel
            </h3>
            <div className="divide-y divide-ivory-200">
              {order?.items?.map((it) => (
                <div key={it.id} className="py-3 flex justify-between items-center text-xs">
                  <div>
                    <p className="font-semibold text-charcoal-800">{it.productName}</p>
                    {it.variantInfo && (
                      <p className="text-[11px] text-charcoal-500">{it.variantInfo}</p>
                    )}
                    <p className="text-[11px] text-charcoal-400">Qty: {it.quantity} • SKU: {it.productSku}</p>
                  </div>
                  <span className="font-semibold text-charcoal-900">
                    ₹{it.total.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="bg-ivory-50 p-4 rounded-lg border border-ivory-200 space-y-1.5 text-xs text-charcoal-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{order?.subtotal?.toLocaleString('en-IN')}</span>
              </div>
              {order?.discountAmount > 0 && (
                <div className="flex justify-between text-sage-700 font-medium">
                  <span>Promotional Savings ({order?.couponCode})</span>
                  <span>-₹{order?.discountAmount?.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Insured Express Shipping</span>
                <span>{order?.shippingFee === 0 ? 'Complimentary' : `₹${order?.shippingFee}`}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-charcoal-900 pt-2 border-t border-ivory-200">
                <span>Grand Total</span>
                <span>₹{order?.totalAmount?.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Delivery & Tracking Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-ivory-200 text-xs text-charcoal-600">
            <div>
              <h4 className="font-semibold uppercase tracking-wider text-charcoal-800 mb-2">
                Delivery Address
              </h4>
              <p className="font-medium text-charcoal-800">{shippingAddr.fullName || order?.customerName}</p>
              <p>{shippingAddr.streetAddress}</p>
              {shippingAddr.apartment && <p>{shippingAddr.apartment}</p>}
              <p>{shippingAddr.city}, {shippingAddr.state} - {shippingAddr.postalCode}</p>
              <p className="mt-1">Phone: {shippingAddr.phone || order?.customerPhone}</p>
            </div>

            <div>
              <h4 className="font-semibold uppercase tracking-wider text-charcoal-800 mb-2">
                Order Tracking
              </h4>
              <p>Tracking Reference: <span className="font-mono text-charcoal-800">{order?.trackingNumber || 'Pending Dispatch Assignment'}</span></p>
              <p className="mt-1 text-[11px] text-charcoal-500">
                A dispatch confirmation with BlueDart / Delhivery live link will be sent to <span className="font-medium text-charcoal-700">{order?.customerEmail}</span>.
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-ivory-200">
            <button
              onClick={() => window.print()}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 text-xs border border-ivory-300 bg-ivory-50 text-charcoal-700 hover:bg-white px-5 py-2.5 rounded transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Tax Invoice</span>
            </button>

            <Link
              to="/shop"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 text-xs uppercase tracking-widest font-semibold bg-charcoal-800 hover:bg-charcoal-900 text-ivory-50 px-6 py-3 rounded shadow-md transition-colors"
            >
              <span>Explore More Curations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
