import React, { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, Check } from 'lucide-react';
import { adminService } from '../../services/api';

export const AdminCouponsPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'PERCENTAGE',
    discountValue: 10,
    minOrderValue: 999,
    maxDiscount: 500,
  });

  const loadCoupons = async () => {
    try {
      const res = await adminService.getCoupons();
      if (res.data.success) setCoupons(res.data.coupons);
    } catch (e) {
      console.warn('Failed to load coupons:', e);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await adminService.createCoupon(formData);
      setIsModalOpen(false);
      setFormData({
        code: '',
        discountType: 'PERCENTAGE',
        discountValue: 10,
        minOrderValue: 999,
        maxDiscount: 500,
      });
      loadCoupons();
    } catch (err) {
      alert(err.message || 'Failed to create coupon.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete coupon?')) return;
    try {
      await adminService.deleteCoupon(id);
      setCoupons((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete coupon.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ivory-200 pb-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-sage-600 font-semibold block mb-1">
            Promotional Engine
          </span>
          <h1 className="font-serif text-3xl font-semibold text-charcoal-900 tracking-tight">
            Promotional Coupons
          </h1>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-charcoal-800 hover:bg-charcoal-900 text-ivory-50 text-xs font-semibold px-4 py-2 rounded flex items-center space-x-1.5 shadow-sm uppercase tracking-wider"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create Coupon</span>
        </button>
      </div>

      <div className="bg-ivory-50 border border-ivory-300 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-ivory-100 text-charcoal-600 uppercase tracking-wider font-semibold text-[10px] border-b border-ivory-200">
              <tr>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Discount</th>
                <th className="py-3 px-4">Min. Bag Value</th>
                <th className="py-3 px-4">Max. Savings</th>
                <th className="py-3 px-4">Usage</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-200">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-ivory-100/50">
                  <td className="py-3 px-4 font-mono font-bold text-charcoal-900">{c.code}</td>
                  <td className="py-3 px-4 text-sage-700 font-semibold">
                    {c.discountType === 'PERCENTAGE' ? `${c.discountValue}% Off` : `₹${c.discountValue} Flat`}
                  </td>
                  <td className="py-3 px-4 text-charcoal-600">₹{c.minOrderValue}</td>
                  <td className="py-3 px-4 text-charcoal-600">{c.maxDiscount ? `₹${c.maxDiscount}` : 'No Cap'}</td>
                  <td className="py-3 px-4 text-charcoal-500">{c.usedCount} used</td>
                  <td className="py-3 px-4 text-right">
                    <button onClick={() => handleDelete(c.id)} className="text-red-500 hover:text-red-700 p-1">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-charcoal-900/60" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-ivory-50 border border-ivory-300 w-full max-w-md rounded-xl p-6 z-10 space-y-4">
            <h3 className="font-serif text-xl font-semibold text-charcoal-900">Create Promo Coupon</h3>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. VIP20"
                  className="w-full bg-ivory-100 border border-ivory-300 rounded px-3 py-2 uppercase font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Type</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    className="w-full bg-ivory-100 border border-ivory-300 rounded px-3 py-2"
                  >
                    <option value="PERCENTAGE">PERCENTAGE (%)</option>
                    <option value="FIXED">FIXED AMOUNT (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Value *</label>
                  <input
                    type="number"
                    required
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    className="w-full bg-ivory-100 border border-ivory-300 rounded px-3 py-2"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Min. Bag Value</label>
                  <input
                    type="number"
                    value={formData.minOrderValue}
                    onChange={(e) => setFormData({ ...formData, minOrderValue: e.target.value })}
                    className="w-full bg-ivory-100 border border-ivory-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Max Cap (₹)</label>
                  <input
                    type="number"
                    value={formData.maxDiscount}
                    onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                    className="w-full bg-ivory-100 border border-ivory-300 rounded px-3 py-2"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-3 border-t border-ivory-200">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-charcoal-800 text-ivory-50 rounded font-semibold uppercase">
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
