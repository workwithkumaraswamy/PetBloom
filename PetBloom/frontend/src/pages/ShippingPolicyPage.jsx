import React from 'react';
import { Truck, ShieldCheck, Clock } from 'lucide-react';

export const ShippingPolicyPage = () => {
  return (
    <div className="min-h-screen bg-ivory-50 py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-sage-600 font-semibold block mb-1">
            Client Logistics
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-charcoal-900 tracking-tight">
            Shipping &amp; Delivery Policy
          </h1>
          <p className="text-xs text-charcoal-500 mt-1">Last updated: November 2024</p>
        </div>

        <div className="prose prose-stone text-xs sm:text-sm text-charcoal-700 leading-relaxed font-light space-y-6">
          <section className="space-y-2">
            <h2 className="font-serif text-lg font-semibold text-charcoal-900">Complimentary Pan-India Shipping</h2>
            <p>
              We are delighted to provide complimentary express shipping across India on all orders of ₹999 or greater. For curations below ₹999, a nominal flat delivery charge of ₹99 applies.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-semibold text-charcoal-900">Dispatch &amp; Transit Timelines</h2>
            <p>
              Orders placed before 2:00 PM IST Monday through Saturday are dispatched the same day from our temperature-controlled facility in New Delhi. Deliveries to Delhi-NCR, Mumbai, Bengaluru, Hyderabad, Kolkata, and Chennai arrive within 2 to 3 business days. Regional destinations arrive within 3 to 5 business days.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-semibold text-charcoal-900">Insured Packaging</h2>
            <p>
              Every glass amber apothecary vessel and surgical tool is encased in biodegradable unbleached honeycomb wraps and rigid gift boxes to safeguard against courier handling.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
