import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

export const WishlistPage = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className="min-h-screen bg-ivory-50 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-[10px] uppercase tracking-[0.25em] text-sage-600 font-semibold block mb-1">
            Personal Curation
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-charcoal-900 tracking-tight">
            Your Saved Wishlist ({wishlistItems.length})
          </h1>
          <p className="text-xs text-charcoal-500 mt-1">
            Essentials saved for your upcoming grooming rituals.
          </p>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-20 bg-ivory-100/60 rounded-2xl border border-ivory-300 max-w-lg mx-auto p-8">
            <Heart className="w-12 h-12 text-charcoal-300 mx-auto mb-3" />
            <h3 className="font-serif text-xl font-semibold text-charcoal-800 mb-1">
              Your wishlist is empty
            </h3>
            <p className="text-xs text-charcoal-500 mb-6">
              Tap the heart icon on any product to save it to your personal curation.
            </p>
            <Link
              to="/shop"
              className="inline-block bg-charcoal-800 text-ivory-50 text-xs uppercase tracking-widest font-semibold px-6 py-3 rounded shadow-md"
            >
              Discover Curations
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlistItems.map((product) => {
              const image =
                product.images?.[0]?.url ||
                product.image ||
                'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=400&q=80';

              return (
                <div
                  key={product.id}
                  className="bg-ivory-50 border border-ivory-300 rounded-xl overflow-hidden shadow-xs flex flex-col justify-between"
                >
                  <div className="relative aspect-square bg-ivory-200">
                    <img
                      src={image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      className="absolute top-3 right-3 p-2 bg-ivory-50/90 hover:bg-white rounded-full text-red-500 shadow-sm"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-sage-600 font-semibold">
                        {product.category?.name || 'Apothecary'}
                      </p>
                      <Link
                        to={`/product/${product.slug}`}
                        className="font-serif text-base font-semibold text-charcoal-900 hover:text-sage-700 block truncate mt-0.5"
                      >
                        {product.name}
                      </Link>
                      <p className="text-xs font-semibold text-charcoal-900 mt-1">
                        ₹{product.price?.toLocaleString('en-IN')}
                      </p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-ivory-200">
                      <button
                        onClick={() => addToCart(product, null, 1)}
                        className="w-full bg-charcoal-800 hover:bg-charcoal-900 text-ivory-50 text-xs font-semibold py-2 rounded flex items-center justify-center space-x-1"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Move to Bag</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
