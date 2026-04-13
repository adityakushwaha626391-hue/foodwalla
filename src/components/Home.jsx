import React, { useState, useContext } from 'react';
import { toast } from 'react-hot-toast';
import { CartContext } from '../context/CartContext';
import { restaurants as restaurantsData } from '../data/restaurantsData';

export default function Home({ onSectionChange, handleRestaurantSelect }) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [openCategory, setOpenCategory] = useState(null);
  const { addToCart } = useContext(CartContext);
  const restaurants = Array.isArray(restaurantsData) ? restaurantsData : [];

  const getSafeImage = (image, name = 'Food') => {
    if (image && image.trim() && !image.includes('via.placeholder.com')) {
      return image;
    }
    return `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&fit=crop&text=${encodeURIComponent(name)}`;
  };

  //  CATEGORIES WITH FILTERED FOODS
  const categories = [
    { 
      id: 'pizza',
      
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=96&h=96&fit=crop',
      foods: restaurants.flatMap(r => (r.items || []).filter(item => 
        item.name?.toLowerCase().includes('pizza')
      ))
    },
    { 
      id: 'burger', 
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=96&h=96&fit=crop',
      foods: restaurants.flatMap(r => (r.items || []).filter(item => 
        item.name?.toLowerCase().includes('burger')
      ))
    },
    { 
      id: 'chinese',
      image: 'https://tse3.mm.bing.net/th/id/OIP.2_bNBYtZxqnhhd42eqH2uQHaEK?pid=Api&h=220&P=0',
      foods: restaurants.flatMap(r => (r.items || []).filter(item => 
        item.name?.toLowerCase().includes('noodle') || 
        item.name?.toLowerCase().includes('fried rice')
      ))
    },
    { 
      id: 'desserts',
      image: 'https://tse1.mm.bing.net/th/id/OIP.KYyaVB_6lX4q0l2SdjoJcAHaDe?pid=Api&h=220&P=0',
      foods: restaurants.flatMap(r => (r.items || []).filter(item => 
        item.name?.toLowerCase().includes('cake') || 
        item.name?.toLowerCase().includes('ice')
      ))
    },
    { 
      id: 'indian',
      image: 'https://tse3.mm.bing.net/th/id/OIP.YgLvqf2gVhYLFgPmhcIs7AHaEL?pid=Api&h=220&P=0',
      foods: restaurants.flatMap(r => (r.items || []).filter(item => 
        item.name?.toLowerCase().includes('biryani') || 
        item.name?.toLowerCase().includes('dal')
      ))
    },
    { 
      id: 'healthy',
      image: 'https://tse1.mm.bing.net/th/id/OIP.OnCmA8KJB5k6SwYfiiG6uwHaE7?pid=Api&h=220&P=0',
      foods: restaurants.flatMap(r => (r.items || []).filter(item => 
        item.name?.toLowerCase().includes('salad') || 
        item.name?.toLowerCase().includes('juice')
      ))
    }
  ];

  const toggleCategory = (categoryId) => {
    setOpenCategory(openCategory === categoryId ? null : categoryId);
  };

  const handleAddFood = (food) => {
    if (addToCart && food) {
      addToCart(food);
      toast.success(`✅ Added ${food.name} to cart!`);
    }
  };

  const scroll = (direction, containerId) => {
    const container = document.getElementById(containerId);
    if (!container) return;
    const scrollAmount = 300;
    if (direction === 'left') {
      container.scrollLeft -= scrollAmount;
    } else {
      container.scrollLeft += scrollAmount;
    }
  };

  const allFoods = restaurants.flatMap(restaurant => 
    (restaurant.items || []).map(item => ({
      ...item,
      restaurantName: restaurant.name,
      restaurantId: restaurant.id,
      id: item.id || `${restaurant.id}-${item.name}-${Date.now()}`
    }))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 fade-in">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-orange-400 to-orange-600 rounded-lg p-8 text-white mb-12">
        <h2 className="text-4xl font-bold mb-4">Order Food Online</h2>
        <p className="text-lg mb-6">Discover delicious restaurants and order your favorite food</p>
        <div className="flex gap-2 max-w-md">
          <input type="text" placeholder="Search restaurants or dishes..." className="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-300" />
          <button onClick={() => onSectionChange('restaurants')} className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all shadow-md">
            🔍 Search
          </button>
        </div>
      </div>

      {/*  ISME CLEAN CIRCLE CATEGORIES */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold mb-8 text-gray-800">Categories</h3>
        
        {/*  CLEAN CIRCLES SLIDER - NO WHITE BORDER, NO NUMBERS  */}
        <div className="relative mb-8">
          <button 
            onClick={() => scroll('left', 'categoriesScroll')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition -ml-6"
          >
            ←
          </button>

          <div 
            id="categoriesScroll"
            className="flex overflow-x-auto gap-6 pb-6 scroll-smooth"
            style={{ scrollBehavior: 'smooth' }}
          >
            {categories.map((category) => (
              <div 
                key={category.id}
                className="flex-shrink-0 w-32 flex flex-col items-center cursor-pointer group hover:scale-110 transition-all duration-300"
                onClick={() => toggleCategory(category.id)}
              >
                {/*   CLEAN CIRCLE - NO BORDER, NO PADDING, NO NUMBERS */}
                <div className="w-24 h-24 rounded-full overflow-hidden shadow-2xl group-hover:shadow-3xl transition-all">
                  <img 
                    src={getSafeImage(category.image, category.name)}
                    alt={category.name}
                    className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                
                {/* Clean name - NO COUNT NUMBERS */}
                <p className="mt-3 font-bold text-sm text-gray-800 text-center px-2">
                  {category.name}
                </p>
              </div>
            ))}
          </div>

          <button 
            onClick={() => scroll('right', 'categoriesScroll')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition -mr-6"
          >
            →
          </button>
        </div>

        {/*  ONLY CLICKED CATEGORY FOODS */}
        {openCategory && categories.find(c => c.id === openCategory) && (
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-orange-100">
            {/* Header with ONLY clicked circle image */}
            <div className="p-6 bg-gradient-to-r from-orange-50 to-yellow-50 border-b flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg flex-shrink-0">
                <img 
                  src={getSafeImage(
                    categories.find(c => c.id === openCategory)?.image, 
                    categories.find(c => c.id === openCategory)?.name
                  )}
                  alt={categories.find(c => c.id === openCategory)?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="text-2xl font-bold text-gray-800">
                  {categories.find(c => c.id === openCategory)?.name}
                </h4>
                <p className="text-sm text-gray-600">Choose your favorite</p>
              </div>
              <button 
                onClick={() => setOpenCategory(null)}
                className="ml-auto text-2xl text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            {/* ONLY CLICKED CATEGORY FOODS GRID */}
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-h-96 overflow-y-auto">
                {categories.find(c => c.id === openCategory)?.foods.slice(0, 12).map((food, idx) => (
                  <div 
                    key={food.id || idx}
                    className="group bg-white p-4 rounded-2xl shadow-sm hover:shadow-xl hover:scale-105 transition-all border hover:border-orange-200 cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                        <img 
                          src={getSafeImage(food.image, food.name)}
                          alt={food.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-2">
                          {food.name}
                        </h5>
                        <p className="text-xs text-gray-500 mb-2 line-clamp-1">
                          {food.restaurantName || 'Popular Choice'}
                        </p>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-green-600 text-base">
                            ₹{food.price || 99}
                          </span>
                          <span className="text-xs text-yellow-500 font-medium">⭐ 4.5</span>
                        </div>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddFood(food);
                        }}
                        className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg hover:shadow-xl hover:from-orange-600 hover:to-orange-700 transition-all whitespace-nowrap ml-2 flex-shrink-0"
                      >
                        ADD 🛒
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Popular Foods Slider */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold mb-6 text-gray-800">Popular Foods</h3>
        <div className="relative">
          <button 
            onClick={() => scroll('left', 'foodScroll')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition -ml-6"
          >
            <i className="fas fa-chevron-left text-orange-500"></i>
          </button>

          <div 
            id="foodScroll"
            className="flex overflow-x-auto gap-4 scroll-smooth pb-4"
            style={{ scrollBehavior: 'smooth' }}
          >
            {allFoods.slice(0, 20).map((food, idx) => (
              <div
                key={food.id || idx}
                className="flex-shrink-0 w-64 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all overflow-hidden group cursor-pointer border"
              >
                <div className="w-full h-40 overflow-hidden group-hover:scale-105 transition-transform">
                  <img 
                    src={getSafeImage(food.image, food.name)}
                    alt={food.name}
                    className="w-full h-full object-cover"
                    onError={(e) => e.currentTarget.src = getSafeImage(null, food.name)}
                  />
                </div>

                <div className="p-4">
                  <h4 className="font-bold text-gray-800 text-lg mb-1 line-clamp-1">
                    {food.name}
                  </h4>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-1">
                    {food.restaurantName}
                  </p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-green-600 font-bold text-xl">
                      ₹{food.price || 99}
                    </span>
                    <span className="text-yellow-500 text-sm">⭐ 4.3</span>
                  </div>
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddFood(food);
                    }}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-4 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl hover:from-orange-600 hover:to-orange-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <span>🛒</span>
                    ADD
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={() => scroll('right', 'foodScroll')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition -mr-6"
          >
            <i className="fas fa-chevron-right text-orange-500"></i>
          </button>
        </div>
      </div>

      {/* Popular Restaurants */}
      <div>
        <h3 className="text-2xl font-bold mb-6 text-gray-800">Popular Restaurants</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.slice(0, 12).map((restaurant) => (
            <div 
              key={restaurant.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all overflow-hidden cursor-pointer group hover:scale-[1.02] border hover:border-orange-200"
              onClick={() => handleRestaurantSelect(restaurant)}
            >
              <div className="w-full h-48 overflow-hidden relative group-hover:scale-110 transition-transform duration-500">
                <img 
                  src={getSafeImage(restaurant.image, restaurant.name)}
                  alt={restaurant.name}
                  className="w-full h-full object-cover"
                  onError={(e) => e.currentTarget.src = getSafeImage(null, restaurant.name)}
                />
                <div className="absolute top-3 right-3 bg-orange-500/90 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm">
                  {restaurant.category || 'Multi-Cuisine'}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
                  {restaurant.name}
                </h3>
                <div className="flex items-center gap-3 mb-3 text-sm">
                  {restaurant.rating && (
                    <span className="text-yellow-500 font-semibold">
                      ⭐ {restaurant.rating}
                    </span>
                  )}
                  {restaurant.deliveryTime && (
                    <span className="text-gray-500">
                      • {restaurant.deliveryTime}
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {restaurant.category ? `${restaurant.category} delights` : 'Multi-cuisine delights'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
