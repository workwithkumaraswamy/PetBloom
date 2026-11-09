import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, User, Phone, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
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
            Create an Account
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
                First Name *
              </label>
              <input
                type="text"
                required
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Elena"
                className="w-full bg-ivory-50 border border-ivory-300 rounded px-3 py-2 text-xs text-charcoal-800 focus:outline-none focus:border-sage-600"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Vance"
                className="w-full bg-ivory-50 border border-ivory-300 rounded px-3 py-2 text-xs text-charcoal-800 focus:outline-none focus:border-sage-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="elena@example.com"
              className="w-full bg-ivory-50 border border-ivory-300 rounded px-3 py-2 text-xs text-charcoal-800 focus:outline-none focus:border-sage-600"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              className="w-full bg-ivory-50 border border-ivory-300 rounded px-3 py-2 text-xs text-charcoal-800 focus:outline-none focus:border-sage-600"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
              Password (Min. 6 Characters) *
            </label>
            <input
              type="password"
              required
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full bg-ivory-50 border border-ivory-300 rounded px-3 py-2 text-xs text-charcoal-800 focus:outline-none focus:border-sage-600"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-charcoal-800 hover:bg-charcoal-900 text-ivory-50 text-xs uppercase tracking-widest font-semibold py-3.5 rounded transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{loading ? 'Creating Account...' : 'Join The Ritual'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="text-center pt-2 text-xs text-charcoal-500">
          <span>Already registered? </span>
          <Link to="/login" className="text-sage-700 font-semibold hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
};
