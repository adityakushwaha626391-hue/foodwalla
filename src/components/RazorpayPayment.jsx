import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function RazorpayPayment({ total = 100, onPaymentSuccess, onBack }) {
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('online'); // 'online' | 'cod'
  const amount = Number(total || 100);

  // Online Payment (Razorpay)
  const handleOnlinePayment = () => {
    console.log('🚀 Online payment clicked!');
    setLoading(true);

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    
    script.onload = () => {
      const options = {
        key: "rzp_live_RzJ9XZ7rDKGGSG",
        amount: Math.round(amount * 100),
        currency: "INR",
        name: "FoodWalla",
        description: `Order Payment - ₹${amount}`,
        prefill: {
          name: "Aditya Kushwaha",
          contact: "9999999999"
        },
        theme: { color: "#f97316" },
        handler: (response) => {
          console.log(' Online Payment SUCCESS:', response);
          toast.success(' Online Payment Successful!');
          onPaymentSuccess({ method: 'online', ...response });
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            toast('Payment cancelled');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    };

    document.head.appendChild(script);
  };

  // Cash on Delivery
  const handleCashOnDelivery = async () => {
    console.log(' COD selected!');
    
    // Simulate small delay for realistic feel
    setLoading(true);
    setTimeout(() => {
      toast.success(' Order Confirmed! Pay ₹' + amount + ' on Delivery');
      onPaymentSuccess({ 
        method: 'cod', 
        orderId: 'COD-' + Date.now(),
        status: 'confirmed'
      });
      setLoading(false);
    }, 1500);
  };

  const confirmPayment = () => {
    if (selectedMethod === 'online') {
      handleOnlinePayment();
    } else {
      handleCashOnDelivery();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 py-20 px-4">
      <div className="max-w-md mx-auto">
        <button 
          onClick={onBack} 
          className="mb-8 flex items-center gap-2 text-gray-700 font-bold hover:text-orange-600"
          disabled={loading}
        >
          ← Back to Cart
        </button>

        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
          <div className="text-6xl mb-6">🛒</div>
          <h1 className="text-3xl font-black text-gray-800 mb-4">Choose Payment</h1>
          
          <div className="text-4xl font-black text-green-600 mb-8 bg-green-100 px-6 py-3 rounded-2xl shadow-lg">
            ₹{amount}
          </div>

          {/* Payment Methods */}
          <div className="space-y-3 mb-8">
            {/* Online Payment */}
            <div 
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                selectedMethod === 'online' 
                  ? 'border-green-500 bg-green-50 shadow-lg' 
                  : 'border-gray-200 hover:border-orange-200'
              }`}
              onClick={() => setSelectedMethod('online')}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  selectedMethod === 'online' ? 'bg-green-500' : 'bg-gray-200'
                }`}>
                  {selectedMethod === 'online' && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                <div>
                  <div className="font-bold text-lg">💳 Online Payment</div>
                  <div className="text-sm text-gray-500">Razorpay - Cards/UPI/Wallets</div>
                </div>
              </div>
            </div>

            {/* Cash on Delivery */}
            <div 
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                selectedMethod === 'cod' 
                  ? 'border-orange-500 bg-orange-50 shadow-lg' 
                  : 'border-gray-200 hover:border-orange-200'
              }`}
              onClick={() => setSelectedMethod('cod')}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  selectedMethod === 'cod' ? 'bg-orange-500' : 'bg-gray-200'
                }`}>
                  {selectedMethod === 'cod' && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                <div>
                  <div className="font-bold text-lg">💰 Cash on Delivery</div>
                  <div className="text-sm text-gray-500">Pay when delivery boy arrives</div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={confirmPayment}
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-5 px-6 rounded-2xl text-xl font-black shadow-2xl hover:shadow-3xl hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {loading ? (
              <>⏳ Processing... </>
            ) : selectedMethod === 'online' ? (
              <> Pay ₹{amount} Online </>
            ) : (
              <> Confirm COD Order </>
            )}
          </button>

          <div className="text-xs text-gray-500 space-y-1 mt-6 p-4 bg-gray-50 rounded-xl">
            {selectedMethod === 'online' ? (
              <>
                <p> 100% Secure Payment</p>
                <p> Test: 4111 1111 1111 1111</p>
              </>
            ) : (
              <>
                <p> Delivery in 30 mins</p>
                <p> Extra ₹20 COD fee may apply</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

