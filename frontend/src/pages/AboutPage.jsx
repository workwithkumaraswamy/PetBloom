import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, Sparkles, Award, ArrowRight } from 'lucide-react';

export const AboutPage = () => {
  return (
    <div className="min-h-screen bg-ivory-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Hero Banner */}
        <div className="text-center space-y-4">
          <span className="text-[10px] uppercase tracking-[0.25em] text-sage-600 font-semibold block">
            Our Story &amp; Ethos
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-charcoal-900 tracking-tight leading-tight">
            Because Their Care Deserves More.
          </h1>
          <p className="text-xs sm:text-base text-charcoal-600 font-light max-w-2xl mx-auto leading-relaxed">
            PetBloom was founded on an unapologetic belief: our animal companions deserve the exact same purity, craftsmanship, and aesthetic consideration that we demand for ourselves.
          </p>
        </div>

        {/* Story Visual Banner */}
        <div className="aspect-16/9 rounded-2xl overflow-hidden shadow-xl border border-ivory-300 bg-ivory-200">
          <img
            src="https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=1400&q=80"
            alt="Artisanal dog grooming ritual"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Narrative Chapters */}
        <div className="space-y-8 text-xs sm:text-sm text-charcoal-700 leading-relaxed font-light">
          <div className="space-y-3">
            <h2 className="font-serif text-2xl font-semibold text-charcoal-900">
              The Genesis of a Calmer Ritual
            </h2>
            <p>
              Like many devoted pet guardians, our founders experienced the persistent anxiety of claw clipping: noisy, cheap plastic trimmers that crushed rather than cut; harsh chemicals in detanglers; and the dread of accidental bleeding without safe, fast remedies at hand.
            </p>
            <p>
              We resolved to reinvent pet grooming as an intentional apothecary ritual. Collaborating with veterinary surgeons, metallurgists, and botanical cosmetic chemists, we developed tools crafted with surgical Japanese 440C steel and salves made from 100% human-grade organic beeswax.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-ivory-200">
            <div className="bg-ivory-100 p-5 rounded-xl border border-ivory-300 space-y-2">
              <ShieldCheck className="w-5 h-5 text-sage-700" />
              <h3 className="font-serif text-base font-semibold text-charcoal-900">Veterinary Guided</h3>
              <p className="text-xs text-charcoal-600">Built with mechanical safety stops and honest veterinary triage transparency.</p>
            </div>

            <div className="bg-ivory-100 p-5 rounded-xl border border-ivory-300 space-y-2">
              <Sparkles className="w-5 h-5 text-sage-700" />
              <h3 className="font-serif text-base font-semibold text-charcoal-900">Zero Synthetic Fillers</h3>
              <p className="text-xs text-charcoal-600">Pure raw beeswax, Moroccan argan oil, and organic hydrosols. 100% lick-safe.</p>
            </div>

            <div className="bg-ivory-100 p-5 rounded-xl border border-ivory-300 space-y-2">
              <Heart className="w-5 h-5 text-sage-700" />
              <h3 className="font-serif text-base font-semibold text-charcoal-900">Bonded Companionship</h3>
              <p className="text-xs text-charcoal-600">Transforming physical maintenance into moments of calm, mutual affection.</p>
            </div>
          </div>
        </div>

        <div className="bg-ivory-100/80 border border-ivory-300 rounded-2xl p-8 sm:p-12 text-center space-y-4">
          <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-charcoal-900">
            Join the Ritual
          </h3>
          <p className="text-xs text-charcoal-600 max-w-md mx-auto font-light">
            Explore our curated grooming apothecary and elevate your companion's everyday wellness.
          </p>
          <div className="pt-2">
            <Link
              to="/shop"
              className="inline-flex items-center bg-charcoal-800 text-ivory-50 text-xs uppercase tracking-widest font-semibold px-8 py-3.5 rounded-lg shadow-md hover:bg-charcoal-900 transition-colors"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
