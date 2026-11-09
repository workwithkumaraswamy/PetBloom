import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Tag,
  Mail,
  ArrowLeft,
  LogOut,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLayout = () => {
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-ivory-50 flex items-center justify-center p-4">
        <div className="bg-ivory-100 border border-ivory-300 rounded-xl p-8 max-w-md text-center space-y-4 shadow-sm">
          <ShieldAlert className="w-12 h-12 text-red-600 mx-auto" />
          <h2 className="font-serif text-2xl font-semibold text-charcoal-900">
            Administrator Access Required
          </h2>
          <p className="text-xs text-charcoal-600 font-light leading-relaxed">
            This management console is restricted to authenticated PetBloom executives. Please sign in with administrator credentials.
          </p>
          <div className="pt-2">
            <Link
              to="/login"
              className="inline-block bg-charcoal-800 text-ivory-50 text-xs uppercase tracking-wider font-semibold px-6 py-2.5 rounded"
            >
              Go to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { name: 'Dashboard Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'Product Catalog', path: '/admin/products', icon: Package },
    { name: 'Order Management', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Customer Directory', path: '/admin/customers', icon: Users },
    { name: 'Promotional Coupons', path: '/admin/coupons', icon: Tag },
    { name: 'Contact Inquiries', path: '/admin/messages', icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-ivory-100/60 flex flex-col md:flex-row text-charcoal-800 font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-charcoal-900 text-ivory-200 border-r border-charcoal-800 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo & Brand Header */}
          <div className="p-6 border-b border-charcoal-800">
            <Link to="/" className="block">
              <span className="font-serif text-xl tracking-[0.2em] font-semibold text-ivory-50 uppercase block">
                PetBloom
              </span>
              <span className="text-[9px] uppercase tracking-[0.3em] text-gold-400 font-medium">
                Executive Portal
              </span>
            </Link>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-sage-700 text-ivory-50 font-semibold shadow-xs'
                      : 'text-charcoal-300 hover:bg-charcoal-800 hover:text-ivory-50'
                  }`}
                >
                  <Icon className="w-4 h-4 text-gold-400" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Footer & Return Link */}
        <div className="p-4 border-t border-charcoal-800 space-y-2">
          <Link
            to="/"
            className="flex items-center space-x-2 text-xs text-charcoal-400 hover:text-ivory-50 px-3 py-2 rounded transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Storefront</span>
          </Link>

          <div className="flex items-center justify-between px-3 py-2 bg-charcoal-800/60 rounded-lg text-xs">
            <div className="truncate mr-2">
              <p className="font-semibold text-ivory-50 truncate">{user.firstName} {user.lastName || ''}</p>
              <p className="text-[10px] text-charcoal-400">Admin Session</p>
            </div>
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="text-red-400 hover:text-red-300 p-1"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6 sm:p-10">
        <Outlet />
      </main>
    </div>
  );
};
