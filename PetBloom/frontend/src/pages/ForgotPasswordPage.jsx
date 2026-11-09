import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, CheckCircle2, ArrowLeft } from 'lucide-react';
import { authService } from '../services/api';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.forgotPassword({ email });
      setSubmitted(true);
    } catch (e) {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory-50 flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full bg-ivory-100/90 border border-ivory-300 rounded-2xl p-8 sm:p-10 shadow-sm space-y-6">
        <div className="text-center space-y-1">
          <Link to="/" className="inline-block font-serif text-2xl tracking-[0.2em] font-semibold text-charcoal-900 uppercase">
            PetBloom
          </Link>
          <h2 className="text-xs text-charcoal-500 uppercase tracking-widest font-semibold">
            Password Recovery
          </h2>
        </div>

        {submitted ? (
          <div className="text-center space-y-4 py-4">
            <CheckCircle2 className="w-12 h-12 text-sage-600 mx-auto" />
            <h3 className="font-serif text-xl font-semibold text-charcoal-900">
              Recovery Link Dispatched
            </h3>
            <p className="text-xs text-charcoal-600 leading-relaxed font-light">
              If an account is associated with <span className="font-semibold text-charcoal-800">{email}</span>, a secure password reset link has been dispatched.
            </p>
            <div className="pt-2">
              <Link
                to="/login"
                className="inline-block bg-charcoal-800 text-ivory-50 text-xs uppercase tracking-wider font-semibold px-6 py-2.5 rounded"
              >
                Return to Sign In
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-xs text-charcoal-600 leading-relaxed font-light">
              Enter your registered client email address and we will dispatch a secure link to reset your credentials.
            </p>

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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-charcoal-800 hover:bg-charcoal-900 text-ivory-50 text-xs uppercase tracking-widest font-semibold py-3.5 rounded transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{loading ? 'Dispatching...' : 'Send Recovery Link'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center pt-2">
              <Link to="/login" className="text-xs text-charcoal-500 hover:text-charcoal-800 inline-flex items-center">
                <ArrowLeft className="w-3 h-3 mr-1" /> Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
