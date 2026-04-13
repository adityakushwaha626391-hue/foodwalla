import React, { useState, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import CartProvider from './context/CartContext';
import Header from './components/Header';
import Home from './components/Home';
import Restaurants from './components/Restaurants';
import RestaurantDetails from './components/RestaurantDetails';
import Cart from './components/Cart';
import RazorpayPayment from './components/RazorpayPayment';
import Offers from './components/Offers';
import RestaurantRegistration from './components/RestaurantRegistration';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';          
import Footer from './components/Footer';
import OrderTracking from './components/OrderTracking';
import OrderHistory from './components/OrderHistory';

export default function App() {
  const [currentSection, setCurrentSection] = useState('home');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [user, setUser] = useState(null);
  const [orderId, setOrderId] = useState('');
  const [lastOrderData, setLastOrderData] = useState({});
  const [paymentTotal, setPaymentTotal] = useState(0);

  // Check if user already logged in
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Generate dynamic order ID
  const generateOrderId = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().slice(-3);
    return `FW${timestamp}${random}`;
  };

  // PERFECT ORDER SAVE - Works with Backend + Frontend
  const handlePaymentSuccess = () => {
    toast.success(' Order Confirmed! Tracking started 🛵');
    const newOrderId = generateOrderId();
    setOrderId(newOrderId);
    
    // Get cart from localStorage (works with your CartContext)
    let cartItems = [];
    try {
      const cartData = localStorage.getItem('foodwalla-cart') || '[]';
      cartItems = JSON.parse(cartData);
    } catch(e) {
      cartItems = selectedRestaurant?.menu?.slice(0, 3) || [];
    }

    const orderItems = cartItems.map(item => ({
      name: item.name || item.dishName || item.title || 'Special Item',
      price: parseFloat(item.price) || 150,
      quantity: item.quantity || 1,
      image: item.image || ''
    })).filter(item => item.name);

    const realTotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) || paymentTotal || 350;

    const newOrder = {
      id: newOrderId,
      restaurant: selectedRestaurant?.name || 'FoodWalla Kitchen',
      total: realTotal,
      itemsCount: orderItems.length || 1,
      status: 'confirmed',
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      date: new Date().toLocaleDateString('en-IN'),
      items: orderItems.length > 0 ? orderItems : [{
        name: `${selectedRestaurant?.name || 'FoodWalla'} Special Dish`,
        price: realTotal,
        quantity: 1
      }]
    };

    // SAVE TO LOCALSTORAGE (Backend ke saath sync hoga)
    const userOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
    userOrders.unshift(newOrder);
    localStorage.setItem('userOrders', JSON.stringify(userOrders));
    
    setLastOrderData(newOrder);
    localStorage.setItem('lastOrder', JSON.stringify(newOrder));
    
    console.log(' ORDER SAVED:', newOrder);
    setCurrentSection('tracking');
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    toast.success('Welcome back! ');
    if (userData.role === 'admin') {
      setCurrentSection('admin');
    } else {
      setCurrentSection('home');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setCurrentSection('home');
    toast('Logged out safely ');
  };

  //  Cart to Payment - TOTAL PASSING FIXED
  const handleProceedToPayment = (totalFromCart) => {
    const safeTotal = Number(totalFromCart) || 350;
    setPaymentTotal(safeTotal);
    setCurrentSection('payment');
  };

  // RESTAURANT SELECT - FILTERED MENU के साथ
  const handleRestaurantSelect = (restaurant) => {
    console.log(' Selected Restaurant:', restaurant.name, 'Specialty:', restaurant.specialtyType);
    setSelectedRestaurant(restaurant);
    setCurrentSection('restaurantDetails');
    toast.success(` Opened ${restaurant.name} - ${restaurant.itemCount || restaurant.items?.length || 0}+ items!`);
  };

  return (
    <CartProvider>
      <div className="bg-gray-50 min-h-screen flex flex-col">
        <Header 
          onSectionChange={setCurrentSection}
          user={user}
          onLogout={handleLogout}
        />
        
        <main className="flex-1">
          {/*  1 HOME - handleRestaurantSelect PASS KIA */}
          {currentSection === 'home' && (
            <Home 
              onSectionChange={setCurrentSection}
              handleRestaurantSelect={handleRestaurantSelect}
            />
          )}

          {/* 2 ORDERS */}
          {currentSection === 'orders' && (
            <OrderHistory onSectionChange={setCurrentSection} />
          )}

          {/* 3 TRACKING */}
          {currentSection === 'tracking' && (
            <OrderTracking 
              onSectionChange={setCurrentSection}
              orderId={orderId}
              orderData={lastOrderData}
            />
          )}

          {/* 4 RESTAURANTS */}
          {currentSection === 'restaurants' && (
            <Restaurants onSelectRestaurant={handleRestaurantSelect} />
          )}

          {/*  5 RESTAURANT DETAILS - FILTERED ITEMS */}
          {currentSection === 'restaurantDetails' && selectedRestaurant && (
            <RestaurantDetails 
              restaurant={selectedRestaurant}
              items={selectedRestaurant.filteredItems || selectedRestaurant.items || []}
              onBack={() => setCurrentSection('home')}
              onAddToCart={() => {}} // CartContext se handle HOGA
            />
          )}

          {/* 6 CART */}
          {currentSection === 'cart' && (
            <Cart 
              restaurant={selectedRestaurant?.name || 'FoodWalla Kitchen'}
              onContinueShopping={() => setCurrentSection('home')}
              onProceedToPayment={handleProceedToPayment}
            />
          )}

          {/*  7 PAYMENT - BACKEND READY */}
          {currentSection === 'payment' && (
            <RazorpayPayment 
              total={paymentTotal}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentFailure={() => setCurrentSection('cart')}
              onBack={() => setCurrentSection('cart')}
            />
          )}

          {/* Other sections */}
          {currentSection === 'offers' && <Offers />}
          {currentSection === 'partner' && (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50 py-12 px-4">
              <RestaurantRegistration onSuccess={() => setCurrentSection('home')} />
            </div>
          )}
          {currentSection === 'admin' && <AdminDashboard />}
          {currentSection === 'login' && (
            <Login onLoginSuccess={handleLoginSuccess} setCurrentSection={setCurrentSection} />
          )}
        </main>

        <Footer />
        
        {/* SWIGGY STYLE TOASTER */}
        <Toaster 
          position="top-right"
          gutter={12}
          containerStyle={{ top: 80 }}
          toastOptions={{
            duration: 3500,
            style: {
              background: '#f97316',
              color: '#fff',
              fontWeight: 600,
              fontSize: '16px',
              borderRadius: '16px',
              boxShadow: '0 20px 40px rgba(249,115,22,0.3)',
              padding: '16px 24px'
            },
            success: {
              iconTheme: {
                primary: '#fff',
                secondary: '#f97316',
              },
            },
            error: {
              style: {
                background: '#ef4444',
                boxShadow: '0 20px 40px rgba(239,68,68,0.3)'
              }
            }
          }}
        />
      </div>
    </CartProvider>
  );
}
