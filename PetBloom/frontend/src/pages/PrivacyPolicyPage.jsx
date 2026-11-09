import React from 'react';

export const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-ivory-50 py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-sage-600 font-semibold block mb-1">
            Data Integrity &amp; Security
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-charcoal-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-charcoal-500 mt-1">Last updated: November 2024</p>
        </div>

        <div className="text-xs sm:text-sm text-charcoal-700 leading-relaxed font-light space-y-6">
          <section className="space-y-2">
            <h2 className="font-serif text-lg font-semibold text-charcoal-900">1. Commitment to Privacy</h2>
            <p>
              At PetBloom, safeguarding your personal data and your companion's care profile is fundamental to our relationship. We never sell, rent, or trade your data to third-party marketing entities.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-semibold text-charcoal-900">2. Information Collected</h2>
            <p>
              We collect your name, email address, shipping delivery address, telephone number, and optional pet profile information solely to fulfill orders, facilitate customer concierge communication, and deliver our journal to subscribers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-semibold text-charcoal-900">3. Payment Security</h2>
            <p>
              All payment transactions are tokenized and processed through PCI-DSS Level 1 compliant gateway partners (Razorpay). PetBloom never stores full credit or debit card numbers on our servers.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
