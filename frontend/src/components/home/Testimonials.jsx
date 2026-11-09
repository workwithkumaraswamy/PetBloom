import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const sampleReviews = [
  {
    author: 'Aarav Mehta',
    pet: 'Leo (Golden Retriever)',
    city: 'Mumbai',
    rating: 5,
    title: 'Finally, no fear during claw maintenance!',
    review:
      'Nail clipping used to be a distressing two-person wrestling match with Leo. The safety guard on the clippers gives me the exact confidence I needed. The Japanese blades cut like warm butter without making that terrifying loud snap.',
    productName: 'Safety Dog Nail Clippers',
  },
  {
    author: 'Sunita Rao',
    pet: 'Milo (French Bulldog)',
    city: 'Bengaluru',
    rating: 5,
    title: 'A true emergency lifesaver.',
    review:
      'Accidentally trimmed Milo’s black claw slightly too close. I dipped his nail into the styptic powder jar and the bleeding stopped in under three seconds. The apothecary glass jar is gorgeous and calming to keep in our bathroom.',
    productName: 'Styptic Hemostatic Powder',
  },
  {
    author: 'Vikramaditya S.',
    pet: 'Casper (Samoyed)',
    city: 'New Delhi',
    rating: 5,
    title: 'Healed rough, cracked paws in 3 days.',
    review:
      'Living in Delhi, the hot pavements dry out Casper’s paw pads. This balm smells so gentle and natural, no synthetic perfume, and his pads are baby-soft now. Plus it is 100% lick-safe which gives me total peace of mind.',
    productName: 'Organic Beeswax Paw Balm',
  },
  {
    author: 'Nandini Sen',
    pet: 'Bella & Cooper (Beagle & Cockapoo)',
    city: 'Kolkata',
    rating: 5,
    title: 'The best gift for any responsible dog parent.',
    review:
      'The presentation of the Emergency Kit is stunning. The heavy canvas roll feels like luxury luggage, and having the waterproof emergency triage card right next to the styptic powder and shears gives me immense confidence when traveling.',
    productName: 'Canine Emergency Grooming Kit',
  },
];

export const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = () => {
    setCurrentIndex((prev) => (prev === 0 ? sampleReviews.length - 1 : prev - 1));
  };

  const next = () => {
    setCurrentIndex((prev) => (prev === sampleReviews.length - 1 ? 0 : prev + 1));
  };

  const current = sampleReviews[currentIndex];

  return (
    <section className="py-20 bg-ivory-100 border-b border-ivory-200 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-[10px] uppercase tracking-[0.25em] text-sage-600 font-semibold block mb-2">
            Verified Pet Guardian Experiences
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-charcoal-900 tracking-tight">
            Words of Trust &amp; Comfort.
          </h2>
          <p className="text-[11px] text-charcoal-500 mt-1 italic">
            *Representative customer experiences recorded during initial curation trials.
          </p>
        </div>

        {/* Testimonial Card */}
        <div className="relative bg-ivory-50 border border-ivory-300 rounded-2xl p-8 sm:p-12 shadow-md">
          <Quote className="w-12 h-12 text-gold-200/80 absolute top-6 right-8 pointer-events-none" />

          <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
            {/* Stars */}
            <div className="flex text-gold-500 mb-4">
              {[...Array(current.rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-gold-400 text-gold-400" />
              ))}
            </div>

            <h3 className="font-serif text-xl sm:text-2xl font-semibold text-charcoal-900 mb-4">
              "{current.title}"
            </h3>

            <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed font-light mb-8">
              {current.review}
            </p>

            <div className="border-t border-ivory-200 pt-4 w-full">
              <p className="text-xs font-semibold text-charcoal-900">{current.author}</p>
              <p className="text-[11px] text-sage-700 font-medium">{current.pet} • {current.city}</p>
              <span className="inline-block mt-2 text-[10px] bg-ivory-200 text-charcoal-600 px-2.5 py-0.5 rounded-full font-medium">
                Verified Curation: {current.productName}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between absolute inset-y-0 -left-4 -right-4 pointer-events-none px-2">
            <button
              onClick={prev}
              className="pointer-events-auto p-2.5 rounded-full bg-ivory-50 border border-ivory-300 shadow-md text-charcoal-700 hover:text-charcoal-950 hover:bg-white transition-all"
              aria-label="Previous review"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={next}
              className="pointer-events-auto p-2.5 rounded-full bg-ivory-50 border border-ivory-300 shadow-md text-charcoal-700 hover:text-charcoal-950 hover:bg-white transition-all"
              aria-label="Next review"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center space-x-2 mt-6">
          {sampleReviews.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                currentIndex === idx ? 'bg-sage-600 w-6' : 'bg-ivory-300'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
