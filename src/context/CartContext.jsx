import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export const CartContext = createContext();

// Easy hook so components can use: const { cart, cartItemCount } = useCart();
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export default function CartProvider({ children }) {
  // cart is always an ARRAY of items: [{ id, name, price, quantity, ... }]
  const [cart, setCart] = useState([]);

  // Load from localStorage on start
  useEffect(() => {
    const savedCart = localStorage.getItem('foodwalla-cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch {
        setCart([]);
      }
    }
  }, []);

  // Save to localStorage when cart changes
  useEffect(() => {
    localStorage.setItem('foodwalla-cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
      setCart(cart.map(c =>
        c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
      ));
      toast.success(`+1 ${item.name.slice(0, 20)}...`, {
        icon: '➕',
        duration: 2000
      });
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
      toast.success(`${item.name.slice(0, 25)} added to cart`, {
        icon: '🛒',
        duration: 2500,
        style: {
          background: '#f97316',
          color: '#fff',
          fontWeight: 600
        }
      });
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
    toast.error('Item removed', { duration: 2000 });
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    setCart(cart.map(item =>
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => {
    setCart([]);
    toast.error('Cart cleared', { duration: 2000 });
  };

  const getCartTotal = () =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        cartItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
