import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(email, password);
      if (data?.user?.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoCustomer = () => {
    setEmail('elena.vance@example.com');
    setPassword('Password@123');
  };

  const handleQuickDemoAdmin = () => {
    setEmail('admin@pawandritual.com');
    setPassword('Admin@PawRitual2024');
  };

  return (
    <div className="min-h-screen bg-ivory-50 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-ivory-100/90 border border-ivory-300 rounded-2xl p-8 sm:p-10 shadow-sm space-y-6">
        {/* Header */}
        <div className="text-center space-y-1">
          <Link to="/" className="inline-block font-serif text-2xl tracking-[0.2em] font-semibold text-charcoal-900 uppercase">
            PetBloom
          </Link>
          <p className="text-xs text-charcoal-500 uppercase tracking-widest font-medium">
            Client Sign In
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-charcoal-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@petbloom.com"
                className="w-full bg-ivory-50 border border-ivory-300 rounded pl-9 pr-3 py-2.5 text-xs text-charcoal-800 focus:outline-none focus:border-sage-600"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal-700">
                Password
              </label>
              <Link to="/forgot-password" className="text-[11px] text-sage-700 hover:underline">
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-charcoal-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-ivory-50 border border-ivory-300 rounded pl-9 pr-3 py-2.5 text-xs text-charcoal-800 focus:outline-none focus:border-sage-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-charcoal-800 hover:bg-charcoal-900 text-ivory-50 text-xs uppercase tracking-widest font-semibold py-3.5 rounded transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Credentials Quick Fill Buttons */}
        <div className="border-t border-ivory-200 pt-4">
          <p className="text-[10px] uppercase tracking-wider text-charcoal-400 font-semibold mb-2 text-center">
            Internship Demonstration Credentials
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleQuickDemoCustomer}
              className="p-2 border border-ivory-300 bg-ivory-50 hover:bg-ivory-200 text-charcoal-700 rounded text-[11px] text-center transition-colors font-medium"
            >
              Fill Customer Demo
            </button>
            <button
              type="button"
              onClick={handleQuickDemoAdmin}
              className="p-2 border border-gold-300 bg-gold-50 hover:bg-gold-100 text-gold-900 rounded text-[11px] text-center transition-colors font-semibold"
            >
              Fill Admin Portal Demo
            </button>
          </div>
        </div>

        {/* Register Footer */}
        <div className="text-center pt-2 text-xs text-charcoal-500">
          <span>New to PetBloom? </span>
          <Link to="/register" className="text-sage-700 font-semibold hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};
