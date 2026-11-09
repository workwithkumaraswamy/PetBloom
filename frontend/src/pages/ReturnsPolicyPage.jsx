import React from 'react';

export const ReturnsPolicyPage = () => {
  return (
    <div className="min-h-screen bg-ivory-50 py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-sage-600 font-semibold block mb-1">
            White-Glove Guarantee
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-charcoal-900 tracking-tight">
            Returns &amp; Exchange Policy
          </h1>
          <p className="text-xs text-charcoal-500 mt-1">Last updated: November 2024</p>
        </div>

        <div className="text-xs sm:text-sm text-charcoal-700 leading-relaxed font-light space-y-6">
          <section className="space-y-2">
            <h2 className="font-serif text-lg font-semibold text-charcoal-900">14-Day Return Privilege</h2>
            <p>
              We want you and your canine companion to be entirely at ease. If an item does not meet your discerning expectations, we accept returns within 14 calendar days from delivery, provided the product remains unused, unwashed, with unbroken safety seals and original presentation packaging intact.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-semibold text-charcoal-900">Damaged or Defective Items</h2>
            <p>
              If an item is damaged during courier transit, contact us at <a href="mailto:concierge@petbloom.com" className="text-sage-700 underline font-medium">concierge@petbloom.com</a> with your order number and a photograph. We immediately dispatch a replacement via express courier at zero extra charge.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-semibold text-charcoal-900">Refund Processing</h2>
            <p>
              Once your returned parcel is inspected at our atelier, refunds are credited back to your original payment method (Card/UPI/NetBanking) within 3 to 5 business days. Cash on Delivery orders are refunded via direct NEFT/UPI bank transfer.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
