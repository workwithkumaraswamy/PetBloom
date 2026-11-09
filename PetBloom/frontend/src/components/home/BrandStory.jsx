import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, HeartHandshake, Sparkles } from 'lucide-react';

export const BrandStory = () => {
  return (
    <section className="py-24 bg-ivory-100 border-b border-ivory-200 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Image Collage Left */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-lg">
              <div className="aspect-4/5 rounded-2xl overflow-hidden shadow-2xl border-4 border-ivory-50 bg-ivory-200">
                <img
                  src="https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?auto=format&fit=crop&w=1200&q=80"
                  alt="Mindful dog care and bonding ritual"
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {/* Smaller Overlapping Luxury Photo */}
              <div className="absolute -bottom-8 -right-6 sm:-right-8 w-1/2 aspect-square rounded-xl overflow-hidden shadow-xl border-4 border-ivory-50 bg-ivory-200 hidden sm:block">
                <img
                  src="https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=600&q=80"
                  alt="Gentle paw inspection"
                  className="w-full h-full object-cover object-center"
                />
              </div>

              <div className="absolute -top-4 -left-4 bg-gold-400 text-charcoal-950 px-4 py-2 rounded-md shadow-md text-xs font-serif font-bold italic">
                Est. 2024 • Handcrafted Care
              </div>
            </div>
          </div>

          {/* Right Narrative Story */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[10px] uppercase tracking-[0.25em] text-sage-600 font-semibold block">
              Our Founding Philosophy
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-charcoal-900 tracking-tight leading-tight">
              Because Their Care <br />
              <span className="italic text-sage-700 font-normal">Deserves More.</span>
            </h2>

            <div className="space-y-4 text-xs sm:text-sm text-charcoal-600 leading-relaxed font-light">
              <p>
                PetBloom was born from an intimate recognition: for far too long, pet grooming was treated either as an anxious battle or an afterthought dominated by cheap plastic trimmers and chemical-laden shampoos.
              </p>
              <p>
                We believe that grooming is not merely maintenance—it is a bonding ritual of physical touch, affection, and health inspection. When you gently inspect a paw pad or detangle a matted ear, you are speaking a language of pure trust.
              </p>
              <p>
                Every formulation in our apothecary is rooted in organic botanicals, and every tool is crafted with surgical-grade materials. No fabricated claims, no shortcuts—only thoughtful essentials designed to grant pet guardians absolute serenity.
              </p>
            </div>

            {/* Core Values Bullet Row */}
            <div className="pt-2 grid grid-cols-2 gap-4">
              <div className="flex items-start space-x-2.5">
                <ShieldCheck className="w-4 h-4 text-sage-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold text-charcoal-800">Veterinary Guided</h4>
                  <p className="text-[11px] text-charcoal-500">Safe clearances and clear triage notes</p>
                </div>
              </div>
              <div className="flex items-start space-x-2.5">
                <HeartHandshake className="w-4 h-4 text-sage-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold text-charcoal-800">Stress-Free Handling</h4>
                  <p className="text-[11px] text-charcoal-500">Ergonomic balance reduces claw anxiety</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Link
                to="/about"
                className="inline-flex items-center text-xs uppercase tracking-widest font-semibold text-charcoal-800 hover:text-sage-700 transition-colors border-b border-charcoal-800 hover:border-sage-700 pb-1"
              >
                <span>Read The Full Story</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
