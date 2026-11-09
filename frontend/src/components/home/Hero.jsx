import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Sparkles, Heart } from 'lucide-react';

export const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-ivory-100 py-16 sm:py-24 border-b border-ivory-300">
      {/* Subtle Warm Background Glow */}
      <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 rounded-full bg-gold-200/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-96 h-96 rounded-full bg-sage-200/30 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Text Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-ivory-200/80 border border-ivory-300 px-3.5 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-sage-600"></span>
              <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-charcoal-700">
                Apothecary Pet Grooming &amp; First Response
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-charcoal-900 tracking-tight leading-[1.12]">
              Exceptional Care for Every{' '}
              <span className="italic font-normal text-sage-700">Precious Paw.</span>
            </h1>

            <p className="text-base sm:text-lg text-charcoal-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
              Thoughtfully selected grooming essentials designed to keep your furry companions comfortable, clean, and cared for. Formulated with pure botanicals and precision surgical ergonomics.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
              <Link
                to="/shop"
                className="w-full sm:w-auto bg-charcoal-800 hover:bg-charcoal-900 text-ivory-50 text-xs uppercase tracking-widest font-semibold px-8 py-4 rounded-md shadow-lg transition-all flex items-center justify-center space-x-2 group"
              >
                <span>Explore Collection</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/emergency-kits"
                className="w-full sm:w-auto bg-ivory-50 hover:bg-ivory-200 text-charcoal-800 border border-charcoal-300 text-xs uppercase tracking-widest font-semibold px-8 py-4 rounded-md transition-all flex items-center justify-center"
              >
                <span>Discover Our Essentials</span>
              </Link>
            </div>

            {/* Trust Markers */}
            <div className="pt-6 border-t border-ivory-300/80 grid grid-cols-3 gap-4 text-center lg:text-left">
              <div>
                <span className="block font-serif text-xl sm:text-2xl font-bold text-charcoal-800">
                  100%
                </span>
                <span className="text-[11px] text-charcoal-500 font-medium">Lick-Safe Formulations</span>
              </div>
              <div>
                <span className="block font-serif text-xl sm:text-2xl font-bold text-charcoal-800">
                  3.5mm
                </span>
                <span className="text-[11px] text-charcoal-500 font-medium">Japanese Surgical Steel</span>
              </div>
              <div>
                <span className="block font-serif text-xl sm:text-2xl font-bold text-charcoal-800">
                  4.9★
                </span>
                <span className="text-[11px] text-charcoal-500 font-medium">Pet Parent Approved</span>
              </div>
            </div>
          </div>

          {/* Right Luxury Editorial Visual Collage */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Luxury Hero Image */}
              <div className="aspect-4/5 rounded-2xl overflow-hidden shadow-2xl border-4 border-ivory-50 bg-ivory-200">
                <img
                  src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1200&q=80"
                  alt="Precious groomed dog with healthy paws"
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {/* Floating Featured Product Card Badge */}
              <div className="absolute -bottom-6 -left-6 sm:-left-8 bg-ivory-50/95 backdrop-blur-md border border-ivory-300 p-4 rounded-xl shadow-xl max-w-[240px] hidden sm:block">
                <div className="flex items-center space-x-3">
                  <img
                    src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=200&q=80"
                    alt="Canine Emergency Kit"
                    className="w-12 h-12 object-cover rounded-md border border-ivory-200"
                  />
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-sage-600 font-bold block">
                      Featured Kit
                    </span>
                    <span className="text-xs font-serif font-semibold text-charcoal-800 line-clamp-1">
                      Canine Emergency Kit
                    </span>
                    <span className="text-xs font-semibold text-charcoal-900 block mt-0.5">
                      ₹3,850
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating Quality Seal */}
              <div className="absolute -top-4 -right-4 sm:-right-6 bg-sage-800 text-ivory-50 p-3.5 rounded-full shadow-lg border-2 border-ivory-50 flex items-center justify-center">
                <Shield className="w-5 h-5 text-gold-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
