import React from 'react';

export const TermsPage = () => {
  return (
    <div className="min-h-screen bg-ivory-50 py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-sage-600 font-semibold block mb-1">
            Client Terms
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-charcoal-900 tracking-tight">
            Terms &amp; Conditions
          </h1>
          <p className="text-xs text-charcoal-500 mt-1">Last updated: November 2024</p>
        </div>

        <div className="text-xs sm:text-sm text-charcoal-700 leading-relaxed font-light space-y-6">
          <section className="space-y-2">
            <h2 className="font-serif text-lg font-semibold text-charcoal-900">1. Acceptance of Terms</h2>
            <p>
              By accessing and placing orders through petbloom.com, you agree to be bound by these Terms of Service and all applicable laws and regulations of India.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-semibold text-charcoal-900">2. Veterinary Guidance Disclaimer</h2>
            <p>
              The products, guides, and triage protocols provided on this site are designed for home pet grooming and minor superficial claw maintenance. They are not intended as substitutes for professional veterinary diagnosis, treatment, or emergency surgery.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-semibold text-charcoal-900">3. Intellectual Property</h2>
            <p>
              All trademarks, product names, logos, editorial text, visual photography, and design elements are the intellectual property of PetBloom and may not be reproduced without prior written consent.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
