import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ShieldCheck, Truck, CreditCard, Banknote, ArrowRight, Check, Tag, AlertCircle, MapPin, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService, paymentService, couponService, authService } from '../services/api';

export const CheckoutPage = () => {
  const { cartItems, cartSubtotal, clearCart, freeShippingThreshold } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if cart empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/shop');
    }
  }, [cartItems, navigate]);

  // Form State
  const [formData, setFormData] = useState({
    customerName: user ? `${user.firstName} ${user.lastName || ''}`.trim() : '',
    customerEmail: user ? user.email : '',
    customerPhone: user?.phone || '',
    streetAddress: '',
    apartment: '',
    city: '',
    state: 'Delhi',
    postalCode: '',
    country: 'India',
    notes: '',
  });

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('RAZORPAY'); // 'RAZORPAY' or 'COD'
  const [couponCode, setCouponCode] = useState(location.state?.appliedCoupon?.code || '');
  const [appliedCoupon, setAppliedCoupon] = useState(location.state?.appliedCoupon || null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Simulated Razorpay Modal State for interactive testing
  const [razorpayModal, setRazorpayModal] = useState({
    isOpen: false,
    orderData: null,
    rzpOrder: null,
    selectedTestPayment: 'card', // 'card' or 'upi'
  });

  // Fetch saved addresses if logged in
  useEffect(() => {
    if (isAuthenticated) {
      authService.getAddresses().then((res) => {
        if (res.data.success && res.data.addresses.length > 0) {
          setSavedAddresses(res.data.addresses);
          const defaultAddr = res.data.addresses.find((a) => a.isDefault) || res.data.addresses[0];
          setFormData((prev) => ({
            ...prev,
            customerName: defaultAddr.fullName || prev.customerName,
            customerPhone: defaultAddr.phone || prev.customerPhone,
            streetAddress: defaultAddr.streetAddress,
            apartment: defaultAddr.apartment || '',
            city: defaultAddr.city,
            state: defaultAddr.state,
            postalCode: defaultAddr.postalCode,
          }));
        }
      }).catch((e) => console.warn('Could not load saved addresses:', e));
    }
  }, [isAuthenticated]);

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
      }
    } catch (err) {
      setCouponError(err.message || 'Invalid promotional code');
    } finally {
      setCouponLoading(false);
    }
  };

  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const shippingFee = cartSubtotal >= freeShippingThreshold ? 0 : 99;
  const finalTotal = Math.max(0, cartSubtotal + shippingFee - discountAmount);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSavedAddressSelect = (addr) => {
    setFormData((prev) => ({
      ...prev,
      customerName: addr.fullName,
      customerPhone: addr.phone,
      streetAddress: addr.streetAddress,
      apartment: addr.apartment || '',
      city: addr.city,
      state: addr.state,
      postalCode: addr.postalCode,
    }));
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (
      !formData.customerName ||
      !formData.customerEmail ||
      !formData.customerPhone ||
      !formData.streetAddress ||
      !formData.city ||
      !formData.postalCode
    ) {
      setErrorMessage('Please complete all mandatory delivery and contact fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Create order on backend
      const orderPayload = {
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        shippingAddress: {
          fullName: formData.customerName,
          phone: formData.customerPhone,
          streetAddress: formData.streetAddress,
          apartment: formData.apartment,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
        },
        items: cartItems.map((it) => ({
          productId: it.productId,
          productName: it.name,
          variantId: it.variantId,
          quantity: it.quantity,
        })),
        paymentMethod,
        couponCode: appliedCoupon?.code,
        notes: formData.notes,
      };

      const orderRes = await orderService.createOrder(orderPayload);
      if (!orderRes.data.success) {
        throw new Error(orderRes.data.message || 'Failed to initialize order.');
      }

      const createdOrder = orderRes.data.order;

      // 2. Handle Payment Flow
      if (paymentMethod === 'COD') {
        // Confirm Cash on Delivery
        await paymentService.confirmCOD({ orderId: createdOrder.id });
        await clearCart();
        navigate(`/order-confirmation/${createdOrder.id}`);
      } else {
        // Razorpay Payment Flow
        const rzpRes = await paymentService.createRazorpayOrder({ orderId: createdOrder.id });
        if (!rzpRes.data.success) {
          throw new Error('Failed to create Razorpay gateway order.');
        }

        // Open Razorpay Interactive Test Checkout Modal
        setRazorpayModal({
          isOpen: true,
          orderData: createdOrder,
          rzpOrder: rzpRes.data,
          selectedTestPayment: 'card',
        });
      }
    } catch (err) {
      console.error('Order creation error:', err);
      setErrorMessage(err.message || 'Failed to place order. Please review your details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Process Simulated / Verified Razorpay Payment
  const handleCompleteRazorpayTest = async (isSuccess = true) => {
    setIsSubmitting(true);
    const { orderData, rzpOrder } = razorpayModal;

    try {
      if (!isSuccess) {
        throw new Error('Customer bank simulated authorization failure.');
      }

      const paymentVerificationPayload = {
        orderId: orderData.id,
        razorpayOrderId: rzpOrder.razorpayOrderId,
        razorpayPaymentId: `pay_${Date.now()}_simulated`,
        razorpaySignature: 'simulated_test_signature',
      };

      const verifyRes = await paymentService.verifyRazorpayPayment(paymentVerificationPayload);
      if (!verifyRes.data.success) {
        throw new Error('Cryptographic signature verification declined by server.');
      }

      // Success
      setRazorpayModal({ isOpen: false, orderData: null, rzpOrder: null, selectedTestPayment: 'card' });
      await clearCart();
      navigate(`/order-confirmation/${orderData.id}`);
    } catch (err) {
      alert(`Razorpay Gateway Notice: ${err.message}`);
      setRazorpayModal({ isOpen: false, orderData: null, rzpOrder: null, selectedTestPayment: 'card' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory-50 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <Link to="/" className="inline-block font-serif text-2xl tracking-[0.2em] font-semibold text-charcoal-900 uppercase mb-2">
            PetBloom
          </Link>
          <div className="flex items-center justify-center space-x-2 text-xs text-charcoal-500">
            <Lock className="w-3.5 h-3.5 text-sage-600" />
            <span>256-Bit SSL Encrypted Luxury Checkout</span>
          </div>
        </div>

        {errorMessage && (
          <div className="max-w-3xl mx-auto mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Delivery & Payment Details (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Step 1: Customer Contact */}
            <div className="bg-ivory-100/70 border border-ivory-200 rounded-xl p-6 sm:p-8 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-ivory-200 pb-3">
                <h3 className="font-serif text-xl font-semibold text-charcoal-900">
                  1. Contact Information
                </h3>
                {!isAuthenticated && (
                  <span className="text-xs text-charcoal-500">
                    Already a client?{' '}
                    <Link to="/login" className="text-sage-700 font-semibold underline">
                      Sign In
                    </Link>
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleFormChange}
                    placeholder="e.g. Elena Vance"
                    className="w-full bg-ivory-50 border border-ivory-300 rounded px-3.5 py-2.5 text-xs text-charcoal-800 focus:outline-none focus:border-sage-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                    Phone Number (for Courier Tracking) *
                  </label>
                  <input
                    type="tel"
                    required
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleFormChange}
                    placeholder="+91 98765 43210"
                    className="w-full bg-ivory-50 border border-ivory-300 rounded px-3.5 py-2.5 text-xs text-charcoal-800 focus:outline-none focus:border-sage-600"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                    Email Address (for Order Invoice &amp; Updates) *
                  </label>
                  <input
                    type="email"
                    required
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleFormChange}
                    placeholder="elena@example.com"
                    className="w-full bg-ivory-50 border border-ivory-300 rounded px-3.5 py-2.5 text-xs text-charcoal-800 focus:outline-none focus:border-sage-600"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Shipping Address */}
            <div className="bg-ivory-100/70 border border-ivory-200 rounded-xl p-6 sm:p-8 space-y-4 shadow-xs">
              <div className="border-b border-ivory-200 pb-3 flex justify-between items-center">
                <h3 className="font-serif text-xl font-semibold text-charcoal-900">
                  2. Delivery Address
                </h3>
              </div>

              {/* Saved Addresses Quick Selector */}
              {savedAddresses.length > 0 && (
                <div className="mb-4">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-charcoal-600 block mb-2">
                    Use a Saved Address:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {savedAddresses.map((addr) => (
                      <button
                        type="button"
                        key={addr.id}
                        onClick={() => handleSavedAddressSelect(addr)}
                        className={`text-left p-3 rounded border text-xs transition-all ${
                          formData.streetAddress === addr.streetAddress
                            ? 'border-sage-600 bg-sage-50/70 font-medium'
                            : 'border-ivory-300 bg-ivory-50 hover:border-charcoal-400'
                        }`}
                      >
                        <p className="font-semibold text-charcoal-800">{addr.fullName}</p>
                        <p className="text-charcoal-600 truncate">{addr.streetAddress}</p>
                        <p className="text-[11px] text-charcoal-500">{addr.city}, {addr.state} - {addr.postalCode}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                    Street Address &amp; Building *
                  </label>
                  <input
                    type="text"
                    required
                    name="streetAddress"
                    value={formData.streetAddress}
                    onChange={handleFormChange}
                    placeholder="House / Flat No., Apartment / Society, Street"
                    className="w-full bg-ivory-50 border border-ivory-300 rounded px-3.5 py-2.5 text-xs text-charcoal-800 focus:outline-none focus:border-sage-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                    Apartment, Suite, Unit, Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    name="apartment"
                    value={formData.apartment}
                    onChange={handleFormChange}
                    placeholder="e.g. Tower 4, Apt 8B, Near Central Park"
                    className="w-full bg-ivory-50 border border-ivory-300 rounded px-3.5 py-2.5 text-xs text-charcoal-800 focus:outline-none focus:border-sage-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      name="city"
                      value={formData.city}
                      onChange={handleFormChange}
                      placeholder="e.g. New Delhi"
                      className="w-full bg-ivory-50 border border-ivory-300 rounded px-3.5 py-2.5 text-xs text-charcoal-800 focus:outline-none focus:border-sage-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                      State *
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleFormChange}
                      className="w-full bg-ivory-50 border border-ivory-300 rounded px-3.5 py-2.5 text-xs text-charcoal-800 focus:outline-none focus:border-sage-600"
                    >
                      {['Delhi', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'West Bengal', 'Haryana', 'Uttar Pradesh', 'Gujarat', 'Telangana', 'Rajasthan', 'Kerala', 'Punjab'].map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      required
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleFormChange}
                      placeholder="e.g. 110003"
                      className="w-full bg-ivory-50 border border-ivory-300 rounded px-3.5 py-2.5 text-xs text-charcoal-800 focus:outline-none focus:border-sage-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                    Special Delivery Notes / Concierge Instructions (Optional)
                  </label>
                  <textarea
                    rows={2}
                    name="notes"
                    value={formData.notes}
                    onChange={handleFormChange}
                    placeholder="e.g. Ring bell twice, leave with security concierge if unavailable."
                    className="w-full bg-ivory-50 border border-ivory-300 rounded px-3.5 py-2.5 text-xs text-charcoal-800 focus:outline-none focus:border-sage-600"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Payment Method */}
            <div className="bg-ivory-100/70 border border-ivory-200 rounded-xl p-6 sm:p-8 space-y-4 shadow-xs">
              <h3 className="font-serif text-xl font-semibold text-charcoal-900 border-b border-ivory-200 pb-3">
                3. Payment Method
              </h3>

              <div className="space-y-3">
                {/* Razorpay Option */}
                <label
                  className={`flex items-start p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'RAZORPAY'
                      ? 'border-sage-700 bg-sage-50/60 shadow-xs'
                      : 'border-ivory-300 bg-ivory-50 hover:border-charcoal-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="RAZORPAY"
                    checked={paymentMethod === 'RAZORPAY'}
                    onChange={() => setPaymentMethod('RAZORPAY')}
                    className="mt-1 text-sage-600 focus:ring-sage-500"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs sm:text-sm text-charcoal-900">
                        Razorpay Test Mode (Cards, UPI, NetBanking)
                      </span>
                      <CreditCard className="w-4 h-4 text-sage-700" />
                    </div>
                    <p className="text-xs text-charcoal-500 mt-0.5">
                      Secure, verified payments via UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, and NetBanking.
                    </p>
                    <span className="inline-block mt-2 text-[10px] bg-gold-100 text-gold-800 px-2 py-0.5 rounded font-semibold uppercase tracking-wider">
                      Interactive Test Mode Enabled
                    </span>
                  </div>
                </label>

                {/* Cash on Delivery Option */}
                <label
                  className={`flex items-start p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'COD'
                      ? 'border-sage-700 bg-sage-50/60 shadow-xs'
                      : 'border-ivory-300 bg-ivory-50 hover:border-charcoal-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    className="mt-1 text-sage-600 focus:ring-sage-500"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs sm:text-sm text-charcoal-900">
                        Cash on Delivery (COD)
                      </span>
                      <Banknote className="w-4 h-4 text-sage-700" />
                    </div>
                    <p className="text-xs text-charcoal-500 mt-0.5">
                      Pay comfortably upon receipt of your packaged grooming parcel.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Place Order (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-ivory-100/90 border border-ivory-300 rounded-xl p-6 sm:p-8 space-y-6 sticky top-28 shadow-sm">
              <h3 className="font-serif text-xl font-semibold text-charcoal-900 border-b border-ivory-200 pb-3">
                Order Summary ({cartItems.reduce((acc, it) => acc + it.quantity, 0)})
              </h3>

              {/* Items List */}
              <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex space-x-3 text-xs">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=150&q=80'}
                      alt={item.name}
                      className="w-14 h-14 object-cover rounded bg-ivory-200 border border-ivory-300 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-charcoal-800 truncate">{item.name}</p>
                      {item.variantName && (
                        <p className="text-[11px] text-charcoal-500">{item.variantName}</p>
                      )}
                      <p className="text-[11px] text-charcoal-500">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-semibold text-charcoal-900">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Promo Code Input */}
              <div className="border-t border-ivory-200 pt-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Coupon Code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="flex-1 bg-ivory-50 border border-ivory-300 rounded px-3 py-2 text-xs uppercase tracking-wider focus:outline-none focus:border-sage-600"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={couponLoading || !couponCode}
                    className="bg-charcoal-800 hover:bg-charcoal-900 text-ivory-50 text-xs px-4 py-2 rounded font-semibold disabled:opacity-50"
                  >
                    {couponLoading ? '...' : 'Apply'}
                  </button>
                </div>
                {couponError && <p className="text-[11px] text-red-500 mt-1">{couponError}</p>}
                {appliedCoupon && (
                  <p className="text-[11px] text-sage-700 font-semibold mt-1 flex items-center">
                    <Check className="w-3 h-3 mr-1" />
                    Code {appliedCoupon.code} applied (-₹{appliedCoupon.discountAmount})
                  </p>
                )}
              </div>

              {/* Breakdown */}
              <div className="space-y-2 text-xs text-charcoal-600 border-t border-ivory-200 pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-charcoal-800">
                    ₹{cartSubtotal.toLocaleString('en-IN')}
                  </span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-sage-700 font-semibold">
                    <span>Promotional Discount</span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Express Insured Shipping</span>
                  <span>{shippingFee === 0 ? 'Complimentary' : `₹${shippingFee}`}</span>
                </div>
                <div className="flex justify-between text-base font-semibold text-charcoal-900 pt-3 border-t border-ivory-300">
                  <span>Total Amount</span>
                  <span>₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-charcoal-800 hover:bg-charcoal-900 text-ivory-50 text-xs uppercase tracking-widest font-semibold py-4 rounded-lg flex items-center justify-center space-x-2 transition-all shadow-md disabled:opacity-50"
              >
                <span>
                  {isSubmitting
                    ? 'Securing Order...'
                    : paymentMethod === 'RAZORPAY'
                    ? `Proceed to Razorpay • ₹${finalTotal.toLocaleString('en-IN')}`
                    : `Confirm Cash on Delivery • ₹${finalTotal.toLocaleString('en-IN')}`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <p className="text-[10px] text-charcoal-400">
                  By completing your order, you agree to our Terms of Care and 14-Day Return Policy.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Razorpay Interactive Test Mode Modal */}
      {razorpayModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-charcoal-900/70 backdrop-blur-xs" />
          <div className="relative bg-ivory-50 border border-ivory-300 w-full max-w-md rounded-2xl shadow-2xl p-6 z-10 animate-fadeIn">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-ivory-200 pb-3 mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs">
                  R
                </div>
                <div>
                  <h4 className="text-xs font-bold text-charcoal-900">Razorpay Gateway Test Mode</h4>
                  <p className="text-[10px] text-charcoal-500">PetBloom Apothecary Merchant</p>
                </div>
              </div>
              <span className="text-xs font-bold text-charcoal-900">
                ₹{razorpayModal.orderData?.totalAmount.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg text-blue-900 text-[11px]">
                <p className="font-semibold">Razorpay Indian Payment Simulator</p>
                <p className="mt-0.5">Order ID: {razorpayModal.rzpOrder?.razorpayOrderId}</p>
                <p>This tests the full backend HMAC-SHA256 signature verification.</p>
              </div>

              {/* Payment Method Selector inside Razorpay */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRazorpayModal({ ...razorpayModal, selectedTestPayment: 'card' })}
                  className={`p-2.5 rounded border text-center transition-all ${
                    razorpayModal.selectedTestPayment === 'card'
                      ? 'border-blue-600 bg-blue-50/50 font-semibold'
                      : 'border-ivory-300'
                  }`}
                >
                  Cards (Visa / Master)
                </button>
                <button
                  type="button"
                  onClick={() => setRazorpayModal({ ...razorpayModal, selectedTestPayment: 'upi' })}
                  className={`p-2.5 rounded border text-center transition-all ${
                    razorpayModal.selectedTestPayment === 'upi'
                      ? 'border-blue-600 bg-blue-50/50 font-semibold'
                      : 'border-ivory-300'
                  }`}
                >
                  UPI (GPay / PhonePe)
                </button>
              </div>

              {razorpayModal.selectedTestPayment === 'card' ? (
                <div className="bg-ivory-100 p-3 rounded-lg border border-ivory-200 space-y-2">
                  <p className="text-[11px] font-semibold text-charcoal-800">Test Card Details</p>
                  <p className="font-mono text-xs text-charcoal-700">4111 •••• •••• 1111</p>
                  <div className="flex justify-between text-[11px] text-charcoal-500">
                    <span>Expiry: 12/28</span>
                    <span>CVV: 789</span>
                  </div>
                </div>
              ) : (
                <div className="bg-ivory-100 p-3 rounded-lg border border-ivory-200 space-y-2">
                  <p className="text-[11px] font-semibold text-charcoal-800">Test UPI ID</p>
                  <p className="font-mono text-xs text-charcoal-700">elena@okhdfcbank</p>
                  <p className="text-[10px] text-charcoal-500">Auto-approved simulated UPI request</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleCompleteRazorpayTest(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg uppercase tracking-wider text-xs transition-colors flex items-center justify-center space-x-1"
                >
                  <span>Simulate Successful Payment</span>
                  <Check className="w-4 h-4 ml-1" />
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleCompleteRazorpayTest(false)}
                  className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 py-2 rounded-lg text-xs transition-colors font-medium"
                >
                  Simulate Bank Payment Failure
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
