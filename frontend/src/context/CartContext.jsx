import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartService } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('petbloom_cart') || localStorage.getItem('paw_ritual_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('petbloom_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Sync with backend on login
  useEffect(() => {
    const syncBackendCart = async () => {
      if (isAuthenticated) {
        try {
          if (cartItems.length > 0) {
            const res = await cartService.syncCart(cartItems);
            if (res.data.success && res.data.cart?.items) {
              const formatted = res.data.cart.items.map((it) => ({
                id: it.id,
                productId: it.productId,
                name: it.product.name,
                slug: it.product.slug,
                price: it.variant ? it.product.price + it.variant.priceAdjustment : it.product.price,
                image: it.product.images?.[0]?.url || '',
                variantId: it.variantId,
                variantName: it.variant ? `${it.variant.name}: ${it.variant.value}` : null,
                quantity: it.quantity,
              }));
              setCartItems(formatted);
            }
          }
        } catch (err) {
          console.warn('Cart backend sync skipped:', err.message);
        }
      }
    };

    syncBackendCart();
  }, [isAuthenticated]);

  const addToCart = async (product, variant = null, quantity = 1) => {
    const effectivePrice = variant ? product.price + variant.priceAdjustment : product.price;
    const variantId = variant ? variant.id : null;
    const variantName = variant ? `${variant.name}: ${variant.value}` : null;
    const image = product.images?.[0]?.url || product.image || '';

    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (it) => it.productId === product.id && it.variantId === variantId
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prev,
          {
            id: `temp_${Date.now()}_${Math.random()}`,
            productId: product.id,
            name: product.name,
            slug: product.slug,
            price: effectivePrice,
            image,
            variantId,
            variantName,
            quantity,
          },
        ];
      }
    });

    if (isAuthenticated) {
      try {
        await cartService.addItem({
          productId: product.id,
          variantId,
          quantity,
        });
      } catch (e) {
        console.warn('Backend cart item add failed:', e.message);
      }
    }

    setIsCartOpen(true);
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCartItems((prev) =>
      prev.map((it) => (it.id === itemId ? { ...it, quantity: newQuantity } : it))
    );

    if (isAuthenticated && !itemId.startsWith('temp_')) {
      try {
        await cartService.updateItem(itemId, newQuantity);
      } catch (e) {
        console.warn('Backend cart item update failed:', e.message);
      }
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => prev.filter((it) => it.id !== itemId));

    if (isAuthenticated && !itemId.startsWith('temp_')) {
      try {
        await cartService.removeItem(itemId);
      } catch (e) {
        console.warn('Backend cart item remove failed:', e.message);
      }
    }
  };

  const clearCart = async () => {
    setCartItems([]);
    localStorage.removeItem('paw_ritual_cart');
    if (isAuthenticated) {
      try {
        await cartService.clearCart();
      } catch (e) {
        console.warn('Backend cart clear failed:', e.message);
      }
    }
  };

  const cartSubtotal = cartItems.reduce((acc, it) => acc + it.price * it.quantity, 0);
  const cartCount = cartItems.reduce((acc, it) => acc + it.quantity, 0);
  const freeShippingThreshold = 999;
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const freeShippingProgress = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartSubtotal,
        cartCount,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        freeShippingThreshold,
        amountNeededForFreeShipping,
        freeShippingProgress,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
