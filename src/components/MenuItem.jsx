import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';

const MenuItem = ({ item }) => {
  const { addToCart } = useContext(CartContext);

  //   Sabse pehle check karo item valid hai ya nahi available hai ki nahi
  if (!item) {
    return (
      <div className="p-4 text-center text-gray-500 border border-gray-200 rounded-2xl">
        Item data not available
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(item); // jetzt bhi null check upar ho chuka hai
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all border border-gray-100 flex flex-col justify-between h-full">
      <div>
        <img
          src={item.image || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&fit=crop'}
          alt={item.name || 'Food item'}
          className="w-full h-40 object-cover rounded-xl mb-4 shadow-sm"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&fit=crop';
          }}
        />
        <h3 className="font-bold text-xl mb-1 text-gray-800">
          {item.name || 'Unnamed food'}
        </h3>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">
          {item.description || 'Delicious meal prepared with fresh ingredients.'}
        </p>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <p className="text-orange-600 font-black text-2xl">
            ₹{item.price || 0}
          </p>
          <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-lg font-bold">
            ★ 4.2
          </span>
        </div>

        <button
          onClick={handleAddToCart}
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-6 rounded-2xl font-bold text-lg shadow-md hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          🛒 ADD TO CART
        </button>
      </div>
    </div>
  );
};

export default MenuItem;
