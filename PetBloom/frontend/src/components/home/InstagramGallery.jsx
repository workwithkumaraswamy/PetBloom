import React from 'react';
import { Instagram } from 'lucide-react';

const instagramPhotos = [
  {
    image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=600&q=80',
    caption: 'Gentle Sunday nail trim ritual with Leo ✨ #PetBloom',
  },
  {
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80',
    caption: 'Beeswax paw balm protection before our afternoon walk 🐾',
  },
  {
    image: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=600&q=80',
    caption: 'Clear, bright eyes with pure chamomile wipes 🌿',
  },
  {
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=600&q=80',
    caption: 'Silken brush-out session with argan detangling spray ✨',
  },
  {
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=600&q=80',
    caption: 'Our emergency roll kit always packed for road trips 🚗 #DogWellness',
  },
  {
    image: 'https://images.unsplash.com/photo-1535294435445-d7249524ef2e?auto=format&fit=crop&w=600&q=80',
    caption: 'Post-walk paw massage bliss. Because they deserve the best.',
  },
];

export const InstagramGallery = () => {
  return (
    <section className="py-20 bg-ivory-50 border-b border-ivory-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 text-sage-600 mb-2">
            <Instagram className="w-4 h-4 text-gold-500" />
            <span className="text-[10px] uppercase tracking-[0.25em] font-semibold">
              @petbloom
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-charcoal-900 tracking-tight">
            The Ritual In Daily Life.
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-600 mt-1 font-light">
            Tag #PetBloom to be featured in our curated pet lifestyle gallery.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {instagramPhotos.map((item, idx) => (
            <div
              key={idx}
              className="group relative aspect-square rounded-lg overflow-hidden bg-ivory-200 shadow-sm border border-ivory-200"
            >
              <img
                src={item.image}
                alt={item.caption}
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-charcoal-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end text-ivory-50">
                <Instagram className="w-4 h-4 text-gold-300 mb-1" />
                <p className="text-[10px] line-clamp-3 leading-snug font-light">{item.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
