import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Shield, Truck, RefreshCw, ShoppingBag, Heart, Check, AlertCircle, ChevronDown, ChevronUp, Share2, Sparkles } from 'lucide-react';
import { productService, reviewService } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { ProductCard } from '../components/product/ProductCard';

export const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isAdding, setIsAdding] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  // Review Form State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    authorName: '',
    petName: '',
    petBreed: '',
    rating: 5,
    title: '',
    comment: '',
  });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState('');

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await productService.getProductBySlug(slug);
        if (res.data.success) {
          const prod = res.data.product;
          setProduct(prod);
          setRelatedProducts(res.data.relatedProducts || []);
          if (prod.variants && prod.variants.length > 0) {
            setSelectedVariant(prod.variants[0]);
          } else {
            setSelectedVariant(null);
          }
          setActiveImageIndex(0);

          // Update Recently Viewed in localStorage
          try {
            const stored = JSON.parse(localStorage.getItem('paw_ritual_recently_viewed') || '[]');
            const filtered = stored.filter((p) => p.id !== prod.id);
            const updated = [prod, ...filtered].slice(0, 4);
            localStorage.setItem('paw_ritual_recently_viewed', JSON.stringify(updated));
            setRecentlyViewed(updated.filter((p) => p.id !== prod.id));
          } catch (e) {
            console.warn('Recently viewed error:', e);
          }
        }
      } catch (err) {
        setError(err.message || 'Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory-50 flex items-center justify-center py-24">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-sage-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs uppercase tracking-widest text-charcoal-500 font-medium">
            Preparing Apothecary Formulation...
          </p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-ivory-50 py-24 text-center px-4">
        <h2 className="font-serif text-3xl font-semibold text-charcoal-900 mb-2">Essential Not Found</h2>
        <p className="text-xs text-charcoal-600 mb-6">{error || 'This formulation may have been retired.'}</p>
        <Link
          to="/shop"
          className="bg-charcoal-800 text-ivory-50 text-xs uppercase tracking-widest font-semibold px-6 py-3 rounded"
        >
          Return to Curations
        </Link>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [{ url: product.image }];
  const currentImage = images[activeImageIndex]?.url || images[0]?.url;
  const isFavorited = isInWishlist(product.id);

  const effectivePrice = selectedVariant
    ? product.price + selectedVariant.priceAdjustment
    : product.price;

  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > effectivePrice
      ? Math.round(((product.compareAtPrice - effectivePrice) / product.compareAtPrice) * 100)
      : null;

  const handleAddToCart = async () => {
    setIsAdding(true);
    await addToCart(product, selectedVariant, quantity);
    setTimeout(() => setIsAdding(false), 800);
  };

  const handleBuyNow = async () => {
    await addToCart(product, selectedVariant, quantity);
    navigate('/checkout');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewSubmitting(true);
    setReviewSuccess('');
    try {
      const res = await reviewService.submitReview({
        productId: product.id,
        ...reviewForm,
      });

      if (res.data.success) {
        setReviewSuccess('Your review has been verified and published. Thank you!');
        // Refresh product reviews
        const updated = await productService.getProductBySlug(slug);
        if (updated.data.success) {
          setProduct(updated.data.product);
        }
        setTimeout(() => {
          setIsReviewModalOpen(false);
          setReviewSuccess('');
          setReviewForm({
            authorName: '',
            petName: '',
            petBreed: '',
            rating: 5,
            title: '',
            comment: '',
          });
        }, 1500);
      }
    } catch (err) {
      alert(err.message || 'Failed to submit review');
    } finally {
      setReviewSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory-50 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="text-[11px] text-charcoal-500 mb-8 flex items-center space-x-2">
          <Link to="/" className="hover:text-charcoal-900">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-charcoal-900">Shop</Link>
          <span>/</span>
          <Link to={`/shop?category=${product.category?.slug}`} className="hover:text-charcoal-900">
            {product.category?.name || 'Category'}
          </Link>
          <span>/</span>
          <span className="text-charcoal-800 font-medium truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Main Product Presentation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20 items-start">
          {/* Left Column: Image Gallery (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            {/* Primary Large Image */}
            <div className="relative aspect-4/5 w-full rounded-2xl overflow-hidden bg-ivory-100 border border-ivory-300 shadow-md">
              <img
                src={currentImage}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />

              {/* Floating Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isEmergencyKit && (
                  <span className="bg-sage-700 text-ivory-50 text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded shadow-sm">
                    Canine Emergency Kit
                  </span>
                )}
                {product.isBestseller && !product.isEmergencyKit && (
                  <span className="bg-charcoal-800 text-gold-300 text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded shadow-sm">
                    Bestseller
                  </span>
                )}
                {discountPercent && (
                  <span className="bg-gold-500 text-charcoal-950 text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded shadow-sm">
                    {discountPercent}% Off
                  </span>
                )}
              </div>

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product)}
                className={`absolute top-4 right-4 p-3 rounded-full shadow-md transition-all ${
                  isFavorited
                    ? 'bg-red-50 text-red-600 scale-105'
                    : 'bg-ivory-50/90 text-charcoal-600 hover:text-red-500 hover:bg-white'
                }`}
                title="Save to Wishlist"
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-red-600' : ''}`} />
              </button>
            </div>

            {/* Thumbnail Row */}
            {images.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-none">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                      activeImageIndex === idx
                        ? 'border-sage-600 ring-2 ring-sage-600/30'
                        : 'border-ivory-300 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Narrative, Sizing & Actions (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-sage-600 font-semibold block mb-1">
                {product.category?.name || 'Apothecary Collection'}
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-charcoal-900 tracking-tight leading-snug">
                {product.name}
              </h1>
              <p className="text-xs text-charcoal-400 mt-1">SKU: {product.sku}</p>

              {/* Rating summary */}
              <div className="flex items-center space-x-2 mt-3">
                <div className="flex text-gold-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating || 5)
                          ? 'fill-gold-400 text-gold-400'
                          : 'text-ivory-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-charcoal-800">
                  {product.rating ? product.rating.toFixed(1) : '5.0'}
                </span>
                <span className="text-xs text-charcoal-500">
                  ({product.reviews?.length || product.reviewCount || 30} verified reviews)
                </span>
              </div>
            </div>

            {/* Price Row */}
            <div className="flex items-baseline space-x-4 border-y border-ivory-200 py-4">
              <span className="text-3xl font-semibold text-charcoal-900">
                ₹{effectivePrice.toLocaleString('en-IN')}
              </span>
              {product.compareAtPrice && product.compareAtPrice > effectivePrice && (
                <>
                  <span className="text-base text-charcoal-400 line-through">
                    ₹{product.compareAtPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-sage-700 font-semibold bg-sage-50 px-2 py-0.5 rounded">
                    Save ₹{(product.compareAtPrice - effectivePrice).toLocaleString('en-IN')}
                  </span>
                </>
              )}
              <span className="text-[11px] text-charcoal-500 ml-auto font-light">
                Inclusive of all taxes
              </span>
            </div>

            {/* Short Narrative */}
            <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed font-light">
              {product.shortDescription}
            </p>

            {/* Sizing / Variant Selection */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="uppercase tracking-wider font-semibold text-charcoal-800">
                    Select {product.variants[0].name || 'Option'}:
                  </span>
                  {selectedVariant && (
                    <span className="text-sage-700 font-medium">{selectedVariant.value}</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {product.variants.map((v) => {
                    const isSelected = selectedVariant?.id === v.id;
                    return (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        className={`text-xs px-4 py-2.5 rounded-lg border transition-all ${
                          isSelected
                            ? 'border-sage-700 bg-sage-50 text-sage-900 font-semibold shadow-xs'
                            : 'border-ivory-300 bg-ivory-50 text-charcoal-700 hover:border-charcoal-400'
                        }`}
                      >
                        {v.value}
                        {v.priceAdjustment !== 0 && (
                          <span className="text-[10px] text-charcoal-500 ml-1">
                            ({v.priceAdjustment > 0 ? `+₹${v.priceAdjustment}` : `-₹${Math.abs(v.priceAdjustment)}`})
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity & CTA Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-ivory-300 rounded-lg bg-ivory-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 py-2.5 text-charcoal-600 hover:bg-ivory-200 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 text-xs font-semibold text-charcoal-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3.5 py-2.5 text-charcoal-600 hover:bg-ivory-200 transition-colors"
                  >
                    +
                  </button>
                </div>

                {/* Add to Bag */}
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding || product.stock <= 0}
                  className={`flex-1 py-3.5 rounded-lg text-xs uppercase tracking-widest font-semibold flex items-center justify-center space-x-2 transition-all shadow-md ${
                    isAdding
                      ? 'bg-sage-600 text-ivory-50'
                      : product.stock <= 0
                      ? 'bg-ivory-200 text-charcoal-400 cursor-not-allowed'
                      : 'bg-charcoal-800 hover:bg-charcoal-900 text-ivory-50'
                  }`}
                >
                  {isAdding ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Bag</span>
                    </>
                  ) : product.stock <= 0 ? (
                    <span>Sold Out</span>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Grooming Bag</span>
                    </>
                  )}
                </button>
              </div>

              {/* Buy Now Button */}
              {product.stock > 0 && (
                <button
                  onClick={handleBuyNow}
                  className="w-full bg-gold-500 hover:bg-gold-600 text-charcoal-950 text-xs uppercase tracking-widest font-semibold py-3.5 rounded-lg transition-colors shadow-sm"
                >
                  Buy Now • Instant Checkout
                </button>
              )}
            </div>

            {/* Delivery & Trust Highlights */}
            <div className="pt-4 border-t border-ivory-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-charcoal-600">
              <div className="flex items-center space-x-2">
                <Truck className="w-4 h-4 text-sage-600 shrink-0" />
                <span>Complimentary Delivery &gt; ₹999</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-sage-600 shrink-0" />
                <span>Veterinary-Guided Safety</span>
              </div>
              <div className="flex items-center space-x-2">
                <RefreshCw className="w-4 h-4 text-sage-600 shrink-0" />
                <span>14-Day Hassle-Free Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed / Accordion Details Section */}
        <div className="bg-ivory-100/70 border border-ivory-200 rounded-2xl p-6 sm:p-10 mb-20 shadow-sm">
          {/* Tab Header Buttons */}
          <div className="flex items-center space-x-3 sm:space-x-8 border-b border-ivory-200 pb-4 overflow-x-auto scrollbar-none text-xs sm:text-sm">
            {[
              { id: 'description', label: 'Description & Ritual' },
              { id: 'ingredients', label: 'Ingredients & Materials' },
              { id: 'directions', label: 'Directions for Use' },
              { id: 'safety', label: 'Veterinary Safety & Triage' },
              { id: 'shipping', label: 'Shipping & Returns' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`uppercase tracking-wider font-semibold pb-2 border-b-2 transition-all shrink-0 ${
                  activeTab === tab.id
                    ? 'border-sage-600 text-sage-800'
                    : 'border-transparent text-charcoal-500 hover:text-charcoal-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Contents */}
          <div className="pt-6 text-xs sm:text-sm text-charcoal-700 leading-relaxed font-light">
            {activeTab === 'description' && (
              <div className="space-y-4">
                <p className="whitespace-pre-line">{product.fullDescription}</p>
                {product.specifications && (
                  <div className="mt-6 pt-4 border-t border-ivory-200">
                    <h4 className="text-xs uppercase tracking-wider font-semibold text-charcoal-800 mb-3">
                      Technical &amp; Artisanal Specifications
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {Object.entries(
                        typeof product.specifications === 'string'
                          ? JSON.parse(product.specifications || '{}')
                          : product.specifications || {}
                      ).map(([key, val]) => (
                        <div key={key} className="flex justify-between py-1 border-b border-ivory-200/60">
                          <span className="text-charcoal-500">{key}:</span>
                          <span className="font-medium text-charcoal-800">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'ingredients' && (
              <div className="space-y-3">
                <h4 className="text-xs uppercase tracking-wider font-semibold text-charcoal-800">
                  Pure Botanicals &amp; Surgical Metallurgy
                </h4>
                <p className="bg-ivory-50 p-4 rounded-lg border border-ivory-200 leading-loose">
                  {product.ingredients || 'Handcrafted from pure hypoallergenic ingredients.'}
                </p>
                <p className="text-[11px] text-charcoal-500 italic">
                  *Formulated strictly without synthetic fragrances, petroleum distillates, sulfates, or parabens. Leaping Bunny cruelty-free standard compliant.
                </p>
              </div>
            )}

            {activeTab === 'directions' && (
              <div className="space-y-3">
                <h4 className="text-xs uppercase tracking-wider font-semibold text-charcoal-800">
                  Step-by-Step Grooming Ritual
                </h4>
                <div className="whitespace-pre-line bg-ivory-50 p-4 rounded-lg border border-ivory-200 leading-relaxed">
                  {product.directions || 'Gently apply as part of your pet grooming routine.'}
                </div>
              </div>
            )}

            {activeTab === 'safety' && (
              <div className="space-y-3">
                <div className="flex items-start space-x-3 bg-red-50/70 border border-red-200 p-4 rounded-lg text-red-900">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div className="text-xs leading-relaxed">
                    <h4 className="font-semibold uppercase tracking-wider mb-1">
                      Veterinary Notice &amp; Safety Precautions
                    </h4>
                    <p className="whitespace-pre-line">{product.safetyInfo}</p>
                  </div>
                </div>
                <p className="text-[11px] text-charcoal-500">
                  Always inspect paws, eyes, and skin prior to home grooming. Persistent or severe bleeding, puncture wounds, and eye discharge always require immediate evaluation by a licensed veterinarian.
                </p>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-3">
                <h4 className="text-xs uppercase tracking-wider font-semibold text-charcoal-800">
                  Complimentary Shipping &amp; White-Glove Guarantee
                </h4>
                <p>
                  All orders above ₹999 receive complimentary Express Pan-India Air delivery (3-5 business days). Orders below ₹999 carry a nominal ₹99 shipping fee.
                </p>
                <p>
                  We offer a 14-day return privilege on unopened grooming tools and salves. In the rare event of transit damage, our concierge provides an immediate replacement without hassle.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="mb-20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-4 border-b border-ivory-300">
            <div>
              <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-charcoal-900">
                Verified Guardian Reviews
              </h3>
              <p className="text-xs text-charcoal-500 mt-0.5">
                Real reflections from dog parents caring for their companions at home.
              </p>
            </div>

            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="mt-4 sm:mt-0 bg-charcoal-800 hover:bg-charcoal-900 text-ivory-50 text-xs uppercase tracking-wider font-semibold px-5 py-2.5 rounded shadow-sm"
            >
              Write a Review
            </button>
          </div>

          {/* Reviews List */}
          <div className="space-y-6">
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-ivory-100/60 border border-ivory-200 rounded-xl p-6 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex text-gold-500 mb-1">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />
                        ))}
                      </div>
                      <h4 className="font-serif text-base font-semibold text-charcoal-900">
                        "{rev.title}"
                      </h4>
                    </div>
                    <span className="text-[10px] bg-sage-100 text-sage-800 px-2 py-0.5 rounded font-medium">
                      Verified Purchase
                    </span>
                  </div>

                  <p className="text-xs text-charcoal-600 leading-relaxed font-light">
                    {rev.comment}
                  </p>

                  <div className="text-[11px] text-charcoal-400 pt-2 border-t border-ivory-200 flex items-center justify-between">
                    <span>
                      {rev.authorName}{' '}
                      {rev.petName && (
                        <span className="text-sage-700 font-medium">
                          • Parent to {rev.petName} ({rev.petBreed || 'Canine'})
                        </span>
                      )}
                    </span>
                    <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 bg-ivory-100/40 rounded-xl border border-ivory-200">
                <p className="text-xs text-charcoal-600">Be the first to share your grooming experience with {product.name}.</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products: Complete the Ritual */}
        {relatedProducts.length > 0 && (
          <div className="mb-20">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-[10px] uppercase tracking-[0.25em] text-sage-600 font-semibold block mb-1">
                Complementary Formulations
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-charcoal-900">
                Complete Your Ritual.
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}

        {/* Recently Viewed Products */}
        {recentlyViewed.length > 0 && (
          <div>
            <div className="border-t border-ivory-300 pt-12 mb-8">
              <h3 className="font-serif text-xl sm:text-2xl font-semibold text-charcoal-900">
                Recently Viewed Essentials
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentlyViewed.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Review Submission Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-charcoal-900/60 backdrop-blur-xs"
            onClick={() => setIsReviewModalOpen(false)}
          />
          <div className="relative bg-ivory-50 border border-ivory-300 w-full max-w-lg rounded-xl shadow-2xl p-6 sm:p-8 z-10 animate-fadeIn">
            <h3 className="font-serif text-2xl font-semibold text-charcoal-900 mb-1">
              Share Your Experience
            </h3>
            <p className="text-xs text-charcoal-500 mb-6">
              Reviewing: <span className="font-semibold text-charcoal-800">{product.name}</span>
            </p>

            {reviewSuccess ? (
              <div className="bg-sage-100 border border-sage-300 text-sage-900 p-4 rounded-lg text-xs text-center font-medium">
                {reviewSuccess}
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={reviewForm.authorName}
                      onChange={(e) => setReviewForm({ ...reviewForm, authorName: e.target.value })}
                      className="w-full bg-ivory-100 border border-ivory-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-sage-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                      Dog Name &amp; Breed
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Leo (Golden)"
                      value={reviewForm.petName}
                      onChange={(e) => setReviewForm({ ...reviewForm, petName: e.target.value })}
                      className="w-full bg-ivory-100 border border-ivory-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-sage-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                    Rating *
                  </label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                        className="p-1 focus:outline-none"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= reviewForm.rating
                              ? 'fill-gold-400 text-gold-400'
                              : 'text-ivory-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                    Review Headline *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. A lifesaver for black nails!"
                    value={reviewForm.title}
                    onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                    className="w-full bg-ivory-100 border border-ivory-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-sage-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                    Your Review *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell other pet guardians how this product performed..."
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    className="w-full bg-ivory-100 border border-ivory-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-sage-600"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsReviewModalOpen(false)}
                    className="px-4 py-2 border border-ivory-300 text-charcoal-600 rounded text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={reviewSubmitting}
                    className="px-6 py-2 bg-charcoal-800 text-ivory-50 rounded text-xs uppercase tracking-wider font-semibold disabled:opacity-50"
                  >
                    {reviewSubmitting ? 'Publishing...' : 'Publish Review'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
