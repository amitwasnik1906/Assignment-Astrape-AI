'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { cartAPI } from '@/lib/api';
import { Cart, CartContextType } from '@/types';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart(null);
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.getCart();
      setCart(response.data);
    } catch (error: any) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (itemId: string, quantity: number = 1) => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      setLoading(true);
      const response = await cartAPI.addToCart(itemId, quantity);
      setCart(response.data);
      toast.success('Item added to cart!');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to add item to cart';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (itemId: string, quantity: number) => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await cartAPI.updateCartItem(itemId, quantity);
      setCart(response.data);
      toast.success('Cart updated!');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update cart';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId: string) => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await cartAPI.removeFromCart(itemId);
      setCart(response.data);
      toast.success('Item removed from cart!');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to remove item';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!user) return;

    try {
      setLoading(true);
      await cartAPI.clearCart();
      setCart({ ...cart!, items: [], totalAmount: 0 });
      toast.success('Cart cleared!');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to clear cart';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      updateCartItem,
      removeFromCart,
      clearCart,
      loading
    }}>
      {children}
    </CartContext.Provider>
  );
};