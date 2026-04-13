import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';

const MenuItem = ({ item }) => {
  // Safe check: Context available hai ya nahi
  const cartContext = useContext(CartContext);
  const { addToCart } = cartContext || {};

  const handleAddToCart = () => {
    if (!item || !addToCart) {
      console.error(' Item or addToCart missing:', item);
      alert('Cart setup missing! Check CartProvider');
      return;
    }
    
    try {
      addToCart(item);
      // Success feedback
      console.log(' Added to cart:', item.name);
    } catch (error) {
      console.error(' Add to cart failed:', error);
    }
  };

  // Safe image URL generator
  const getSafeImage = (image) => {
    if (image && image.trim() && !image.includes('via.placeholder.com')) {
      return image;
    }
    // Real working fallbacks
    return 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&fit=crop';
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all border border-gray-100 flex flex-col justify-between h-full group">
      <div>
        <div className="w-full h-40 rounded-xl overflow-hidden mb-4 shadow-sm group-hover:scale-[1.02] transition-transform">
          <img 
            src={getSafeImage(item?.image)}
            alt={item?.name || 'Food item'}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&fit=crop';
            }}
          />
        </div>
        <h3 className="font-bold text-xl mb-1 text-gray-800 line-clamp-1">
          {item?.name || 'Delicious Food'}
        </h3>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">
          {item?.description || 'Freshly prepared with love and premium ingredients.'}
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <p className="text-orange-600 font-black text-2xl">
            ₹{item?.price || 0}
          </p>
          <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-bold shadow-sm">
            ★ {item?.rating || 4.2}
          </span>
        </div>
        
        {/*  IMPROVED ADD TO CART BUTTON */}
        <button 
          onClick={(e) => {
            e.stopPropagation(); // Parent click block
            handleAddToCart();
          }}
          disabled={!item || !addToCart}
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none group/cart"
        >
          <span className="group-hover/cart:scale-110 transition-transform">🛒</span>
          <span>ADD TO CART</span>
        </button>
      </div>
    </div>
  );
};

export default MenuItem;
