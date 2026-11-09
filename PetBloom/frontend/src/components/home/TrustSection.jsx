import React from 'react';
import { Sparkles, Leaf, Scissors, HeartHandshake } from 'lucide-react';

const trustPillars = [
  {
    icon: Sparkles,
    title: 'Thoughtfully Selected Products',
    description:
      'Every tool and salve is developed with real canine anatomy in mind—prioritizing comfort, ease of use, and gentle home handling.',
  },
  {
    icon: Leaf,
    title: 'Quality-Focused Ingredients',
    description:
      'Pure organic beeswax, cold-pressed botanical oils, and therapeutic chamomile hydrosols. Absolutely zero petroleum, parabens, or harsh detergents.',
  },
  {
    icon: Scissors,
    title: 'Everyday Grooming Essentials',
    description:
      'Designed to turn routine claw clipping, paw conditioning, and brush-outs into soothing, bonded moments for you and your companion.',
  },
  {
    icon: HeartHandshake,
    title: 'Care for Every Coat',
    description:
      'From double-coated goldens and curly doodles to sensitive hairless breeds—gentle solutions suited for varied coat textures and skin sensitivities.',
  },
];

export const TrustSection = () => {
  return (
    <section className="py-14 sm:py-18 bg-ivory-50 border-b border-ivory-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {trustPillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-3 p-4 rounded-lg transition-colors hover:bg-ivory-100/60"
              >
                <div className="w-12 h-12 rounded-full bg-sage-100/80 border border-sage-200/80 flex items-center justify-center text-sage-700 shrink-0">
                  <Icon className="w-5 h-5 text-sage-700" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-charcoal-900 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-xs text-charcoal-600 leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
