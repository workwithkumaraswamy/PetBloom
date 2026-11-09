import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingBag, Eye, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export const ProductCard = ({ product, onQuickView }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [isAdding, setIsAdding] = useState(false);

  if (!product) return null;

  const isFavorited = isInWishlist(product.id);
  const primaryImage =
    product.images?.find((img) => img.isPrimary)?.url ||
    product.images?.[0]?.url ||
    product.image ||
    'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80';

  const secondaryImage =
    product.images?.[1]?.url || primaryImage;

  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    await addToCart(product, product.variants?.[0] || null, 1);
    setTimeout(() => setIsAdding(false), 800);
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickViewClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) onQuickView(product);
  };

  return (
    <div className="group relative bg-ivory-50 rounded-lg overflow-hidden border border-ivory-200/90 luxury-card-hover flex flex-col h-full">
      {/* Image Container with Badges & Hover Actions */}
      <div className="relative aspect-4/5 w-full bg-ivory-100 overflow-hidden">
        <Link to={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={primaryImage}
            alt={product.name}
            className="w-full h-full object-cover object-center transition-all duration-700 group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isEmergencyKit && (
            <span className="bg-sage-700 text-ivory-50 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded shadow-xs">
              Emergency Kit
            </span>
          )}
          {product.isBestseller && !product.isEmergencyKit && (
            <span className="bg-charcoal-800 text-gold-300 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded shadow-xs">
              Bestseller
            </span>
          )}
          {discountPercent && (
            <span className="bg-gold-500 text-charcoal-950 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-xs">
              {discountPercent}% Off
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 shadow-sm z-10 ${
            isFavorited
              ? 'bg-red-50 text-red-600 scale-105'
              : 'bg-ivory-50/90 text-charcoal-500 hover:text-red-500 hover:bg-white'
          }`}
          title={isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-red-600' : ''}`} />
        </button>

        {/* Quick View Button Hover Slide Up */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center space-x-2 z-10">
          <button
            onClick={handleQuickViewClick}
            className="flex-1 bg-ivory-50/95 hover:bg-ivory-100 text-charcoal-800 text-xs font-semibold py-2 px-3 rounded shadow-md border border-ivory-300/80 transition-colors flex items-center justify-center space-x-1"
          >
            <Eye className="w-3.5 h-3.5 mr-1 text-charcoal-600" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category Tag */}
          <p className="text-[10px] uppercase tracking-[0.18em] text-sage-600 font-semibold mb-1">
            {product.category?.name || 'Apothecary'}
          </p>

          {/* Product Title */}
          <Link
            to={`/product/${product.slug}`}
            className="block font-serif text-base sm:text-lg font-semibold text-charcoal-800 hover:text-sage-700 transition-colors leading-snug line-clamp-1"
          >
            {product.name}
          </Link>

          {/* Short Description */}
          <p className="text-xs text-charcoal-500 line-clamp-2 mt-1 leading-relaxed">
            {product.shortDescription}
          </p>
        </div>

        <div className="pt-3 mt-3 border-t border-ivory-200/60">
          {/* Rating */}
          <div className="flex items-center space-x-1 text-xs mb-2">
            <div className="flex text-gold-500">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating || 5)
                      ? 'fill-gold-400 text-gold-400'
                      : 'text-ivory-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-[11px] text-charcoal-500 font-medium ml-1">
              {product.rating ? product.rating.toFixed(1) : '5.0'}
              {product.reviewCount ? ` (${product.reviewCount})` : ''}
            </span>
          </div>

          {/* Price & Add to Bag CTA */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm sm:text-base font-semibold text-charcoal-900">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-xs text-charcoal-400 line-through ml-2">
                  ₹{product.compareAtPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isAdding || product.stock <= 0}
              className={`text-xs px-3 py-1.5 rounded transition-all duration-300 font-medium flex items-center space-x-1 ${
                isAdding
                  ? 'bg-sage-600 text-ivory-50'
                  : product.stock <= 0
                  ? 'bg-ivory-200 text-charcoal-400 cursor-not-allowed'
                  : 'bg-charcoal-800 hover:bg-charcoal-900 text-ivory-50'
              }`}
            >
              {isAdding ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added</span>
                </>
              ) : product.stock <= 0 ? (
                <span>Sold Out</span>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
