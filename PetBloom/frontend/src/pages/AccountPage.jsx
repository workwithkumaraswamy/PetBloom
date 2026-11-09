import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Package, MapPin, KeyRound, LogOut, Check, Plus, Trash2, ExternalLink, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService, orderService } from '../services/api';

export const AccountPage = () => {
  const { user, isAuthenticated, logout, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'profile', 'addresses', 'password'
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(false);

  // Profile Form
  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
  });
  const [profileMessage, setProfileMessage] = useState('');

  // Password Form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Address Form Modal
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addressForm, setAddressForm] = useState({
    fullName: '',
    phone: '',
    streetAddress: '',
    apartment: '',
    city: '',
    state: 'Delhi',
    postalCode: '',
    isDefault: false,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user) {
      setProfileForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
      });
    }

    // Fetch user orders
    setLoadingOrders(true);
    orderService.getMyOrders().then((res) => {
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    }).catch((e) => console.warn('Failed to load orders:', e)).finally(() => setLoadingOrders(false));

    // Fetch user addresses
    setLoadingAddresses(true);
    authService.getAddresses().then((res) => {
      if (res.data.success) {
        setAddresses(res.data.addresses);
      }
    }).catch((e) => console.warn('Failed to load addresses:', e)).finally(() => setLoadingAddresses(false));
  }, [isAuthenticated, user, navigate]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMessage('');
    try {
      const res = await authService.updateProfile(profileForm);
      if (res.data.success) {
        await refreshUser();
        setProfileMessage('Profile details updated successfully.');
      }
    } catch (err) {
      alert(err.message || 'Failed to update profile.');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMessage('');
    setPasswordError('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    try {
      const res = await authService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      if (res.data.success) {
        setPasswordMessage('Password changed successfully.');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      setPasswordError(err.message || 'Failed to change password.');
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await authService.addAddress(addressForm);
      if (res.data.success) {
        const addrRes = await authService.getAddresses();
        if (addrRes.data.success) setAddresses(addrRes.data.addresses);
        setIsAddressModalOpen(false);
        setAddressForm({
          fullName: '',
          phone: '',
          streetAddress: '',
          apartment: '',
          city: '',
          state: 'Delhi',
          postalCode: '',
          isDefault: false,
        });
      }
    } catch (err) {
      alert(err.message || 'Failed to save address.');
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm('Remove this saved address?')) return;
    try {
      await authService.deleteAddress(id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      alert(err.message || 'Failed to remove address.');
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      const res = await orderService.cancelOrder(orderId);
      if (res.data.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: 'CANCELLED' } : o))
        );
        alert('Order has been cancelled.');
      }
    } catch (err) {
      alert(err.message || 'Unable to cancel order.');
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-ivory-50 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Account Header */}
        <div className="mb-10 pb-6 border-b border-ivory-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-sage-600 font-semibold block mb-1">
              Client Portal
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-charcoal-900 tracking-tight">
              Welcome, {user.firstName}.
            </h1>
            <p className="text-xs text-charcoal-500 mt-0.5">{user.email}</p>
          </div>

          <div className="flex items-center space-x-3">
            {user.role === 'ADMIN' && (
              <Link
                to="/admin"
                className="bg-gold-500 hover:bg-gold-600 text-charcoal-950 px-4 py-2 rounded text-xs uppercase tracking-wider font-semibold"
              >
                Admin Dashboard
              </Link>
            )}
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="text-xs text-charcoal-600 hover:text-red-600 border border-ivory-300 bg-ivory-50 px-3 py-2 rounded flex items-center space-x-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation & Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Tab Navigation (3 cols) */}
          <div className="lg:col-span-3 bg-ivory-100/70 border border-ivory-200 rounded-xl p-3 space-y-1">
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center space-x-2.5 px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider text-left transition-all ${
                activeTab === 'orders'
                  ? 'bg-charcoal-800 text-ivory-50 shadow-xs'
                  : 'text-charcoal-700 hover:bg-ivory-200'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Order History</span>
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-full flex items-center space-x-2.5 px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider text-left transition-all ${
                activeTab === 'addresses'
                  ? 'bg-charcoal-800 text-ivory-50 shadow-xs'
                  : 'text-charcoal-700 hover:bg-ivory-200'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Saved Addresses</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center space-x-2.5 px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider text-left transition-all ${
                activeTab === 'profile'
                  ? 'bg-charcoal-800 text-ivory-50 shadow-xs'
                  : 'text-charcoal-700 hover:bg-ivory-200'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Personal Details</span>
            </button>

            <button
              onClick={() => setActiveTab('password')}
              className={`w-full flex items-center space-x-2.5 px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider text-left transition-all ${
                activeTab === 'password'
                  ? 'bg-charcoal-800 text-ivory-50 shadow-xs'
                  : 'text-charcoal-700 hover:bg-ivory-200'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>Security &amp; Password</span>
            </button>
          </div>

          {/* Right Main Content (9 cols) */}
          <div className="lg:col-span-9 bg-ivory-100/60 border border-ivory-200 rounded-xl p-6 sm:p-8">
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h3 className="font-serif text-2xl font-semibold text-charcoal-900 border-b border-ivory-200 pb-3">
                  Your Curation History ({orders.length})
                </h3>

                {loadingOrders ? (
                  <p className="text-xs text-charcoal-500 py-6">Loading orders...</p>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-10 h-10 text-charcoal-300 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-charcoal-800">No orders placed yet</p>
                    <p className="text-xs text-charcoal-500 mb-4">Explore our essential grooming kits and tools.</p>
                    <Link
                      to="/shop"
                      className="inline-block bg-charcoal-800 text-ivory-50 px-5 py-2 rounded text-xs uppercase tracking-wider font-semibold"
                    >
                      Shop Essentials
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-ivory-50 border border-ivory-200 rounded-xl p-5 space-y-4 shadow-xs"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ivory-200 pb-3 text-xs">
                          <div>
                            <span className="font-serif font-bold text-sm text-charcoal-900 mr-2">
                              {order.orderNumber}
                            </span>
                            <span className="text-charcoal-500">
                              Planted on {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <div className="flex items-center space-x-2">
                            <span
                              className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                order.status === 'DELIVERED'
                                  ? 'bg-sage-100 text-sage-800'
                                  : order.status === 'CANCELLED'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-gold-100 text-gold-900'
                              }`}
                            >
                              {order.status}
                            </span>
                            <Link
                              to={`/order-confirmation/${order.id}`}
                              className="text-sage-700 hover:text-sage-900 font-semibold inline-flex items-center"
                            >
                              Invoice <ExternalLink className="w-3 h-3 ml-0.5" />
                            </Link>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-2 text-xs">
                          {order.items?.map((it) => (
                            <div key={it.id} className="flex justify-between items-center py-1">
                              <div>
                                <span className="font-semibold text-charcoal-800">{it.productName}</span>
                                {it.variantInfo && (
                                  <span className="text-charcoal-500 ml-2">({it.variantInfo})</span>
                                )}
                                <span className="text-charcoal-400 ml-2">x {it.quantity}</span>
                              </div>
                              <span className="font-semibold text-charcoal-900">
                                ₹{it.total.toLocaleString('en-IN')}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Summary Footer */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-ivory-200 text-xs text-charcoal-600">
                          <div>
                            <span className="text-charcoal-500">Payment: </span>
                            <span className="font-semibold text-charcoal-800">{order.paymentMethod}</span>
                            <span className="ml-2 font-medium">({order.paymentStatus})</span>
                            {order.trackingNumber && (
                              <span className="ml-3 font-mono text-[11px] text-sage-700">
                                Tracking: {order.trackingNumber}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center space-x-4">
                            <span className="font-bold text-sm text-charcoal-900">
                              Total: ₹{order.totalAmount.toLocaleString('en-IN')}
                            </span>
                            {order.status === 'PENDING' && (
                              <button
                                onClick={() => handleCancelOrder(order.id)}
                                className="text-[11px] text-red-600 hover:underline"
                              >
                                Cancel Order
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Saved Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-ivory-200 pb-3">
                  <h3 className="font-serif text-2xl font-semibold text-charcoal-900">
                    Saved Shipping Addresses
                  </h3>
                  <button
                    onClick={() => setIsAddressModalOpen(true)}
                    className="bg-charcoal-800 text-ivory-50 text-xs px-3.5 py-1.5 rounded flex items-center space-x-1 font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Address</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="bg-ivory-50 border border-ivory-200 rounded-xl p-4 relative space-y-2 text-xs"
                    >
                      {addr.isDefault && (
                        <span className="inline-block bg-sage-100 text-sage-800 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                          Default Shipping Address
                        </span>
                      )}
                      <p className="font-semibold text-charcoal-900 text-sm">{addr.fullName}</p>
                      <p className="text-charcoal-700">{addr.streetAddress}</p>
                      {addr.apartment && <p className="text-charcoal-600">{addr.apartment}</p>}
                      <p className="text-charcoal-600">{addr.city}, {addr.state} - {addr.postalCode}</p>
                      <p className="text-charcoal-500 pt-1">Phone: {addr.phone}</p>

                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                          title="Delete Address"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h3 className="font-serif text-2xl font-semibold text-charcoal-900 border-b border-ivory-200 pb-3">
                  Personal Details
                </h3>

                {profileMessage && (
                  <div className="bg-sage-100 border border-sage-300 text-sage-900 p-3 rounded text-xs flex items-center space-x-2">
                    <Check className="w-4 h-4" />
                    <span>{profileMessage}</span>
                  </div>
                )}

                <form onSubmit={handleProfileSubmit} className="space-y-4 max-w-lg">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        required
                        value={profileForm.firstName}
                        onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                        className="w-full bg-ivory-50 border border-ivory-300 rounded px-3 py-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={profileForm.lastName}
                        onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                        className="w-full bg-ivory-50 border border-ivory-300 rounded px-3 py-2 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full bg-ivory-50 border border-ivory-300 rounded px-3 py-2 text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-charcoal-800 hover:bg-charcoal-900 text-ivory-50 text-xs uppercase tracking-wider font-semibold px-6 py-2.5 rounded"
                  >
                    Save Changes
                  </button>
                </form>
              </div>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
              <div className="space-y-6">
                <h3 className="font-serif text-2xl font-semibold text-charcoal-900 border-b border-ivory-200 pb-3">
                  Change Password
                </h3>

                {passwordMessage && (
                  <div className="bg-sage-100 border border-sage-300 text-sage-900 p-3 rounded text-xs flex items-center space-x-2">
                    <Check className="w-4 h-4" />
                    <span>{passwordMessage}</span>
                  </div>
                )}

                {passwordError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded text-xs flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{passwordError}</span>
                  </div>
                )}

                <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-lg">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      required
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      className="w-full bg-ivory-50 border border-ivory-300 rounded px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
                      New Password (Min. 6 Characters)
                    </label>
                    <input
                      type="password"
                      required
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      className="w-full bg-ivory-50 border border-ivory-300 rounded px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      required
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      className="w-full bg-ivory-50 border border-ivory-300 rounded px-3 py-2 text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-charcoal-800 hover:bg-charcoal-900 text-ivory-50 text-xs uppercase tracking-wider font-semibold px-6 py-2.5 rounded"
                  >
                    Update Password
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-charcoal-900/60" onClick={() => setIsAddressModalOpen(false)} />
          <div className="relative bg-ivory-50 border border-ivory-300 w-full max-w-md rounded-xl p-6 z-10 space-y-4">
            <h4 className="font-serif text-xl font-semibold text-charcoal-900">Add New Shipping Address</h4>
            <form onSubmit={handleAddAddress} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={addressForm.fullName}
                  onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                  className="w-full bg-ivory-100 border border-ivory-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Phone</label>
                <input
                  type="tel"
                  required
                  value={addressForm.phone}
                  onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                  className="w-full bg-ivory-100 border border-ivory-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={addressForm.streetAddress}
                  onChange={(e) => setAddressForm({ ...addressForm, streetAddress: e.target.value })}
                  className="w-full bg-ivory-100 border border-ivory-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Apartment / Unit</label>
                <input
                  type="text"
                  value={addressForm.apartment}
                  onChange={(e) => setAddressForm({ ...addressForm, apartment: e.target.value })}
                  className="w-full bg-ivory-100 border border-ivory-300 rounded px-3 py-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    className="w-full bg-ivory-100 border border-ivory-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">PIN Code</label>
                  <input
                    type="text"
                    required
                    value={addressForm.postalCode}
                    onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                    className="w-full bg-ivory-100 border border-ivory-300 rounded px-3 py-2"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="defaultAddressCheck"
                  checked={addressForm.isDefault}
                  onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                />
                <label htmlFor="defaultAddressCheck">Set as primary default address</label>
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-charcoal-800 text-ivory-50 rounded font-semibold"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
