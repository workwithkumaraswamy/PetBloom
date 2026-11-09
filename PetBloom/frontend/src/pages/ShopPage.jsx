import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, ArrowUpDown, X, Check, Sparkles } from 'lucide-react';
import { ProductCard } from '../components/product/ProductCard';
import { QuickViewModal } from '../components/product/QuickViewModal';
import { productService, categoryService } from '../services/api';

export const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all';
  const searchParam = searchParams.get('search') || '';
  const emergencyParam = searchParams.get('emergency') === 'true';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [onlyEmergency, setOnlyEmergency] = useState(emergencyParam);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isFilterMobileOpen, setIsFilterMobileOpen] = useState(false);

  // Sync category param with state
  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  // Sync emergency param with state
  useEffect(() => {
    setOnlyEmergency(emergencyParam);
  }, [emergencyParam]);

  // Fetch categories
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await categoryService.getCategories();
        if (res.data.success) {
          setCategories(res.data.categories);
        }
      } catch (e) {
        console.warn('Failed to fetch categories:', e.message);
      }
    };
    fetchCats();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setLoading(true);
      try {
        const params = {
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          search: searchParam || undefined,
          sortBy,
          isEmergencyKit: onlyEmergency ? true : undefined,
          minPrice: priceRange.min || undefined,
          maxPrice: priceRange.max || undefined,
        };

        const res = await productService.getProducts(params);
        if (res.data.success) {
          setProducts(res.data.products);
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredProducts();
  }, [selectedCategory, sortBy, onlyEmergency, priceRange, searchParam]);

  const handleCategorySelect = (slug) => {
    setSelectedCategory(slug);
    if (slug === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', slug);
    }
    setSearchParams(searchParams);
  };

  const handleEmergencyToggle = () => {
    const nextState = !onlyEmergency;
    setOnlyEmergency(nextState);
    if (nextState) {
      searchParams.set('emergency', 'true');
    } else {
      searchParams.delete('emergency');
    }
    setSearchParams(searchParams);
  };

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setOnlyEmergency(false);
    setPriceRange({ min: '', max: '' });
    setSortBy('featured');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-ivory-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Header */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <span className="text-[10px] uppercase tracking-[0.25em] text-sage-600 font-semibold block mb-2">
            The Complete Curation
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-charcoal-900 tracking-tight">
            Apothecary Grooming Essentials
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-600 mt-2 font-light">
            Surgical stainless steel clippers, fast-acting styptic powders, organic beeswax salves, and all-in-one emergency kits.
          </p>
        </div>

        {/* Category Horizontal Filter Bar */}
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-4 mb-8 space-x-2 scrollbar-none">
          <button
            onClick={() => handleCategorySelect('all')}
            className={`text-xs uppercase tracking-wider px-4 py-2 rounded-full font-medium transition-all shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-charcoal-800 text-ivory-50 shadow-sm'
                : 'bg-ivory-200/80 text-charcoal-700 hover:bg-ivory-300'
            }`}
          >
            All Essentials ({products.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.slug)}
              className={`text-xs uppercase tracking-wider px-4 py-2 rounded-full font-medium transition-all shrink-0 ${
                selectedCategory === cat.slug
                  ? 'bg-charcoal-800 text-ivory-50 shadow-sm'
                  : 'bg-ivory-200/80 text-charcoal-700 hover:bg-ivory-300'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Sorting, Emergency Toggle & Mobile Filter Toggle */}
        <div className="bg-ivory-100/80 border border-ivory-200 rounded-lg p-3 sm:p-4 mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            {/* Emergency Toggle Pill */}
            <button
              onClick={handleEmergencyToggle}
              className={`text-xs px-3.5 py-1.5 rounded-full border transition-all flex items-center space-x-1.5 font-medium ${
                onlyEmergency
                  ? 'bg-sage-700 border-sage-700 text-ivory-50 shadow-xs'
                  : 'bg-ivory-50 border-ivory-300 text-charcoal-700 hover:border-charcoal-400'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Emergency Kits Only</span>
            </button>

            {searchParam && (
              <span className="text-xs bg-ivory-200 text-charcoal-700 px-3 py-1 rounded-full flex items-center">
                Search: "{searchParam}"
                <button
                  onClick={() => {
                    searchParams.delete('search');
                    setSearchParams(searchParams);
                  }}
                  className="ml-1.5 hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>

          <div className="flex items-center space-x-3 ml-auto">
            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2 text-xs text-charcoal-700">
              <span className="hidden sm:inline font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-ivory-50 border border-ivory-300 text-xs px-3 py-1.5 rounded focus:outline-none focus:border-sage-500 text-charcoal-800 font-medium"
              >
                <option value="featured">Featured Curations</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="popularity">Most Popular</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-8">
            {[...Array(8)].map((_, i) => (
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
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-ivory-100/50 rounded-xl border border-ivory-200 max-w-lg mx-auto p-8">
            <h3 className="font-serif text-2xl font-semibold text-charcoal-800 mb-2">
              No products found
            </h3>
            <p className="text-xs text-charcoal-600 mb-6">
              We couldn't find any apothecary items matching your specific filter criteria.
            </p>
            <button
              onClick={handleClearFilters}
              className="bg-charcoal-800 hover:bg-charcoal-900 text-ivory-50 text-xs uppercase tracking-widest font-semibold px-6 py-2.5 rounded transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
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
  );
};
