import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { restaurants } from '../data/restaurantsData';
import { CartContext } from '../App';
import { toast } from 'react-hot-toast';

export default function RestaurantMenu() {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const restaurantData = restaurants.find(r => r.id === restaurantId);
    if (restaurantData) {
      setRestaurant(restaurantData);
      const specialtyData = localStorage.getItem(`specialty_${restaurantId}`);
      if (specialtyData) {
        const parsed = JSON.parse(specialtyData);
        setMenuItems(parsed.specialtyItems || []);
      } else {
        setMenuItems(restaurantData.items || []);
      }
    }
  }, [restaurantId]);

  const handleAddToCart = (item) => {
    addToCart({ ...item, restaurantName: restaurant?.name });
    toast.success(`✅ Added ${item.name}!`);
  };

  if (!restaurant) return <div className="text-center py-20 text-xl">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <button 
        onClick={() => navigate('/')}
        className="mb-6 bg-orange-500 text-white px-6 py-2 rounded-xl hover:bg-orange-600"
      >
        ← Back to Home
      </button>
      
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-8 rounded-3xl mb-8">
        <h1 className="text-4xl font-bold mb-2">{restaurant.name}</h1>
        <p className="text-xl">{restaurant.category || 'Multi-Cuisine'}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item, idx) => (
          <div key={item.id || idx} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl p-6">
            <img 
              src={item.image || `https://images.unsplash.com/photo-1541598947603-b796b3a16887?w=300`}
              alt={item.name}
              className="w-full h-48 object-cover rounded-xl mb-4"
            />
            <h3 className="font-bold text-xl mb-2">{item.name}</h3>
            <div className="flex justify-between mb-4">
              <span className="text-2xl text-green-600 font-bold">₹{item.price || 99}</span>
              <span className="text-yellow-500">⭐ 4.5</span>
            </div>
            <button 
              onClick={() => handleAddToCart(item)}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl font-bold"
            >
              ADD 🛒
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
