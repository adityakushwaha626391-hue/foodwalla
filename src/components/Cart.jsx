import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

export default function Cart({ onContinueShopping, onProceedToPayment }) {
  const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const [showSummary, setShowSummary] = useState(false);

  const subtotal = getCartTotal();
  const deliveryFee = subtotal > 0 ? 30 : 0;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryFee + tax;

  // IMAGE FALLBACK HELPER
  const getSafeImage = (image) => {
    if (image && image.trim() && !image.includes('via.placeholder.com')) {
      return image;
    }
    return `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=64&h=64&fit=crop`;
  };

  //  RAZORPAY 
  const handleRealPayment = () => {
    if (cart.length === 0) return;
    
    // Pass total amount to RazorpayPayment.jsx
    onProceedToPayment(total);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-orange-100 py-20 text-center">
        <div className="text-8xl mb-6">🛒</div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Your Cart is Empty</h1>
        <p className="text-xl text-gray-600 mb-8">Add some tasty food from restaurants first.</p>
        <button
          onClick={onContinueShopping}
          className="bg-orange-500 text-white px-10 py-4 text-lg font-bold rounded-2xl hover:bg-orange-600 shadow-xl"
        >
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 fade-in">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 flex items-center gap-3">
        🛒 Shopping Cart 
        <span className="text-orange-500 bg-orange-100 px-3 py-1 rounded-full text-sm font-semibold">
          {cart.length} items
        </span>
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/*  ITEMS WITH IMAGES */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
            {cart.map((item, index) => (
              <div key={item.id || index} className="flex gap-6 pb-6 border-b border-gray-100 last:border-b-0 mb-6 slide-in">
                {/*  FIXED IMAGE SECTION */}
                <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-lg flex-shrink-0 bg-gradient-to-br from-orange-50 to-yellow-50">
                  <img 
                    src={getSafeImage(item.image)}
                    alt={item.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = getSafeImage(null);
                    }}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-xl text-gray-800 mb-2 line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-orange-600 font-black text-2xl mb-4">
                    ₹{(item.price || 0).toFixed(0)}
                  </p>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3 mb-4">
                    <button
                      onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                      className="w-14 h-14 rounded-2xl bg-gray-100 hover:bg-gray-200 font-bold text-xl transition-all shadow-md flex items-center justify-center"
                    >
                      −
                    </button>
                    <span className="font-black text-2xl min-w-[3rem] text-center text-gray-800">
                      {item.quantity || 1}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                      className="w-14 h-14 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-xl transition-all shadow-xl flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="text-right flex flex-col items-end justify-center">
                  <p className="font-black text-2xl text-gray-800 mb-3">
                    ₹{((item.price || 0) * (item.quantity || 1)).toFixed(0)}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* REAL RAZORPAY PAYMENT  */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-3xl p-8 shadow-2xl h-fit sticky top-8">
          <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
            💳 Secure Payment
          </h3>
          
          <div className="space-y-4 mb-8">
            <div className="flex justify-between text-lg">
              <span>Subtotal ({cart.length} items)</span>
              <span className="font-bold">₹{subtotal.toFixed(0)}</span>
            </div>
            <div className="flex justify-between text-lg">
              <span>Delivery Fee</span>
              <span className="font-bold">₹{deliveryFee}</span>
            </div>
            <div className="flex justify-between text-lg">
              <span>Tax (5%)</span>
              <span className="font-bold">₹{tax}</span>
            </div>
            <hr className="border-white/30 my-4" />
            <div className="flex justify-between text-3xl font-black">
              <span>Total</span>
              <span>₹{total.toFixed(0)}</span>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={onContinueShopping}
              className="w-full bg-white/20 backdrop-blur-xl px-6 py-4 rounded-2xl font-bold text-lg hover:bg-white/30 transition-all border border-white/30"
            >
              Continue Shopping
            </button>
            
            {/*   RAZORPAY BUTTON */}
            <button
              onClick={handleRealPayment}
              disabled={cart.length === 0}
              className="w-full bg-white text-orange-600 px-6 py-4 rounded-2xl font-black text-xl shadow-2xl hover:shadow-3xl hover:bg-orange-50 transition-all duration-300 flex items-center justify-center gap-3 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12" />
              </svg>
              Pay ₹{total.toFixed(0)} Securely
            </button>
          </div>

          {/*  PAYMENT TRUST HOGA */}
          <div className="mt-6 pt-6 border-t border-white/30">
            <p className="text-xs text-white/80 text-center mb-3">🛡️ Secure Payments</p>
            <div className="flex justify-center gap-4">
              <span className="text-xs bg-white/20 px-3 py-1 rounded-full">Razorpay</span>
              <span className="text-xs bg-white/20 px-3 py-1 rounded-full">SSL</span>
              <span className="text-xs bg-white/20 px-3 py-1 rounded-full">256-bit</span>
            </div>
          </div>
        </div>
      </div>

      {/*  FREE DELIVERY INFO */}
      <div className="mt-12 text-center bg-white rounded-3xl shadow-2xl p-8 border border-green-100">
        <div className="text-5xl mb-4">🚚</div>
        <h3 className="text-2xl font-bold text-green-700 mb-2">Free Delivery!</h3>
        <p className="text-lg text-gray-600">Order above ₹99 for free delivery across your city</p>
      </div>
    </div>
  );
}
