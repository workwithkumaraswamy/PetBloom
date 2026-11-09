import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { productService } from '../../services/api';

export const SearchModal = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const popularSearches = [
    'Safety Nail Clippers',
    'Styptic Powder',
    'Tear-Stain Wipes',
    'Detangling Spray',
    'Emergency Grooming Kit',
    'Organic Paw Balm',
  ];

  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await productService.getProducts({ search: searchTerm, limit: 5 });
        if (res.data.success) {
          setResults(res.data.products);
        }
      } catch (err) {
        console.warn('Search query error:', err.message);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelectProduct = (slug) => {
    onClose();
    navigate(`/product/${slug}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    onClose();
    navigate(`/shop?search=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal-900/60 backdrop-blur-xs transition-opacity animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative bg-ivory-50 border border-ivory-300 w-full max-w-2xl rounded-lg shadow-2xl overflow-hidden z-10 animate-fadeIn">
        <form onSubmit={handleSearchSubmit} className="p-4 border-b border-ivory-200 flex items-center space-x-3">
          <Search className="w-5 h-5 text-charcoal-400" />
          <input
            type="text"
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search clippers, styptic powder, organic balms, emergency kits..."
            className="w-full bg-transparent text-sm sm:text-base text-charcoal-800 placeholder-charcoal-400 focus:outline-none"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="text-charcoal-400 hover:text-charcoal-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-medium text-charcoal-500 hover:text-charcoal-800 px-2 py-1 rounded"
          >
            ESC
          </button>
        </form>

        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {/* Quick Popular Tags */}
          {!searchTerm && (
            <div>
              <p className="text-[11px] uppercase tracking-wider text-charcoal-400 font-semibold mb-3">
                Curated Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setSearchTerm(term)}
                    className="text-xs bg-ivory-200/80 hover:bg-ivory-300 text-charcoal-700 px-3 py-1.5 rounded-full transition-colors flex items-center"
                  >
                    <Sparkles className="w-3 h-3 mr-1 text-gold-500" />
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="text-center py-6 text-xs text-charcoal-500">
              Consulting apothecary catalog...
            </div>
          )}

          {/* Results List */}
          {!loading && results.length > 0 && (
            <div className="space-y-3">
              <p className="text-[11px] uppercase tracking-wider text-charcoal-400 font-semibold mb-2">
                Products ({results.length})
              </p>
              {results.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleSelectProduct(product.slug)}
                  className="flex items-center space-x-4 p-2.5 rounded-md hover:bg-ivory-200/80 transition-colors cursor-pointer group"
                >
                  <img
                    src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=150&q=80'}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded bg-ivory-200 shrink-0 border border-ivory-300"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-charcoal-800 group-hover:text-sage-700 truncate">
                      {product.name}
                    </p>
                    <p className="text-[11px] text-charcoal-500 line-clamp-1">{product.shortDescription}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-semibold text-charcoal-900">
                      ₹{product.price.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              ))}

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={handleSearchSubmit}
                  className="text-xs text-sage-700 font-semibold hover:underline inline-flex items-center"
                >
                  View all results for "{searchTerm}"
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </button>
              </div>
            </div>
          )}

          {!loading && searchTerm && results.length === 0 && (
            <div className="text-center py-8">
              <p className="text-sm font-medium text-charcoal-700">No essentials found matching "{searchTerm}"</p>
              <p className="text-xs text-charcoal-500 mt-1">Try searching for "clippers", "balm", or "emergency".</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
