import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Truck, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { couponService } from '../../services/api';

export const CartDrawer = () => {
  const {
    cartItems,
    cartSubtotal,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    freeShippingThreshold,
    amountNeededForFreeShipping,
    freeShippingProgress,
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode) return;

    setCouponLoading(true);
    setCouponError('');
    try {
      const res = await couponService.applyCoupon({
        code: couponCode,
        subtotal: cartSubtotal,
      });

      if (res.data.success) {
        setAppliedCoupon(res.data.coupon);
        setCouponCode('');
      }
    } catch (err) {
      setCouponError(err.message || 'Invalid promotional code');
    } finally {
      setCouponLoading(false);
    }
  };

  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const shippingFee = cartSubtotal >= freeShippingThreshold ? 0 : (cartItems.length > 0 ? 99 : 0);
  const finalTotal = Math.max(0, cartSubtotal + shippingFee - discountAmount);

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    navigate('/checkout', { state: { appliedCoupon } });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-charcoal-900/60 backdrop-blur-xs transition-opacity animate-fadeIn"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-ivory-50 border-l border-ivory-300 shadow-2xl flex flex-col animate-slideLeft">
          {/* Header */}
          <div className="p-6 border-b border-ivory-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-charcoal-800" />
              <h2 className="font-serif text-xl font-semibold tracking-wide text-charcoal-800">
                Your Grooming Bag ({cartItems.reduce((acc, it) => acc + it.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-charcoal-400 hover:text-charcoal-800 p-1 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Meter */}
          <div className="bg-ivory-100 px-6 py-3 border-b border-ivory-200">
            <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
              <span className="flex items-center text-charcoal-700">
                <Truck className="w-3.5 h-3.5 mr-1.5 text-sage-600" />
                {amountNeededForFreeShipping > 0
                  ? `Add ₹${Math.round(amountNeededForFreeShipping)} more for Complimentary Shipping`
                  : 'You unlocked Complimentary Pan-India Delivery!'}
              </span>
              <span className="text-sage-700 font-semibold">{freeShippingProgress}%</span>
            </div>
            <div className="w-full bg-ivory-300 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-sage-500 h-full transition-all duration-500 ease-out"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-16 h-16 mx-auto mb-4 bg-ivory-200 rounded-full flex items-center justify-center text-charcoal-400">
                  <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
                </div>
                <h3 className="font-serif text-lg font-medium text-charcoal-800 mb-1">
                  Your grooming bag is empty
                </h3>
                <p className="text-xs text-charcoal-500 mb-6 max-w-xs mx-auto">
                  Explore our veterinary-formulated emergency grooming kits and botanical care essentials.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/shop');
                  }}
                  className="inline-block bg-charcoal-800 hover:bg-charcoal-900 text-ivory-50 text-xs uppercase tracking-widest font-semibold px-6 py-3 rounded transition-colors"
                >
                  Discover Collections
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex space-x-4 pb-4 border-b border-ivory-200 last:border-0"
                >
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=300&q=80'}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded bg-ivory-200 shrink-0 border border-ivory-200"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <Link
                          to={`/product/${item.slug}`}
                          onClick={() => setIsCartOpen(false)}
                          className="text-xs font-semibold text-charcoal-800 hover:text-sage-600 line-clamp-1"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-charcoal-400 hover:text-red-500 transition-colors p-0.5 ml-2"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {item.variantName && (
                        <p className="text-[11px] text-charcoal-500 mt-0.5">{item.variantName}</p>
                      )}
                      <p className="text-xs font-semibold text-charcoal-900 mt-1">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </p>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="flex items-center border border-ivory-300 rounded bg-ivory-50">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 text-charcoal-600 hover:bg-ivory-200 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-medium text-charcoal-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 text-charcoal-600 hover:bg-ivory-200 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Totals */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-ivory-200 bg-ivory-100/60 space-y-4">
              {/* Coupon Code Section */}
              <form onSubmit={handleApplyCoupon} className="space-y-1">
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 absolute left-3 top-3 text-charcoal-400" />
                    <input
                      type="text"
                      placeholder="Promo Code (e.g. RITUAL10)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="w-full bg-ivory-50 border border-ivory-300 text-xs pl-8 pr-3 py-2 rounded focus:outline-none focus:border-sage-500 uppercase tracking-wider"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={couponLoading || !couponCode}
                    className="bg-charcoal-700 hover:bg-charcoal-800 text-ivory-50 text-xs px-3 py-2 rounded font-medium disabled:opacity-50"
                  >
                    {couponLoading ? '...' : 'Apply'}
                  </button>
                </div>
                {couponError && <p className="text-[11px] text-red-500">{couponError}</p>}
                {appliedCoupon && (
                  <p className="text-[11px] text-sage-700 flex items-center font-medium">
                    <Check className="w-3 h-3 mr-1" />
                    Code {appliedCoupon.code} applied (-₹{appliedCoupon.discountAmount})
                  </p>
                )}
              </form>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-charcoal-600 pt-2 border-t border-ivory-200">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-charcoal-800">
                    ₹{cartSubtotal.toLocaleString('en-IN')}
                  </span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-sage-700 font-medium">
                    <span>Promotional Discount</span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shippingFee === 0 ? 'Complimentary' : `₹${shippingFee}`}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-charcoal-900 pt-2 border-t border-ivory-300">
                  <span>Total Amount</span>
                  <span>₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleCheckoutClick}
                className="w-full bg-charcoal-800 hover:bg-charcoal-900 text-ivory-50 text-xs uppercase tracking-widest font-semibold py-3.5 rounded flex items-center justify-center space-x-2 transition-colors shadow-md"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
