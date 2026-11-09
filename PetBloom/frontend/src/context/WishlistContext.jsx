import React, { createContext, useContext, useState, useEffect } from 'react';
import { wishlistService } from '../services/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const saved = localStorage.getItem('petbloom_wishlist') || localStorage.getItem('paw_ritual_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('petbloom_wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  useEffect(() => {
    const fetchBackendWishlist = async () => {
      if (isAuthenticated) {
        try {
          const res = await wishlistService.getWishlist();
          if (res.data.success && res.data.wishlist?.items) {
            const formatted = res.data.wishlist.items.map((it) => it.product);
            setWishlistItems(formatted);
          }
        } catch (e) {
          console.warn('Backend wishlist fetch failed:', e.message);
        }
      }
    };

    fetchBackendWishlist();
  }, [isAuthenticated]);

  const toggleWishlist = async (product) => {
    const exists = wishlistItems.some((p) => p.id === product.id);

    if (exists) {
      setWishlistItems((prev) => prev.filter((p) => p.id !== product.id));
    } else {
      setWishlistItems((prev) => [...prev, product]);
    }

    if (isAuthenticated) {
      try {
        await wishlistService.toggleWishlist(product.id);
      } catch (e) {
        console.warn('Backend toggle wishlist error:', e.message);
      }
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some((p) => p.id === productId);
  };

  const removeFromWishlist = async (productId) => {
    setWishlistItems((prev) => prev.filter((p) => p.id !== productId));
    if (isAuthenticated) {
      try {
        await wishlistService.removeItem(productId);
      } catch (e) {
        console.warn('Backend remove wishlist error:', e.message);
      }
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistCount: wishlistItems.length,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
