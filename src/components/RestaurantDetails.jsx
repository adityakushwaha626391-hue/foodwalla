import React, { useContext } from 'react';
import { toast } from 'react-hot-toast';
import { CartContext } from '../context/CartContext';

const getSafeImage = (image, name = 'Food') => {
  if (image && image.trim() && !image.includes('via.placeholder.com')) {
    return image;
  }
  return `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&fit=crop&text=${encodeURIComponent(name)}`;
};

export default function RestaurantDetails({ restaurant, items, onBack }) {
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = (item) => {
    addToCart(item);
    toast.success(`✅ Added ${item.name} to cart! 🛒`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/*  BACK BUTTON + HEADER */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          <button 
            onClick={onBack}
            className="mb-6 bg-orange-500 text-white px-6 py-3 rounded-2xl font-bold hover:bg-orange-600 shadow-lg transition-all flex items-center gap-2"
          >
            ← Back to Home
          </button>
          
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-2xl flex-shrink-0">
              <img 
                src={getSafeImage(restaurant.image, restaurant.name)}
                alt={restaurant.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 line-clamp-2">
                {restaurant.name}
              </h1>
              
              {/*  SPECIALTY BADGE */}
              {restaurant.specialtyType && (
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-2xl inline-block text-lg font-bold mb-4 shadow-lg">
                  {restaurant.specialtyType.toUpperCase()} SPECIALIST 
                  <span className="ml-2 bg-white/20 px-3 py-1 rounded-full text-sm">
                    ({items.length || restaurant.itemCount || 0}+ items)
                  </span>
                </div>
              )}
              
              <div className="flex flex-wrap gap-4 text-sm mb-4">
                {restaurant.rating && (
                  <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold">
                    ⭐ {restaurant.rating} (2.5k)
                  </span>
                )}
                {restaurant.deliveryTime && (
                  <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
                    {restaurant.deliveryTime} delivery
                  </span>
                )}
                <span className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full">
                  Free delivery
                </span>
              </div>
            </div>
          </div>
        </div>

        {/*  FILTERED MENU GRID - SIRF PIZZA/BURGER ITEMS */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-8 border-b border-gray-100">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Menu ({items.length || 0} items)
            </h2>
            {restaurant.specialtyType && (
              <p className="text-lg text-gray-600">
                Best {restaurant.specialtyType} in town! 🔥
              </p>
            )}
          </div>

          <div className="p-8">
            {items.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {items.map((item, idx) => (
                  <div 
                    key={item.id || idx}
                    className="group bg-gradient-to-b from-white to-gray-50 p-6 rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all border hover:border-orange-200 cursor-pointer"
                  >
                    <div className="w-full h-48 rounded-2xl overflow-hidden mb-4 group-hover:scale-105 transition-transform">
                      <img 
                        src={getSafeImage(item.image, item.name)}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <h3 className="font-bold text-xl text-gray-800 mb-3 line-clamp-2">
                      {item.name}
                    </h3>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-green-600">
                        ₹{item.price || 199}
                      </span>
                      <span className="text-yellow-500 font-semibold text-lg">⭐ 4.7</span>
                    </div>
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(item);
                      }}
                      className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:from-orange-600 hover:to-orange-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      <span>🛒</span>
                      ADD TO CART
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-orange-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-3xl">🍕</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">No items available</h3>
                <p className="text-gray-600 mb-6">Menu will be updated soon</p>
                <button 
                  onClick={onBack}
                  className="bg-orange-500 text-white px-8 py-3 rounded-2xl font-bold hover:bg-orange-600"
                >
                  ← Back to Home
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
