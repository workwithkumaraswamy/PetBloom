import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { contactService } from '../services/api';

export const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Product & Formulation Inquiry',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const res = await contactService.submitContact(formData);
      if (res.data.success) {
        setSuccessMessage(res.data.message || 'Your inquiry has been delivered to our concierge.');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: 'Product & Formulation Inquiry',
          message: '',
        });
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[10px] uppercase tracking-[0.25em] text-sage-600 font-semibold block">
            Dedicated Client Support
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-charcoal-900 tracking-tight">
            Client Concierge Care
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-600 font-light leading-relaxed">
            Have questions regarding claw sizing, balm formulations, or emergency triage? Our advisors are here to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Direct Contacts & Hours (5 cols) */}
          <div className="lg:col-span-5 bg-ivory-100/70 border border-ivory-300 rounded-2xl p-6 sm:p-8 space-y-6">
            <h3 className="font-serif text-2xl font-semibold text-charcoal-900 border-b border-ivory-200 pb-3">
              Direct Channels
            </h3>

            <div className="space-y-4 text-xs text-charcoal-700">
              <div className="flex items-start space-x-3">
                <Mail className="w-4 h-4 text-sage-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-charcoal-900 block">Apothecary Concierge</span>
                  <a href="mailto:concierge@pawandritual.com" className="text-sage-700 hover:underline">
                    concierge@pawandritual.com
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Phone className="w-4 h-4 text-sage-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-charcoal-900 block">Telephone Inquiries</span>
                  <span>+91 (800) 729-7488</span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-sage-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-charcoal-900 block">Atelier Locations</span>
                  <span>Golf Links, New Delhi • Bandra West, Mumbai</span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="w-4 h-4 text-sage-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-charcoal-900 block">Concierge Hours</span>
                  <span>Monday – Saturday: 9:00 AM – 7:00 PM IST</span>
                  <p className="text-[11px] text-charcoal-500 mt-0.5">Inquiries answered within 24 hours.</p>
                </div>
              </div>
            </div>

            <div className="bg-sage-50 border border-sage-200 p-4 rounded-xl text-sage-900 text-xs space-y-1">
              <span className="font-bold uppercase tracking-wider block text-[10px]">
                Urgent Veterinary Emergencies
              </span>
              <p className="font-light">
                For persistent bleeding, punctures, or sudden physical distress, please contact your local 24/7 veterinary clinic directly.
              </p>
            </div>
          </div>

          {/* Right Column: Contact Form (7 cols) */}
          <div className="lg:col-span-7 bg-ivory-100/90 border border-ivory-300 rounded-2xl p-6 sm:p-10 shadow-sm space-y-6">
            <h3 className="font-serif text-2xl font-semibold text-charcoal-900 border-b border-ivory-200 pb-3">
              Send a Message
            </h3>

            {successMessage && (
              <div className="bg-sage-100 border border-sage-300 text-sage-900 p-4 rounded-lg text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-sage-700" />
                <span>{successMessage}</span>
              </div>
            )}

            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Elena Vance"
                    className="w-full bg-ivory-50 border border-ivory-300 rounded px-3.5 py-2.5 text-xs text-charcoal-800 focus:outline-none focus:border-sage-600"
                  />
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
                    className="w-full bg-ivory-50 border border-ivory-300 rounded px-3.5 py-2.5 text-xs text-charcoal-800 focus:outline-none focus:border-sage-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full bg-ivory-50 border border-ivory-300 rounded px-3.5 py-2.5 text-xs text-charcoal-800 focus:outline-none focus:border-sage-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
                    Topic
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full bg-ivory-50 border border-ivory-300 rounded px-3.5 py-2.5 text-xs text-charcoal-800 focus:outline-none focus:border-sage-600"
                  >
                    <option value="Product & Formulation Inquiry">Product &amp; Formulation Inquiry</option>
                    <option value="Order Tracking & Logistics">Order Tracking &amp; Logistics</option>
                    <option value="Emergency Grooming Kit Advisory">Emergency Grooming Kit Advisory</option>
                    <option value="Press & Collaborative Inquiries">Press &amp; Collaborative Inquiries</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
                  Your Message *
                </label>
                <textarea
                  rows={5}
                  required
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="How may our concierge assist your pet care routine?"
                  className="w-full bg-ivory-50 border border-ivory-300 rounded px-3.5 py-2.5 text-xs text-charcoal-800 focus:outline-none focus:border-sage-600 leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-charcoal-800 hover:bg-charcoal-900 text-ivory-50 text-xs uppercase tracking-widest font-semibold px-8 py-3.5 rounded transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <span>{loading ? 'Transmitting...' : 'Send Message'}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
