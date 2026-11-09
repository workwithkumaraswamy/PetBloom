import React from 'react';
import { Link } from 'react-router-dom';
import { Scissors, Sparkles, Heart, Shield, ArrowRight } from 'lucide-react';

export const GroomingGuidePage = () => {
  return (
    <div className="min-h-screen bg-ivory-50 py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[10px] uppercase tracking-[0.25em] text-sage-600 font-semibold block">
            Apothecary Rituals
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-charcoal-900 tracking-tight">
            The Pet Grooming Ritual Guide
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-600 font-light leading-relaxed">
            Cultivating serene, bonded grooming sessions that maintain skin barrier health and canine comfort.
          </p>
        </div>

        {/* Ritual 1: Claw Maintenance */}
        <div className="bg-ivory-100/70 border border-ivory-300 rounded-2xl p-8 space-y-4">
          <div className="flex items-center space-x-3 text-sage-700">
            <Scissors className="w-5 h-5 text-gold-500" />
            <h2 className="font-serif text-2xl font-semibold text-charcoal-900">
              1. The Mindful Claw Trimming Ritual
            </h2>
          </div>
          <p className="text-xs text-charcoal-700 leading-relaxed font-light">
            Long claws distort skeletal alignment, causing compensatory strain on canine hocks and spinal vertebrae. Trimming should be conducted every 2 to 3 weeks in a calm, ambiently lit setting.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-ivory-50 p-4 rounded-xl border border-ivory-200">
            <div>
              <h4 className="font-semibold text-charcoal-800 mb-1">Clear / White Nails</h4>
              <p className="text-charcoal-600">The quick is visible as a soft pink triangle. Cut 2-3mm ahead of this vascular line at a 45-degree angle.</p>
            </div>
            <div>
              <h4 className="font-semibold text-charcoal-800 mb-1">Dark / Black Nails</h4>
              <p className="text-charcoal-600">Trim paper-thin slivers incrementally. Look for a dark, slightly moist circular center in the cross section—stop immediately when observed.</p>
            </div>
          </div>
        </div>

        {/* Ritual 2: Paw Pad Barrier Care */}
        <div className="bg-ivory-100/70 border border-ivory-300 rounded-2xl p-8 space-y-4">
          <div className="flex items-center space-x-3 text-sage-700">
            <Heart className="w-5 h-5 text-gold-500" />
            <h2 className="font-serif text-2xl font-semibold text-charcoal-900">
              2. The Paw Pad Conditioning Ritual
            </h2>
          </div>
          <p className="text-xs text-charcoal-700 leading-relaxed font-light">
            Canine foot pads respirate through specialized sweat glands. Never use synthetic petroleum jellies that suffocate the tissue. Apply pure unbleached organic beeswax twice weekly to maintain elasticity against coarse stones, pavement heat, and cold winter surfaces.
          </p>
        </div>

        {/* Ritual 3: Tear-Stain Prevention */}
        <div className="bg-ivory-100/70 border border-ivory-300 rounded-2xl p-8 space-y-4">
          <div className="flex items-center space-x-3 text-sage-700">
            <Sparkles className="w-5 h-5 text-gold-500" />
            <h2 className="font-serif text-2xl font-semibold text-charcoal-900">
              3. Facial Hygiene &amp; Tear-Stain Care
            </h2>
          </div>
          <p className="text-xs text-charcoal-700 leading-relaxed font-light">
            Porphyrin compounds in tears oxidize upon exposure to light and air, creating stubborn reddish stains on lighter coats. Use chamomile and eyebright wipes daily after morning walks to cleanse moisture channels before bacterial oxidation occurs.
          </p>
        </div>

        <div className="text-center pt-4">
          <Link
            to="/shop"
            className="inline-flex items-center bg-charcoal-800 hover:bg-charcoal-900 text-ivory-50 text-xs uppercase tracking-widest font-semibold px-8 py-3.5 rounded-lg shadow-md transition-colors"
          >
            <span>Explore The Full Apothecary Collection</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
};
