import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  Clock,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import { adminService } from '../../services/api';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService
      .getStats()
      .then((res) => {
        if (res.data.success) {
          setStats(res.data.stats);
        }
      })
      .catch((err) => console.error('Failed to load admin stats:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center text-xs text-charcoal-500">
        Aggregating executive metrics...
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: `₹${stats?.totalRevenue?.toLocaleString('en-IN') || 0}`,
      icon: DollarSign,
      color: 'text-gold-600 bg-gold-50 border-gold-200',
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: ShoppingBag,
      color: 'text-sage-700 bg-sage-50 border-sage-200',
    },
    {
      title: 'Registered Clients',
      value: stats?.totalCustomers || 0,
      icon: Users,
      color: 'text-blue-700 bg-blue-50 border-blue-200',
    },
    {
      title: 'Active Formulations',
      value: stats?.totalProducts || 0,
      icon: Package,
      color: 'text-charcoal-700 bg-ivory-200 border-ivory-300',
    },
    {
      title: 'Pending Orders',
      value: stats?.pendingOrders || 0,
      icon: Clock,
      color: 'text-amber-700 bg-amber-50 border-amber-200',
    },
    {
      title: 'Completed Parcels',
      value: stats?.completedOrders || 0,
      icon: CheckCircle2,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    },
    {
      title: 'Low Stock Alerts',
      value: stats?.lowStockCount || 0,
      icon: AlertTriangle,
      color: 'text-red-700 bg-red-50 border-red-200',
    },
  ];

  const maxRevenue = Math.max(...(stats?.monthlySales?.map((s) => s.revenue) || [1000]));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <span className="text-[10px] uppercase tracking-[0.25em] text-sage-600 font-semibold block mb-1">
          Operations Overview
        </span>
        <h1 className="font-serif text-3xl font-semibold text-charcoal-900 tracking-tight">
          Executive Dashboard
        </h1>
        <p className="text-xs text-charcoal-500 mt-0.5">
          Real-time performance, inventory levels, and order fulfillment status.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`p-5 rounded-xl border bg-ivory-50 shadow-xs flex items-center justify-between ${card.color}`}
            >
              <div>
                <p className="text-[10px] uppercase tracking-wider font-semibold text-charcoal-500">
                  {card.title}
                </p>
                <p className="font-serif text-2xl font-bold text-charcoal-900 mt-1">
                  {card.value}
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-white/80 shadow-xs">
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Monthly Sales Report Chart & Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Monthly Sales Chart (8 cols) */}
        <div className="lg:col-span-8 bg-ivory-50 border border-ivory-300 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-ivory-200 pb-3">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-sage-600" />
              <h3 className="font-serif text-lg font-semibold text-charcoal-900">
                Monthly Revenue Performance (INR)
              </h3>
            </div>
            <span className="text-[11px] text-charcoal-500 font-medium">Last 6 Months</span>
          </div>

          <div className="h-64 flex items-end justify-between gap-4 pt-6 pb-2 px-2">
            {stats?.monthlySales?.map((item, idx) => {
              const heightPercent = maxRevenue > 0 ? Math.max(12, Math.round((item.revenue / maxRevenue) * 100)) : 15;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                  <div className="text-[10px] font-semibold text-charcoal-700 opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                    ₹{item.revenue.toLocaleString('en-IN')}
                  </div>
                  <div
                    className="w-full bg-sage-600 group-hover:bg-sage-700 rounded-t-md transition-all duration-500 shadow-xs"
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="text-[11px] font-medium text-charcoal-600 mt-2 block">
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Low Stock Alerts (4 cols) */}
        <div className="lg:col-span-4 bg-ivory-50 border border-ivory-300 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-ivory-200 pb-3">
            <h3 className="font-serif text-lg font-semibold text-charcoal-900">
              Low Stock Warnings
            </h3>
            <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded font-bold">
              {stats?.lowStockProducts?.length || 0} Items
            </span>
          </div>

          <div className="space-y-3">
            {stats?.lowStockProducts && stats.lowStockProducts.length > 0 ? (
              stats.lowStockProducts.map((p) => (
                <div
                  key={p.id}
                  className="p-3 bg-ivory-100/70 border border-ivory-200 rounded-lg flex items-center justify-between text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <p className="font-semibold text-charcoal-800 truncate">{p.name}</p>
                    <p className="text-[10px] text-charcoal-400">SKU: {p.sku}</p>
                  </div>
                  <span className="px-2 py-1 bg-red-100 text-red-800 font-bold rounded text-[11px] shrink-0">
                    {p.stock} units left
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-charcoal-500 py-4 text-center">
                All inventory levels optimal.
              </p>
            )}
          </div>

          <div className="pt-2 text-center">
            <Link
              to="/admin/products"
              className="text-xs text-sage-700 font-semibold hover:underline inline-flex items-center"
            >
              <span>Manage Inventory in Product Catalog</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Orders Overview */}
      <div className="bg-ivory-50 border border-ivory-300 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-ivory-200 pb-3">
          <h3 className="font-serif text-lg font-semibold text-charcoal-900">
            Recent Client Orders
          </h3>
          <Link
            to="/admin/orders"
            className="text-xs text-sage-700 font-semibold hover:underline inline-flex items-center"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-ivory-100 text-charcoal-600 uppercase tracking-wider font-semibold text-[10px] border-b border-ivory-200">
              <tr>
                <th className="py-2.5 px-3">Order Ref</th>
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Payment</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-200">
              {stats?.recentOrders?.map((ord) => (
                <tr key={ord.id} className="hover:bg-ivory-100/50">
                  <td className="py-3 px-3 font-mono font-semibold text-charcoal-800">
                    {ord.orderNumber}
                  </td>
                  <td className="py-3 px-3">
                    <p className="font-semibold text-charcoal-900">{ord.customerName}</p>
                    <p className="text-[10px] text-charcoal-400">{ord.customerEmail}</p>
                  </td>
                  <td className="py-3 px-3 font-semibold text-charcoal-900">
                    ₹{ord.totalAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-semibold uppercase text-[10px]">{ord.paymentMethod}</span>
                    <span className="text-[10px] text-charcoal-500 block">({ord.paymentStatus})</span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        ord.status === 'DELIVERED'
                          ? 'bg-sage-100 text-sage-800'
                          : ord.status === 'CANCELLED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gold-100 text-gold-900'
                      }`}
                    >
                      {ord.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-charcoal-500">
                    {new Date(ord.createdAt).toLocaleDateString()}
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
