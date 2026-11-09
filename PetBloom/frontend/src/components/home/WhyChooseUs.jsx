import React from 'react';
import { PackageCheck, CreditCard, Headphones, Sparkles } from 'lucide-react';

const pillars = [
  {
    icon: Sparkles,
    title: 'Apothecary Craftsmanship',
    description:
      'We combine Japanese surgical-grade stainless steel with raw unbleached beeswax and organic hydrosols for unparalleled durability and pet comfort.',
  },
  {
    icon: PackageCheck,
    title: 'Mindful Packaging & Delivery',
    description:
      'Delivered in recyclable, moisture-shielded amber glass, brushed tins, and heavy canvas rolls with rapid Pan-India express dispatch.',
  },
  {
    icon: CreditCard,
    title: 'Secure & Flexible Payments',
    description:
      '256-bit encrypted checkout powered by Razorpay test gateway—accepting UPI, Cards, NetBanking, plus verified Cash on Delivery.',
  },
  {
    icon: Headphones,
    title: 'Dedicated Client Concierge',
    description:
      'Our pet wellness advisors are on hand 6 days a week to assist with claw sizing questions, balm application tips, and grooming rituals.',
  },
];

export const WhyChooseUs = () => {
  return (
    <section className="py-20 bg-ivory-50 border-b border-ivory-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] uppercase tracking-[0.25em] text-sage-600 font-semibold block mb-2">
            The PetBloom Distinction
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-charcoal-900 tracking-tight">
            Why Discerning Guardians Choose Us.
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-600 mt-2 font-light">
            An unwavering commitment to safety, transparent ingredients, and serene home grooming.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-ivory-100/60 border border-ivory-200 p-6 rounded-xl hover:bg-ivory-100 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-sage-700 text-ivory-50 flex items-center justify-center mb-4 shadow-sm">
                    <Icon className="w-5 h-5 text-gold-300" />
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-charcoal-800 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-charcoal-600 leading-relaxed font-light">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
