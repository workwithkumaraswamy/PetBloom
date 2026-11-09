import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ShieldCheck, HeartPulse, Stethoscope, CheckCircle2, ArrowRight } from 'lucide-react';

export const EmergencyGuidePage = () => {
  return (
    <div className="min-h-screen bg-ivory-50 py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 bg-red-100/80 border border-red-200 text-red-900 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
            <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
            <span>Veterinary Triage &amp; First Response Protocol</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-charcoal-900 tracking-tight">
            Canine Emergency Grooming Guide
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-600 font-light leading-relaxed">
            Clear, step-by-step instructions on handling grooming accidents calmly at home—and recognizing when immediate emergency veterinary care is required.
          </p>
        </div>

        {/* Urgent Disclaimer Alert */}
        <div className="bg-red-50 border-2 border-red-300 rounded-xl p-6 sm:p-8 text-xs text-red-950 space-y-3">
          <div className="flex items-center space-x-2 font-bold uppercase tracking-wider text-red-800 text-sm">
            <Stethoscope className="w-5 h-5 text-red-700" />
            <span>Important Medical Notice &amp; Disclaimer</span>
          </div>
          <p className="leading-relaxed font-normal">
            PetBloom provides grooming aids and educational triage instructions for minor, superficial incidents only. We do not provide clinical veterinary diagnoses. In cases of arterial spurting, deep skin lacerations, foreign body eye punctures, or severe respiratory distress, immediately apply direct pressure with sterile gauze and transport your companion to the nearest 24-hour veterinary emergency hospital.
          </p>
        </div>

        {/* Section 1: Nail Trimming Nicks & Styptic Powder */}
        <div className="bg-ivory-100/80 border border-ivory-300 rounded-2xl p-6 sm:p-10 space-y-6">
          <div className="flex items-center space-x-3 border-b border-ivory-200 pb-4">
            <div className="w-10 h-10 rounded-full bg-sage-700 text-ivory-50 flex items-center justify-center font-serif font-bold text-lg">
              1
            </div>
            <div>
              <h2 className="font-serif text-2xl font-semibold text-charcoal-900">
                Accidental Claw Quicking (Nail Bleeding)
              </h2>
              <p className="text-xs text-charcoal-500">How to establish an instant hemostatic seal</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-charcoal-700 leading-relaxed font-light">
            <div className="space-y-3">
              <h3 className="font-semibold text-charcoal-900 uppercase tracking-wider text-xs">
                Protocol Steps:
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-sage-600 shrink-0 mt-0.5" />
                  <span><strong>Remain Calm:</strong> Dogs mirror human emotional distress. A calm voice keeps their blood pressure down.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-sage-600 shrink-0 mt-0.5" />
                  <span><strong>Dispense Styptic Powder:</strong> Pour a generous pinch of hemostatic powder into the jar cap.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-sage-600 shrink-0 mt-0.5" />
                  <span><strong>Direct Immersion &amp; Pressure:</strong> Dip the bleeding claw tip directly into the powder and hold steady pressure for 5-10 seconds without wiping.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-sage-600 shrink-0 mt-0.5" />
                  <span><strong>Cease Movement:</strong> Restrict running or rough play for 30 minutes to allow the biological clot to solidify.</span>
                </li>
              </ul>
            </div>

            <div className="bg-ivory-50 p-4 rounded-xl border border-ivory-300 space-y-2">
              <h4 className="font-semibold text-red-800 uppercase tracking-wider text-[11px]">
                When to Escalate to a Vet:
              </h4>
              <p>
                If continuous direct pressure with styptic powder fails to halt claw bleeding after 5 full minutes, the quick may have suffered a longitudinal fracture requiring veterinary electro-cautery or sterile bandaging.
              </p>
              <div className="pt-2">
                <Link
                  to="/product/styptic-powder"
                  className="text-sage-700 font-semibold hover:underline inline-flex items-center"
                >
                  View Fast-Acting Styptic Powder <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Hot Pavements & Cracked Pads */}
        <div className="bg-ivory-100/80 border border-ivory-300 rounded-2xl p-6 sm:p-10 space-y-6">
          <div className="flex items-center space-x-3 border-b border-ivory-200 pb-4">
            <div className="w-10 h-10 rounded-full bg-sage-700 text-ivory-50 flex items-center justify-center font-serif font-bold text-lg">
              2
            </div>
            <div>
              <h2 className="font-serif text-2xl font-semibold text-charcoal-900">
                Pavement Heat Burns &amp; Abrasive Pad Tears
              </h2>
              <p className="text-xs text-charcoal-500">Protecting the epidermal pad barrier</p>
            </div>
          </div>

          <div className="space-y-4 text-xs text-charcoal-700 leading-relaxed font-light">
            <p>
              In hot Indian summers, dark asphalt easily climbs above 55°C (130°F), inducing second-degree contact burns in under a minute. Symptoms include limping, pad redness, skin peeling, or persistent paw licking.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-ivory-50 p-3.5 rounded-lg border border-ivory-200">
                <span className="font-bold text-charcoal-900 block mb-1">1. Cool Water Flush</span>
                <span>Submerge paws in cool (never icy) water for 5 minutes to arrest thermal progression.</span>
              </div>
              <div className="bg-ivory-50 p-3.5 rounded-lg border border-ivory-200">
                <span className="font-bold text-charcoal-900 block mb-1">2. Disinfect Gently</span>
                <span>Mist with a non-stinging hypochlorous antiseptic spray to neutralize sidewalk bacteria.</span>
              </div>
              <div className="bg-ivory-50 p-3.5 rounded-lg border border-ivory-200">
                <span className="font-bold text-charcoal-900 block mb-1">3. Seal with Beeswax</span>
                <span>Massage organic beeswax balm into the pads to lock in moisture while preserving tissue respiration.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Matted Fur Emergencies */}
        <div className="bg-ivory-100/80 border border-ivory-300 rounded-2xl p-6 sm:p-10 space-y-6">
          <div className="flex items-center space-x-3 border-b border-ivory-200 pb-4">
            <div className="w-10 h-10 rounded-full bg-sage-700 text-ivory-50 flex items-center justify-center font-serif font-bold text-lg">
              3
            </div>
            <div>
              <h2 className="font-serif text-2xl font-semibold text-charcoal-900">
                Sudden Matting &amp; Burr Entanglement
              </h2>
              <p className="text-xs text-charcoal-500">Safe knot release without risking skin lacerations</p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-charcoal-700 leading-relaxed font-light">
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-yellow-900">
              <strong>CRITICAL SAFETY RULE:</strong> Never attempt to cut tight mats flush against the skin with household kitchen scissors. Canine skin is elastic and frequently pulls up tent-like into the core of dense mats, resulting in severe accidental lacerations.
            </div>
            <p>
              Always saturate the knot with cold-pressed silk detangling spray. Allow 3 minutes for cuticle saturation. Insert a metal comb between the pet's skin and the knot to act as an insurmountable physical shield before cutting the outer edges of the mat with blunt-tip surgical shears.
            </p>
          </div>
        </div>

        {/* Emergency Kit Callout */}
        <div className="bg-charcoal-900 text-ivory-50 rounded-2xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-[10px] uppercase tracking-[0.25em] text-gold-400 font-semibold block">
              Equip Your Home Apothecary
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-semibold">
              The Complete Canine Emergency Kit
            </h3>
            <p className="text-xs text-charcoal-300 max-w-md font-light">
              Includes our safety clippers, 50g styptic powder, organic beeswax balm, blunt surgical shears, sterile swabs, and waterproof triage guide.
            </p>
          </div>
          <Link
            to="/product/complete-canine-emergency-grooming-kit"
            className="bg-gold-500 hover:bg-gold-600 text-charcoal-950 px-6 py-3.5 rounded-lg text-xs uppercase tracking-widest font-semibold transition-colors shrink-0 shadow-md"
          >
            Explore Emergency Kit
          </Link>
        </div>
      </div>
    </div>
  );
};
