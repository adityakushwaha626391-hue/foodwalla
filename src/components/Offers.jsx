import React from 'react';

export default function Offers() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 fade-in">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Special Offers</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg p-6 text-white">
          <h3 className="text-2xl font-bold mb-2">50% Off</h3>
          <p className="mb-4">On orders above ₹200</p>
          <p className="text-sm">Use code: SAVE50</p>
        </div>
        <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-lg p-6 text-white">
          <h3 className="text-2xl font-bold mb-2">Free Delivery</h3>
          <p className="mb-4">On orders above ₹500</p>
          <p className="text-sm">No coupon needed</p>
        </div>
        <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg p-6 text-white">
          <h3 className="text-2xl font-bold mb-2">₹100 Off</h3>
          <p className="mb-4">On your first order</p>
          <p className="text-sm">Use code: FIRST100</p>
        </div>
        <div className="bg-gradient-to-br from-pink-400 to-pink-600 rounded-lg p-6 text-white">
          <h3 className="text-2xl font-bold mb-2">Combo Deals</h3>
          <p className="mb-4">Best value for money</p>
          <p className="text-sm">Combo @ ₹299</p>
        </div>
      </div>
    </div>
  );
}
