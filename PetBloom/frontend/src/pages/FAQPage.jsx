import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const faqs = [
  {
    category: 'Product & Formulation Care',
    questions: [
      {
        q: 'How does the quick-stop safety guard on your nail clippers work?',
        a: 'The safety guard is a precisely calibrated 2mm stainless steel barrier plate positioned behind the cutting blades. It prevents over-insertion of the dog claw, protecting the living blood vessel (the quick) from accidental shearing. However, we advise making incremental slivers on dark claws.',
      },
      {
        q: 'What should I do if I accidentally cut the quick?',
        a: 'Remain calm. Immediately dip the bleeding claw tip directly into PetBloom Styptic Powder and apply firm, direct pressure for 5-10 seconds without wiping. The ferric subsulfate and potassium alum create an immediate biological hemostatic seal. If bleeding persists beyond 5 minutes, seek immediate veterinary attention.',
      },
      {
        q: 'Is the Organic Beeswax Paw Balm safe if licked by my dog?',
        a: 'Yes, 100%. Our balm contains solely pure unbleached organic beeswax, fair-trade raw shea butter, virgin coconut oil, olive-infused calendula flower extract, and natural non-GMO vitamin E. It is completely non-toxic and human food-grade safe.',
      },
      {
        q: 'Can the Tear-Stain Wipes be used on puppies and sensitive breeds?',
        a: 'Absolutely. Formulated with organic chamomile hydrosol, euphrasia (eyebright), and pure mountain water at a neutral pH 6.8 matching canine tear ducts. Free from bleach, alcohol, fragrance, and sulfates. Safe for daily use on puppies over 8 weeks old.',
      },
    ],
  },
  {
    category: 'Orders, Shipping & Returns',
    questions: [
      {
        q: 'What are your delivery timelines across India?',
        a: 'Orders are dispatched from our New Delhi atelier within 24 hours via Express Insured Air Couriers (BlueDart / Delhivery). Metro cities typically receive deliveries within 2-3 business days; all other regions within 3-5 business days.',
      },
      {
        q: 'Do you offer Cash on Delivery (COD)?',
        a: 'Yes, Cash on Delivery is available across all serviceable pincodes in India with zero surcharge.',
      },
      {
        q: 'What is your returns and replacement policy?',
        a: 'We offer a 14-day return privilege on unused, unopened apothecary items in their original packaging. In the rare case of transit damage, our concierge dispatches an immediate replacement without requiring return shipping.',
      },
    ],
  },
];

export const FAQPage = () => {
  const [openMap, setOpenMap] = useState({});

  const toggle = (idx) => {
    setOpenMap((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="min-h-screen bg-ivory-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[10px] uppercase tracking-[0.25em] text-sage-600 font-semibold block">
            Client Assistance
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-charcoal-900 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-600 font-light">
            Insights regarding formulation safety, home grooming rituals, and express delivery.
          </p>
        </div>

        <div className="space-y-10">
          {faqs.map((cat, cIdx) => (
            <div key={cIdx} className="space-y-4">
              <h2 className="font-serif text-xl font-semibold text-charcoal-800 border-b border-ivory-300 pb-2">
                {cat.category}
              </h2>
              <div className="space-y-3">
                {cat.questions.map((item, qIdx) => {
                  const key = `${cIdx}_${qIdx}`;
                  const isOpen = !!openMap[key];
                  return (
                    <div
                      key={qIdx}
                      className="bg-ivory-100/70 border border-ivory-200 rounded-xl overflow-hidden transition-all"
                    >
                      <button
                        onClick={() => toggle(key)}
                        className="w-full p-4 sm:p-5 text-left flex justify-between items-center space-x-4 hover:bg-ivory-200/50"
                      >
                        <span className="text-xs sm:text-sm font-semibold text-charcoal-900">
                          {item.q}
                        </span>
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-charcoal-500 shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-charcoal-500 shrink-0" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="px-4 sm:px-5 pb-5 text-xs text-charcoal-600 font-light leading-relaxed border-t border-ivory-200 pt-3">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
