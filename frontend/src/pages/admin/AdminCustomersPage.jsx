import React, { useState, useEffect } from 'react';
import { Users, Mail, Phone, Calendar } from 'lucide-react';
import { adminService } from '../../services/api';

export const AdminCustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService
      .getCustomers()
      .then((res) => {
        if (res.data.success) {
          setCustomers(res.data.customers);
        }
      })
      .catch((e) => console.warn('Failed to fetch customers:', e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="border-b border-ivory-200 pb-4">
        <span className="text-[10px] uppercase tracking-[0.25em] text-sage-600 font-semibold block mb-1">
          Client Directory
        </span>
        <h1 className="font-serif text-3xl font-semibold text-charcoal-900 tracking-tight">
          Registered Clients ({customers.length})
        </h1>
      </div>

      <div className="bg-ivory-50 border border-ivory-300 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-ivory-100 text-charcoal-600 uppercase tracking-wider font-semibold text-[10px] border-b border-ivory-200">
              <tr>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Total Orders</th>
                <th className="py-3 px-4">Total Spend</th>
                <th className="py-3 px-4">Joined On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-200">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-ivory-100/50">
                  <td className="py-3 px-4 font-semibold text-charcoal-900">
                    {c.firstName} {c.lastName || ''}
                  </td>
                  <td className="py-3 px-4 text-charcoal-600">{c.email}</td>
                  <td className="py-3 px-4 text-charcoal-600">{c.phone || '—'}</td>
                  <td className="py-3 px-4 font-semibold text-charcoal-800">
                    {c.totalOrders} orders
                  </td>
                  <td className="py-3 px-4 font-bold text-charcoal-900">
                    ₹{c.totalSpend?.toLocaleString('en-IN') || 0}
                  </td>
                  <td className="py-3 px-4 text-charcoal-500">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
