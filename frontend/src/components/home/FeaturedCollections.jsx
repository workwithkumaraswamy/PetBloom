import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const collections = [
  {
    title: 'Nail Care',
    slug: 'nail-care',
    description: 'Precision clippers with quick-stop safety guards and fast-acting hemostatic styptic powder.',
    image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80',
    itemCount: '2 Essentials',
    highlight: 'Safety Guard Featured',
  },
  {
    title: 'Paw Protection',
    slug: 'paw-protection',
    description: 'Organic beeswax salves shielding delicate foot pads from scorching pavement and coarse gravel.',
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80',
    itemCount: '2 Essentials',
    highlight: '100% Lick-Safe',
  },
  {
    title: 'Tear-Stain Care',
    slug: 'tear-stain-care',
    description: 'Gentle chamomile and eyebright botanical wipes designed for delicate ocular hygiene.',
    image: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=800&q=80',
    itemCount: '1 Essential',
    highlight: 'Ophthalmologist-Tested pH',
  },
  {
    title: 'Coat Care',
    slug: 'coat-care',
    description: 'Hydrolyzed silk and Moroccan argan leave-in detangling mists and soothing de-shedding rakes.',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80',
    itemCount: '2 Essentials',
    highlight: 'Weightless Gloss',
  },
  {
    title: 'Emergency Grooming Kits',
    slug: 'emergency-grooming-kits',
    description: 'All-in-one veterinary triage roll cases equipped with styptic powder, sterile gauze, shears, and guide.',
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80',
    itemCount: 'First-Response Set',
    highlight: 'Essential Companion',
    isLarge: true,
  },
];

export const FeaturedCollections = () => {
  return (
    <section className="py-20 bg-ivory-100 border-b border-ivory-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[10px] uppercase tracking-[0.25em] text-sage-600 font-semibold block mb-2">
            The Grooming Apothecary
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-charcoal-900 tracking-tight">
            Curated For Every Canine Need.
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-600 mt-2 font-light">
            Explore our specialized categories crafted to address specific physical touchpoints—from sensitive claws to delicate coats.
          </p>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((cat, idx) => (
            <div
              key={idx}
              className={`group relative rounded-xl overflow-hidden shadow-sm border border-ivory-300 bg-ivory-50 flex flex-col justify-between transition-all duration-500 hover:shadow-xl ${
                cat.isLarge ? 'md:col-span-2 lg:col-span-2' : ''
              }`}
            >
              <div className="relative aspect-16/10 w-full overflow-hidden bg-ivory-200">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 via-charcoal-900/20 to-transparent" />
                
                {/* Badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-ivory-50/90 text-charcoal-800 text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded backdrop-blur-xs">
                    {cat.highlight}
                  </span>
                </div>

                {/* Overlay Text */}
                <div className="absolute bottom-4 left-4 right-4 text-ivory-50">
                  <span className="text-[10px] uppercase tracking-widest text-gold-300 font-medium block">
                    {cat.itemCount}
                  </span>
                  <h3 className="font-serif text-2xl font-semibold tracking-wide">
                    {cat.title}
                  </h3>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs text-charcoal-600 leading-relaxed font-light">
                  {cat.description}
                </p>

                <div className="pt-2">
                  <Link
                    to={`/shop?category=${cat.slug}`}
                    className="inline-flex items-center text-xs uppercase tracking-widest font-semibold text-charcoal-800 group-hover:text-sage-700 transition-colors"
                  >
                    <span>Shop {cat.title}</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
