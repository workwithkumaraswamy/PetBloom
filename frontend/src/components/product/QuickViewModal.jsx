import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Star, ShoppingBag, Check, ShieldCheck, Heart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export const QuickViewModal = ({ product, isOpen, onClose }) => {
  if (!isOpen || !product) return null;

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isAdding, setIsAdding] = useState(false);

  const images = product.images && product.images.length > 0 ? product.images : [{ url: product.image }];
  const currentImage = images[activeImageIndex]?.url || images[0]?.url;
  const isFavorited = isInWishlist(product.id);

  const effectivePrice = selectedVariant
    ? product.price + selectedVariant.priceAdjustment
    : product.price;

  const handleAdd = async () => {
    setIsAdding(true);
    await addToCart(product, selectedVariant, quantity);
    setTimeout(() => {
      setIsAdding(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal-900/60 backdrop-blur-xs transition-opacity animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-ivory-50 border border-ivory-300 w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden z-10 animate-fadeIn max-h-[90vh] flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 text-charcoal-500 hover:text-charcoal-900 p-1.5 rounded-full bg-ivory-100/80 hover:bg-ivory-200"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gallery Left Side */}
        <div className="md:w-1/2 p-6 bg-ivory-100/60 flex flex-col justify-between">
          <div className="aspect-square w-full rounded-lg overflow-hidden bg-ivory-200 border border-ivory-200 mb-4">
            <img
              src={currentImage}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
          </div>

          {images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-14 h-14 rounded overflow-hidden border-2 shrink-0 transition-all ${
                    activeImageIndex === idx ? 'border-sage-600 scale-95' : 'border-transparent opacity-70'
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details Right Side */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.2em] text-sage-600 font-semibold">
                {product.category?.name || 'Apothecary Collection'}
              </span>
              <button
                onClick={() => toggleWishlist(product)}
                className="text-charcoal-400 hover:text-red-500 transition-colors p-1"
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-red-600 text-red-600' : ''}`} />
              </button>
            </div>

            <h2 className="font-serif text-2xl font-semibold text-charcoal-900 mt-1 mb-2">
              {product.name}
            </h2>

            {/* Rating */}
            <div className="flex items-center space-x-1 text-xs mb-3">
              <div className="flex text-gold-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.floor(product.rating || 5)
                        ? 'fill-gold-400 text-gold-400'
                        : 'text-ivory-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-charcoal-500 font-medium ml-1">
                {product.rating ? product.rating.toFixed(1) : '5.0'} ({product.reviewCount || 24} verified reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline space-x-3 mb-4">
              <span className="text-2xl font-semibold text-charcoal-900">
                ₹{effectivePrice.toLocaleString('en-IN')}
              </span>
              {product.compareAtPrice && product.compareAtPrice > effectivePrice && (
                <span className="text-sm text-charcoal-400 line-through">
                  ₹{product.compareAtPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            <p className="text-xs text-charcoal-600 leading-relaxed mb-4 line-clamp-3">
              {product.shortDescription}
            </p>

            {/* Variant Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-4">
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-charcoal-700 mb-2">
                  Select {product.variants[0].name || 'Option'}:
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`text-xs px-3 py-1.5 rounded border transition-all ${
                        selectedVariant?.id === v.id
                          ? 'border-sage-600 bg-sage-50 text-sage-900 font-semibold'
                          : 'border-ivory-300 bg-ivory-50 text-charcoal-700 hover:border-charcoal-400'
                      }`}
                    >
                      {v.value}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4 mb-6">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-700">
                Quantity:
              </span>
              <div className="flex items-center border border-ivory-300 rounded bg-ivory-50">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 text-charcoal-600 hover:bg-ivory-200"
                >
                  -
                </button>
                <span className="px-3 text-xs font-semibold text-charcoal-800">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 text-charcoal-600 hover:bg-ivory-200"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-ivory-200">
            <button
              onClick={handleAdd}
              disabled={isAdding || product.stock <= 0}
              className={`w-full py-3 rounded text-xs uppercase tracking-widest font-semibold flex items-center justify-center space-x-2 transition-all ${
                isAdding
                  ? 'bg-sage-600 text-ivory-50'
                  : product.stock <= 0
                  ? 'bg-ivory-200 text-charcoal-400 cursor-not-allowed'
                  : 'bg-charcoal-800 hover:bg-charcoal-900 text-ivory-50 shadow-md'
              }`}
            >
              {isAdding ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Grooming Bag</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag • ₹{(effectivePrice * quantity).toLocaleString('en-IN')}</span>
                </>
              )}
            </button>

            <div className="text-center">
              <Link
                to={`/product/${product.slug}`}
                onClick={onClose}
                className="text-xs text-sage-700 hover:underline font-medium inline-block"
              >
                View Full Product Ritual &amp; Ingredients →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
