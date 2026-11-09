import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CartPage = () => {
  const {
    cartItems,
    cartSubtotal,
    updateQuantity,
    removeFromCart,
    clearCart,
    freeShippingThreshold,
    amountNeededForFreeShipping,
    freeShippingProgress,
  } = useCart();

  const navigate = useNavigate();
  const shippingFee = cartSubtotal >= freeShippingThreshold ? 0 : (cartItems.length > 0 ? 99 : 0);
  const finalTotal = cartSubtotal + shippingFee;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-ivory-50 flex items-center justify-center py-20 px-4">
        <div className="text-center max-w-md bg-ivory-100/70 border border-ivory-300 p-8 sm:p-12 rounded-2xl shadow-sm">
          <div className="w-16 h-16 bg-ivory-200 rounded-full flex items-center justify-center mx-auto mb-4 text-charcoal-400">
            <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h2 className="font-serif text-2xl font-semibold text-charcoal-800 mb-2">
            Your Grooming Bag is Empty
          </h2>
          <p className="text-xs text-charcoal-500 mb-6">
            Discover our veterinary-guided grooming essentials and emergency care kits.
          </p>
          <Link
            to="/shop"
            className="inline-block bg-charcoal-800 hover:bg-charcoal-900 text-ivory-50 text-xs uppercase tracking-widest font-semibold px-8 py-3.5 rounded shadow-md"
          >
            Explore Collections
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center max-w-xl mx-auto">
          <span className="text-[10px] uppercase tracking-[0.25em] text-sage-600 font-semibold block mb-1">
            Review Selection
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-charcoal-900 tracking-tight">
            Your Grooming Bag ({cartItems.reduce((acc, it) => acc + it.quantity, 0)})
          </h1>
        </div>

        {/* Free Shipping Alert Banner */}
        <div className="max-w-4xl mx-auto bg-ivory-100 border border-ivory-300 p-4 rounded-xl mb-8">
          <div className="flex items-center justify-between text-xs font-medium mb-1.5 text-charcoal-800">
            <span className="flex items-center">
              <Truck className="w-4 h-4 mr-1.5 text-sage-600" />
              {amountNeededForFreeShipping > 0
                ? `Add ₹${Math.round(amountNeededForFreeShipping)} more to unlock complimentary Pan-India shipping`
                : 'Complimentary Pan-India shipping unlocked!'}
            </span>
            <span className="font-bold text-sage-700">{freeShippingProgress}%</span>
          </div>
          <div className="w-full bg-ivory-300 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-sage-600 h-full transition-all duration-500"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Items List (7 cols) */}
          <div className="lg:col-span-8 bg-ivory-100/70 border border-ivory-300 rounded-2xl p-6 divide-y divide-ivory-200">
            {cartItems.map((item) => (
              <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex space-x-4">
                <img
                  src={item.image || 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=200&q=80'}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg bg-ivory-200 border border-ivory-200 shrink-0"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <Link to={`/product/${item.slug}`} className="font-serif text-base font-semibold text-charcoal-900 hover:text-sage-700">
                        {item.name}
                      </Link>
                      {item.variantName && (
                        <p className="text-xs text-charcoal-500">{item.variantName}</p>
                      )}
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-charcoal-400 hover:text-red-500 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center border border-ivory-300 rounded bg-ivory-50">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2.5 py-1 text-charcoal-600 hover:bg-ivory-200"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 text-xs font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2.5 py-1 text-charcoal-600 hover:bg-ivory-200"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-sm font-semibold text-charcoal-900">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Totals Summary (4 cols) */}
          <div className="lg:col-span-4 bg-ivory-100/90 border border-ivory-300 rounded-2xl p-6 space-y-4">
            <h3 className="font-serif text-lg font-semibold text-charcoal-900 border-b border-ivory-200 pb-3">
              Order Summary
            </h3>

            <div className="space-y-2 text-xs text-charcoal-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-charcoal-800">
                  ₹{cartSubtotal.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Express Insured Shipping</span>
                <span>{shippingFee === 0 ? 'Complimentary' : `₹${shippingFee}`}</span>
              </div>
              <div className="flex justify-between text-base font-semibold text-charcoal-900 pt-3 border-t border-ivory-300">
                <span>Total Amount</span>
                <span>₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-charcoal-800 hover:bg-charcoal-900 text-ivory-50 text-xs uppercase tracking-widest font-semibold py-3.5 rounded-lg transition-colors shadow-md flex items-center justify-center space-x-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
