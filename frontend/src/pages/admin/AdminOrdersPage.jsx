import React, { useState, useEffect } from 'react';
import { Eye, Search, Filter, Truck, Check, X, ExternalLink } from 'lucide-react';
import { adminService } from '../../services/api';

export const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Status edit state
  const [newStatus, setNewStatus] = useState('');
  const [newTracking, setNewTracking] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await adminService.getOrders({
        status: statusFilter || undefined,
        search: searchTerm || undefined,
      });
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.warn('Orders fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleOpenDetails = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setNewTracking(order.trackingNumber || '');
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;
    setUpdating(true);
    try {
      const res = await adminService.updateOrderStatus(selectedOrder.id, {
        status: newStatus,
        trackingNumber: newTracking,
      });
      if (res.data.success) {
        setSelectedOrder(res.data.order);
        setOrders((prev) =>
          prev.map((o) => (o.id === selectedOrder.id ? res.data.order : o))
        );
        alert('Order status updated successfully.');
      }
    } catch (err) {
      alert(err.message || 'Failed to update order.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ivory-200 pb-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-sage-600 font-semibold block mb-1">
            Fulfillment Logistics
          </span>
          <h1 className="font-serif text-3xl font-semibold text-charcoal-900 tracking-tight">
            Client Orders ({orders.length})
          </h1>
        </div>

        <form onSubmit={handleSearchSubmit} className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-charcoal-400" />
            <input
              type="text"
              placeholder="Search by order #, client, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-ivory-50 border border-ivory-300 rounded pl-8 pr-3 py-2 text-xs focus:outline-none focus:border-sage-600 w-52 sm:w-64"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-ivory-50 border border-ivory-300 text-xs px-3 py-2 rounded focus:outline-none focus:border-sage-600"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">PENDING</option>
            <option value="PROCESSING">PROCESSING</option>
            <option value="SHIPPED">SHIPPED</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </form>
      </div>

      {/* Orders Table */}
      <div className="bg-ivory-50 border border-ivory-300 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-ivory-100 text-charcoal-600 uppercase tracking-wider font-semibold text-[10px] border-b border-ivory-200">
              <tr>
                <th className="py-3 px-4">Order Ref</th>
                <th className="py-3 px-4">Customer Details</th>
                <th className="py-3 px-4">Items Count</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-200">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-ivory-100/50">
                  <td className="py-3 px-4 font-mono font-semibold text-charcoal-800">
                    {ord.orderNumber}
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-charcoal-900">{ord.customerName}</p>
                    <p className="text-[10px] text-charcoal-500">{ord.customerEmail}</p>
                    <p className="text-[10px] text-charcoal-400">{ord.customerPhone}</p>
                  </td>
                  <td className="py-3 px-4 text-charcoal-700">
                    {ord.items?.length || 0} items
                  </td>
                  <td className="py-3 px-4 font-semibold text-charcoal-900">
                    ₹{ord.totalAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-[10px] uppercase block">{ord.paymentMethod}</span>
                    <span
                      className={`text-[10px] font-semibold ${
                        ord.paymentStatus === 'PAID' ? 'text-sage-700' : 'text-gold-700'
                      }`}
                    >
                      {ord.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        ord.status === 'DELIVERED'
                          ? 'bg-sage-100 text-sage-800'
                          : ord.status === 'CANCELLED'
                          ? 'bg-red-100 text-red-800'
                          : ord.status === 'SHIPPED'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gold-100 text-gold-900'
                      }`}
                    >
                      {ord.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-charcoal-500">
                    {new Date(ord.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleOpenDetails(ord)}
                      className="p-1 text-sage-700 hover:text-sage-900 font-semibold"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details & Status Drawer Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-charcoal-900/60" onClick={() => setSelectedOrder(null)} />
          <div className="relative bg-ivory-50 border border-ivory-300 w-full max-w-2xl rounded-2xl shadow-2xl p-6 sm:p-8 z-10 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex justify-between items-start border-b border-ivory-200 pb-4">
              <div>
                <span className="font-mono text-sm font-bold text-charcoal-900">
                  {selectedOrder.orderNumber}
                </span>
                <p className="text-xs text-charcoal-500">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                </p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-1 text-charcoal-400 hover:text-charcoal-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status & Tracking Assignment Form */}
            <div className="bg-ivory-100 p-4 rounded-xl border border-ivory-300 space-y-3">
              <h4 className="font-semibold text-xs text-charcoal-900 uppercase tracking-wider">
                Update Fulfillment Status
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block mb-1 font-medium text-charcoal-700">Order Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full bg-ivory-50 border border-ivory-300 rounded px-3 py-2 text-xs"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="PROCESSING">PROCESSING</option>
                    <option value="SHIPPED">SHIPPED</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 font-medium text-charcoal-700">Tracking Reference #</label>
                  <input
                    type="text"
                    value={newTracking}
                    onChange={(e) => setNewTracking(e.target.value)}
                    placeholder="e.g. BLUEDART-99201"
                    className="w-full bg-ivory-50 border border-ivory-300 rounded px-3 py-2 text-xs font-mono"
                  />
                </div>
              </div>
              <button
                onClick={handleUpdateStatus}
                disabled={updating}
                className="bg-charcoal-800 text-ivory-50 text-xs px-4 py-2 rounded font-semibold uppercase tracking-wider disabled:opacity-50"
              >
                {updating ? 'Updating...' : 'Save Order Changes'}
              </button>
            </div>

            {/* Customer & Address Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-charcoal-700">
              <div className="bg-ivory-100/70 p-3.5 rounded-lg border border-ivory-200">
                <p className="font-bold text-charcoal-900 mb-1">Customer</p>
                <p>{selectedOrder.customerName}</p>
                <p>{selectedOrder.customerEmail}</p>
                <p>{selectedOrder.customerPhone}</p>
              </div>

              <div className="bg-ivory-100/70 p-3.5 rounded-lg border border-ivory-200">
                <p className="font-bold text-charcoal-900 mb-1">Delivery Address</p>
                {(() => {
                  try {
                    const addr = typeof selectedOrder.shippingAddressSnapshot === 'string'
                      ? JSON.parse(selectedOrder.shippingAddressSnapshot)
                      : selectedOrder.shippingAddressSnapshot;
                    return (
                      <>
                        <p>{addr.streetAddress}</p>
                        {addr.apartment && <p>{addr.apartment}</p>}
                        <p>{addr.city}, {addr.state} - {addr.postalCode}</p>
                      </>
                    );
                  } catch {
                    return <p>{selectedOrder.shippingAddressSnapshot}</p>;
                  }
                })()}
              </div>
            </div>

            {/* Items List */}
            <div>
              <h4 className="font-semibold text-xs uppercase tracking-wider text-charcoal-800 mb-2">
                Order Items
              </h4>
              <div className="divide-y divide-ivory-200 border border-ivory-200 rounded-lg overflow-hidden bg-ivory-50">
                {selectedOrder.items?.map((it) => (
                  <div key={it.id} className="p-3 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-semibold text-charcoal-800">{it.productName}</p>
                      <p className="text-[11px] text-charcoal-500">Qty: {it.quantity} • {it.variantInfo || 'Standard'}</p>
                    </div>
                    <span className="font-semibold text-charcoal-900">₹{it.total.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
