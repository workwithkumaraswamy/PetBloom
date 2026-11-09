import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User as UserIcon, Menu, X, ChevronDown, ShieldCheck, LogOut, Package, MapPin, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export const Navbar = ({ onOpenSearch }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);

  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsAccountDropdownOpen(false);
    setIsShopDropdownOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    {
      name: 'Shop',
      path: '/shop',
      hasDropdown: true,
      children: [
        { name: 'All Grooming Essentials', path: '/shop' },
        { name: 'Nail Care & Clippers', path: '/shop?category=nail-care' },
        { name: 'Paw Protection & Balms', path: '/shop?category=paw-protection' },
        { name: 'Tear-Stain Care', path: '/shop?category=tear-stain-care' },
        { name: 'Coat Care & Detangling', path: '/shop?category=coat-care' },
        { name: 'Emergency Grooming Kits', path: '/shop?category=emergency-grooming-kits' },
      ],
    },
    { name: 'Grooming Essentials', path: '/grooming-guide' },
    { name: 'Emergency Kits', path: '/emergency-kits' },
    { name: 'Our Story', path: '/about' },
    { name: 'Journal', path: '/journal' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-ivory-50/95 backdrop-blur-md shadow-sm py-3 border-b border-ivory-300/60'
          : 'bg-ivory-50/80 backdrop-blur-sm py-4 border-b border-ivory-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-charcoal-700 hover:text-charcoal-900 p-1"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Luxury Brand Logo */}
          <Link to="/" className="flex flex-col items-center group text-center mx-auto lg:mx-0">
            <span className="font-serif text-2xl sm:text-3xl tracking-[0.2em] font-semibold text-charcoal-800 uppercase group-hover:text-sage-600 transition-colors">
              PetBloom
            </span>
            <span className="text-[9px] uppercase tracking-[0.35em] text-charcoal-400 font-medium -mt-0.5">
              The Art of Premium Pet Care
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              if (link.hasDropdown) {
                return (
                  <div
                    key={link.name}
                    className="relative"
                    onMouseEnter={() => setIsShopDropdownOpen(true)}
                    onMouseLeave={() => setIsShopDropdownOpen(false)}
                  >
                    <Link
                      to={link.path}
                      className={`text-xs uppercase tracking-[0.16em] font-medium transition-colors flex items-center py-2 ${
                        isActive || location.pathname.startsWith('/shop')
                          ? 'text-sage-600 font-semibold border-b-2 border-sage-600'
                          : 'text-charcoal-600 hover:text-charcoal-900'
                      }`}
                    >
                      {link.name}
                      <ChevronDown className="w-3 h-3 ml-1 text-charcoal-400" />
                    </Link>

                    {/* Shop Luxury Dropdown */}
                    {isShopDropdownOpen && (
                      <div className="absolute top-full left-0 w-64 bg-ivory-50 border border-ivory-300/80 shadow-xl rounded-md py-3 z-50 animate-fadeIn">
                        <div className="px-4 py-1.5 text-[10px] uppercase tracking-wider text-charcoal-400 font-semibold border-b border-ivory-200">
                          Curated Collections
                        </div>
                        {link.children.map((child) => (
                          <Link
                            key={child.name}
                            to={child.path}
                            className="block px-4 py-2 text-xs text-charcoal-700 hover:bg-ivory-200 hover:text-sage-700 transition-colors font-medium"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-xs uppercase tracking-[0.16em] font-medium transition-colors py-2 ${
                    isActive
                      ? 'text-sage-600 font-semibold border-b-2 border-sage-600'
                      : 'text-charcoal-600 hover:text-charcoal-900'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Action Icons: Search, Wishlist, Account, Bag */}
          <div className="flex items-center space-x-4 sm:space-x-5 text-charcoal-700">
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="p-1.5 hover:text-sage-600 transition-colors"
              title="Search apothecary products"
              aria-label="Search"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="p-1.5 hover:text-sage-600 transition-colors relative"
              title="Saved Wishlist"
              aria-label="Wishlist"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-sage-500 text-ivory-50 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Account Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                className="p-1.5 hover:text-sage-600 transition-colors flex items-center space-x-1"
                aria-label="Account menu"
              >
                <UserIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                {isAuthenticated && (
                  <span className="hidden md:inline-block text-xs font-medium text-charcoal-800">
                    {user?.firstName}
                  </span>
                )}
              </button>

              {isAccountDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-ivory-50 border border-ivory-300 shadow-xl rounded-md py-2 z-50 animate-fadeIn">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-2 border-b border-ivory-200">
                        <p className="text-xs font-semibold text-charcoal-800">
                          {user.firstName} {user.lastName || ''}
                        </p>
                        <p className="text-[11px] text-charcoal-500 truncate">{user.email}</p>
                        {user.role === 'ADMIN' && (
                          <span className="inline-block mt-1 px-1.5 py-0.5 text-[9px] bg-gold-100 text-gold-700 rounded font-semibold uppercase tracking-wider">
                            Administrator
                          </span>
                        )}
                      </div>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="flex items-center px-4 py-2 text-xs text-gold-700 font-semibold hover:bg-gold-50"
                        >
                          <LayoutDashboard className="w-3.5 h-3.5 mr-2" />
                          Admin Dashboard
                        </Link>
                      )}

                      <Link
                        to="/account"
                        className="flex items-center px-4 py-2 text-xs text-charcoal-700 hover:bg-ivory-200"
                      >
                        <UserIcon className="w-3.5 h-3.5 mr-2" />
                        My Profile
                      </Link>

                      <Link
                        to="/account/orders"
                        className="flex items-center px-4 py-2 text-xs text-charcoal-700 hover:bg-ivory-200"
                      >
                        <Package className="w-3.5 h-3.5 mr-2" />
                        Order History
                      </Link>

                      <Link
                        to="/account/addresses"
                        className="flex items-center px-4 py-2 text-xs text-charcoal-700 hover:bg-ivory-200"
                      >
                        <MapPin className="w-3.5 h-3.5 mr-2" />
                        Saved Addresses
                      </Link>

                      <div className="border-t border-ivory-200 my-1"></div>

                      <button
                        onClick={() => {
                          logout();
                          navigate('/');
                        }}
                        className="w-full flex items-center px-4 py-2 text-xs text-red-600 hover:bg-red-50 text-left"
                      >
                        <LogOut className="w-3.5 h-3.5 mr-2" />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <div className="p-3">
                      <p className="text-xs text-charcoal-600 mb-3 text-center">
                        Welcome to PetBloom. Sign in to access your curated orders.
                      </p>
                      <Link
                        to="/login"
                        className="block w-full py-2 bg-charcoal-800 hover:bg-charcoal-900 text-ivory-50 text-xs font-semibold uppercase tracking-wider text-center rounded transition-colors"
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/register"
                        className="block w-full mt-2 py-1.5 border border-charcoal-300 hover:border-charcoal-600 text-charcoal-700 text-xs text-center rounded transition-colors"
                      >
                        Create an Account
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Shopping Bag Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-1.5 hover:text-sage-600 transition-colors relative flex items-center"
              title="Shopping Bag"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="absolute -top-1 -right-1 bg-charcoal-800 text-ivory-50 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[60px] bg-ivory-50 border-b border-ivory-300 shadow-xl px-6 py-6 z-40 max-h-[80vh] overflow-y-auto animate-fadeIn">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <div key={link.name} className="border-b border-ivory-200/60 pb-3">
                <Link
                  to={link.path}
                  className="text-sm uppercase tracking-wider font-medium text-charcoal-800 hover:text-sage-600"
                >
                  {link.name}
                </Link>
                {link.children && (
                  <div className="pl-4 mt-2 space-y-2">
                    {link.children.map((child) => (
                      <Link
                        key={child.name}
                        to={child.path}
                        className="block text-xs text-charcoal-600 hover:text-sage-600"
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="pt-2 flex flex-col space-y-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/account"
                    className="py-2 text-center text-xs uppercase tracking-wider font-semibold bg-charcoal-800 text-ivory-50 rounded"
                  >
                    My Account ({user.firstName})
                  </Link>
                  <button
                    onClick={logout}
                    className="py-2 text-center text-xs text-red-600 border border-red-200 rounded"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    className="py-2.5 text-center text-xs uppercase tracking-wider font-semibold bg-charcoal-800 text-ivory-50 rounded"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="py-2.5 text-center text-xs uppercase tracking-wider font-medium border border-charcoal-400 text-charcoal-800 rounded"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
