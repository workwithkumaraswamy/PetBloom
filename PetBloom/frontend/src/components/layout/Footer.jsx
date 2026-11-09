import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Heart, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { contactService } from '../../services/api';

export const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState({ loading: false, message: '', success: false });

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;

    setNewsletterStatus({ loading: true, message: '', success: false });
    try {
      const res = await contactService.subscribeNewsletter({ email: newsletterEmail });
      setNewsletterStatus({
        loading: false,
        message: res.data.message || 'Thank you for joining our grooming journal.',
        success: true,
      });
      setNewsletterEmail('');
    } catch (err) {
      setNewsletterStatus({
        loading: false,
        message: err.message || 'Subscription failed. Please check your email.',
        success: false,
      });
    }
  };

  return (
    <footer className="bg-charcoal-900 text-ivory-200 border-t border-charcoal-700 font-sans">
      {/* Upper Newsletter & Philosophy Bar */}
      <div className="border-b border-charcoal-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6">
            <span className="text-[10px] uppercase tracking-[0.25em] text-gold-400 font-semibold block mb-2">
              The PetBloom Journal
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-ivory-50 tracking-tight">
              A Little More Love in Every Grooming Routine.
            </h3>
            <p className="text-sm text-charcoal-300 mt-2 max-w-lg leading-relaxed">
              Subscribe to receive veterinary-curated seasonal care protocols, first access to micro-batch formulations, and 10% off your initial curation.
            </p>
          </div>

          <div className="lg:col-span-6">
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="bg-charcoal-800/80 border border-charcoal-700 text-ivory-100 text-sm px-4 py-3 rounded focus:outline-none focus:border-gold-400 flex-1 placeholder-charcoal-500"
                />
                <button
                  type="submit"
                  disabled={newsletterStatus.loading}
                  className="bg-gold-500 hover:bg-gold-600 text-charcoal-950 font-semibold px-6 py-3 rounded text-xs uppercase tracking-widest transition-colors flex items-center justify-center shrink-0"
                >
                  {newsletterStatus.loading ? 'Subscribing...' : 'Subscribe'}
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </button>
              </div>

              {newsletterStatus.message && (
                <p
                  className={`text-xs mt-2 flex items-center ${
                    newsletterStatus.success ? 'text-sage-300' : 'text-red-400'
                  }`}
                >
                  {newsletterStatus.success && <CheckCircle2 className="w-3.5 h-3.5 mr-1" />}
                  {newsletterStatus.message}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Navigation Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Philosophy */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <span className="font-serif text-2xl tracking-[0.2em] font-semibold text-ivory-50 uppercase">
                PetBloom
              </span>
              <span className="block text-[8px] uppercase tracking-[0.35em] text-gold-400 font-medium">
                The Art of Premium Pet Care
              </span>
            </Link>
            <p className="text-xs text-charcoal-300 leading-relaxed max-w-sm">
              We design thoughtful, veterinary-aligned grooming tools and botanical emergency essentials. Every claw trimmed gently, every paw protected, and every canine comforted in their own home.
            </p>
            <div className="pt-2 flex items-center space-x-3 text-xs text-charcoal-400">
              <ShieldCheck className="w-4 h-4 text-gold-400" />
              <span>Veterinary Formulated • 100% Leaping Bunny Compliant</span>
            </div>
          </div>

          {/* Curations / Shop */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-gold-300 mb-4">
              Curations
            </h4>
            <ul className="space-y-2.5 text-xs text-charcoal-300">
              <li>
                <Link to="/shop?category=nail-care" className="hover:text-ivory-100 transition-colors">
                  Safety Nail Clippers
                </Link>
              </li>
              <li>
                <Link to="/shop?category=nail-care" className="hover:text-ivory-100 transition-colors">
                  Styptic Hemostatic Powder
                </Link>
              </li>
              <li>
                <Link to="/shop?category=paw-protection" className="hover:text-ivory-100 transition-colors">
                  Organic Beeswax Paw Balm
                </Link>
              </li>
              <li>
                <Link to="/shop?category=tear-stain-care" className="hover:text-ivory-100 transition-colors">
                  Botanical Tear-Stain Wipes
                </Link>
              </li>
              <li>
                <Link to="/shop?category=coat-care" className="hover:text-ivory-100 transition-colors">
                  Silk Detangling Coat Mist
                </Link>
              </li>
              <li>
                <Link to="/emergency-kits" className="hover:text-gold-300 font-medium transition-colors">
                  Emergency Grooming Kits
                </Link>
              </li>
            </ul>
          </div>

          {/* Guides & Rituals */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-gold-300 mb-4">
              Guides &amp; Rituals
            </h4>
            <ul className="space-y-2.5 text-xs text-charcoal-300">
              <li>
                <Link to="/grooming-guide" className="hover:text-ivory-100 transition-colors">
                  Pet Grooming Rituals
                </Link>
              </li>
              <li>
                <Link to="/emergency-guide" className="hover:text-gold-300 font-medium transition-colors">
                  Emergency Triage Guide
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-ivory-100 transition-colors">
                  Our Founding Story
                </Link>
              </li>
              <li>
                <Link to="/journal" className="hover:text-ivory-100 transition-colors">
                  The Editorial Journal
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-ivory-100 transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </div>

          {/* Client Concierge & Legal */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-gold-300 mb-4">
              Client Concierge
            </h4>
            <ul className="space-y-2.5 text-xs text-charcoal-300">
              <li className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                <a href="mailto:concierge@petbloom.com" className="hover:text-ivory-100">
                  concierge@petbloom.com
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                <span>+91 (800) 729-7488</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="w-3.5 h-3.5 text-gold-400 shrink-0 mt-0.5" />
                <span>New Delhi • Mumbai, India</span>
              </li>
              <li className="pt-2">
                <Link to="/shipping-policy" className="hover:text-ivory-100 block">
                  Shipping &amp; Delivery
                </Link>
              </li>
              <li>
                <Link to="/returns-policy" className="hover:text-ivory-100 block">
                  Returns &amp; Exchanges
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-ivory-100 block">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-ivory-100 block">
                  Terms &amp; Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright, Creator Credit & Verified Payments */}
        <div className="border-t border-charcoal-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-charcoal-400 gap-4">
          <div className="text-center md:text-left space-y-1">
            <p>© {new Date().getFullYear()} PetBloom. All rights reserved. Registered Trademark.</p>
            <p className="text-[11px] text-charcoal-300">
              Created by{' '}
              <a
                href="mailto:workwithkumaraswamy@gmail.com"
                className="text-gold-400 hover:text-gold-300 font-medium underline underline-offset-4 transition-colors"
              >
                workwithkumaraswamy@gmail.com
              </a>
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 text-[11px] text-charcoal-400">
            <span>256-Bit SSL Encryption</span>
            <span>•</span>
            <span>Razorpay Secured</span>
            <span>•</span>
            <span>Cash on Delivery</span>
            <span>•</span>
            <span>Pan-India Air Express</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
