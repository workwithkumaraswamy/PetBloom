import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ProductCard } from '../product/ProductCard';
import { productService } from '../../services/api';

export const Bestsellers = ({ onQuickView }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBestsellers = async () => {
      try {
        const res = await productService.getBestsellers();
        if (res.data.success && res.data.products.length > 0) {
          setProducts(res.data.products);
        } else {
          // Fallback to top products
          const allRes = await productService.getProducts({ limit: 4 });
          if (allRes.data.success) {
            setProducts(allRes.data.products);
          }
        }
      } catch (err) {
        console.warn('Error fetching bestsellers:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBestsellers();
  }, []);

  return (
    <section className="py-20 bg-ivory-50 border-b border-ivory-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-sage-600 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-gold-500" />
              <span className="text-[10px] uppercase tracking-[0.25em] font-semibold">
                Customer Favorites
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-charcoal-900 tracking-tight">
              The Essential Curation.
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-600 mt-1 max-w-md font-light">
              Our most celebrated grooming tools and botanical salves, trusted daily by thousands of pet parents across India.
            </p>
          </div>

          <div className="mt-4 md:mt-0">
            <Link
              to="/shop"
              className="inline-flex items-center text-xs uppercase tracking-widest font-semibold text-charcoal-800 hover:text-sage-700 transition-colors"
            >
              <span>View All Essentials</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Link>
          </div>
        </div>

        {/* Product Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-ivory-100/70 border border-ivory-200 rounded-lg p-4 animate-pulse h-96 flex flex-col justify-between"
              >
                <div className="aspect-square bg-ivory-200 rounded-md mb-4" />
                <div className="space-y-2">
                  <div className="h-4 bg-ivory-200 rounded w-3/4" />
                  <div className="h-3 bg-ivory-200 rounded w-1/2" />
                </div>
                <div className="h-8 bg-ivory-200 rounded mt-4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={onQuickView}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
