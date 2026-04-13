import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { toast } from 'react-hot-toast'; // 🔥 TOAST IMPORT

export default function Header({ onSectionChange, user, onLogout }) {
  const { cart, cartItemCount } = useContext(CartContext); // 🔥 cartItemCount use karo
  const [mobileOpen, setMobileOpen] = useState(false);

  //  CART CLICK TOAST
  const goToCart = () => {
    if (cartItemCount > 0) {
      toast(`🛒 ${cartItemCount} items in cart`, {
        duration: 2000,
        icon: '🛒',
        style: {
          background: '#f97316',
          color: '#fff',
          fontWeight: 600
        }
      });
    }
    onSectionChange('cart');
    setMobileOpen(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    onLogout();
    setMobileOpen(false);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo yha lagana */}
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => onSectionChange('home')}
          >
            <img 
              src="https://user-gen-media-assets.s3.amazonaws.com/seedream_images/4cd41e8c-bf7e-4154-8c61-f07449a59a0d.png"
              alt="FoodWalla"
              className="h-16 w-16"
            />
            <div>
              <h1 className="text-lg font-semibold text-gray-900">FoodWalla</h1>
                           <h1>Welcome to food walla </h1> 
              <p className="text-xs text-gray-500">Fast Food Delivery</p>
            </div>
          </div>

          {/* Desktop Nav  abhi ek baar extra lga hai baad me dekh lunnga (cart ka hai) */}
          <nav className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-6">
              <button 
                onClick={() => onSectionChange('home')}
                className="text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors"
              >
                Home
              </button>
              <button 
                onClick={() => onSectionChange('restaurants')}
                className="text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors"
              >
                Restaurants
              </button>
              <button 
                onClick={() => onSectionChange('orders')}
                className="text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors"
              >
                Orders
              </button>
              <button 
                onClick={goToCart}
                className="text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors relative"
              >
                Cart
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-lg">
                    {cartItemCount}
                  </span>
                )}
              </button>
              <button 
                onClick={() => onSectionChange('offers')}
                className="text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors"
              >
                Offers
              </button>
            </div>

            {/* Auth & Cart Icon  */}
            <div className="flex items-center space-x-3 ml-8">
              {user ? (
                <>
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full font-medium">
                    {user.role === 'admin' ? 'Admin' : 'Customer'}
                  </span>
                  <button
                    onClick={() => onSectionChange('admin')}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
                  >
                    Admin
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 rounded-md transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => onSectionChange('login')}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                >
                  Sign in
                </button>
              )}
              
              <button
                onClick={() => onSectionChange('partner')}
                className="px-4 py-2 text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-md transition-colors"
              >
                Partner
              </button>

              {/* ye bala CART ICON BUTTON */}
              <button
                onClick={goToCart}
                className="relative p-3 bg-orange-50 hover:bg-orange-100 rounded-xl transition-all group"
                title="View Cart"
              >
                <svg className="w-6 h-6 text-gray-700 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1 3h10l-1-3m0 0l-1-3m1 3H7" />
                </svg>
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold shadow-lg animate-pulse">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </nav>

          {/* Mobile hamburger me bhi cleare open ho */}
          <button
            className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button
                onClick={() => { onSectionChange('home'); setMobileOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 block"
              >
                Home
              </button>
              <button
                onClick={() => { onSectionChange('restaurants'); setMobileOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 block"
              >
                Restaurants
              </button>
              <button
                onClick={() => { onSectionChange('orders'); setMobileOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 block"
              >
                Orders
              </button>
              <button
                onClick={goToCart}
                className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 block flex items-center gap-2"
              >
                🛒 Cart ({cartItemCount})
              </button>
              <button
                onClick={() => { onSectionChange('offers'); setMobileOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 block"
              >
                Offers
              </button>

              <div className="border-t border-gray-100 mt-4 pt-4">
                {user ? (
                  <>
                    <button
                      onClick={() => { onSectionChange('admin'); setMobileOpen(false); }}
                      className="w-full px-3 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 block"
                    >
                      Admin Panel
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full px-3 py-2 mt-2 rounded-md text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 block"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => { onSectionChange('login'); setMobileOpen(false); }}
                    className="w-full px-3 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 block"
                  >
                    Sign in
                  </button>
                )}
                
                <button
                  onClick={() => { onSectionChange('partner'); setMobileOpen(false); }}
                  className="w-full px-3 py-2 mt-2 rounded-md text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 block"
                >
                  Become Partner
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
