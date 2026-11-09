import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, CheckCircle2, ArrowRight, Sparkles, HeartHandshake } from 'lucide-react';
import { productService } from '../services/api';
import { ProductCard } from '../components/product/ProductCard';
import { QuickViewModal } from '../components/product/QuickViewModal';

export const EmergencyKitsPage = () => {
  const [kits, setKits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    productService
      .getEmergencyKits()
      .then((res) => {
        if (res.data.success) {
          setKits(res.data.products);
        }
      })
      .catch((e) => console.warn('Failed to load emergency kits:', e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-ivory-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 bg-sage-100 text-sage-800 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border border-sage-200">
            <ShieldAlert className="w-3.5 h-3.5 text-sage-700" />
            <span>Veterinary-Curated Home First Response</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-charcoal-900 tracking-tight">
            Canine Emergency Grooming Kits
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-600 font-light leading-relaxed">
            All-in-one veterinary triage sets equipped with surgical stainless steel clippers, fast-acting styptic powder, organic beeswax paw balms, sterile gauze, and water-resistant first-response protocol cards.
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-ivory-100/80 border border-ivory-300 rounded-2xl p-6 space-y-2">
            <span className="w-8 h-8 rounded-full bg-sage-700 text-ivory-50 flex items-center justify-center text-xs font-bold font-serif mb-2">
              1
            </span>
            <h3 className="font-serif text-lg font-semibold text-charcoal-900">
              Immediate Hemostatic Control
            </h3>
            <p className="text-xs text-charcoal-600 font-light leading-relaxed">
              Stops accidental nail-trimming quick bleeding in under 5 seconds with medical-grade ferric subsulfate and bentonite clay.
            </p>
          </div>

          <div className="bg-ivory-100/80 border border-ivory-300 rounded-2xl p-6 space-y-2">
            <span className="w-8 h-8 rounded-full bg-sage-700 text-ivory-50 flex items-center justify-center text-xs font-bold font-serif mb-2">
              2
            </span>
            <h3 className="font-serif text-lg font-semibold text-charcoal-900">
              Blunt Surgical Shears
            </h3>
            <p className="text-xs text-charcoal-600 font-light leading-relaxed">
              Rounded blunt safety tips prevent puncture injuries while cutting tight burrs and entangled mats close to delicate skin.
            </p>
          </div>

          <div className="bg-ivory-100/80 border border-ivory-300 rounded-2xl p-6 space-y-2">
            <span className="w-8 h-8 rounded-full bg-sage-700 text-ivory-50 flex items-center justify-center text-xs font-bold font-serif mb-2">
              3
            </span>
            <h3 className="font-serif text-lg font-semibold text-charcoal-900">
              Waterproof Triage Card
            </h3>
            <p className="text-xs text-charcoal-600 font-light leading-relaxed">
              Step-by-step guidance for minor claw nicks, summer asphalt heat burns, and knowing when to escalate to an emergency clinic.
            </p>
          </div>
        </div>

        {/* Kits Products Grid */}
        <div>
          <div className="border-b border-ivory-200 pb-4 mb-8 flex justify-between items-center">
            <h2 className="font-serif text-2xl font-semibold text-charcoal-900">
              Emergency Kits &amp; First Response Essentials
            </h2>
            <Link
              to="/emergency-guide"
              className="text-xs text-sage-700 hover:text-sage-900 font-semibold inline-flex items-center"
            >
              <span>Read Emergency Triage Guide</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-16 text-xs text-charcoal-500">
              Loading emergency kits...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {kits.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={(p) => setQuickViewProduct(p)}
                />
              ))}
            </div>
          )}
        </div>

        <QuickViewModal
          product={quickViewProduct}
          isOpen={!!quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      </div>
    </div>
  );
};
