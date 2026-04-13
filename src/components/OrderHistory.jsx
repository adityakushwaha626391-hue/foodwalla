import React, { useState, useEffect } from 'react';

function OrderHistory({ onSectionChange }) {
  const [orders, setOrders] = useState([]);

  //  IMAGE MAPPING - Real food images ye abhi  vo bala map nahi hai ye free use kar le baad me real kharidunga 
  const getFoodImage = (itemName) => {
    const imageMap = {
      'Pizza': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100&h=100&fit=crop&round=12',
      'Burger': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&h=100&fit=crop&round=12',
      'Fries': 'https://images.unsplash.com/photo-1621996346565-e3adc652c2bb?w=100&h=100&fit=crop&round=12',
      'Biryani': 'https://images.unsplash.com/photo-1688831571330-0b72e3e82f67?w=100&h=100&fit=crop&round=12',
      'Noodles': 'https://images.unsplash.com/photo-1603484779267-78083b38384e?w=100&h=100&fit=crop&round=12',
      'Dosa': 'https://images.unsplash.com/photo-1579586140626-0e9868953c4f?w=100&h=100&fit=crop&round=12',
      'Idli': 'https://images.unsplash.com/photo-1628075614728-7fa95f10e319?w=100&h=100&fit=crop&round=12',
      'Thali': 'https://images.unsplash.com/photo-1654066242438-7566fa377c81?w=100&h=100&fit=crop&round=12',
      'default': 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=100&h=100&fit=crop&round=12'
    };
    
    const key = itemName.slice(0, 6).toLowerCase();
    return imageMap[key] || imageMap['default'];
  };

  useEffect(() => {
    const loadOrders = () => {
      try {
        const savedOrders = localStorage.getItem('userOrders');
        let realOrders = [];
        
        if (savedOrders && savedOrders !== '[]') {
          realOrders = JSON.parse(savedOrders);
          //  ADD MISSING IMAGES TO REAL ORDERS
          realOrders = realOrders.map(order => ({
            ...order,
            items: order.items.map(item => ({
              ...item,
              image: getFoodImage(item.name)
            }))
          }));
          console.log(' LOADED REAL ORDERS WITH IMAGES:', realOrders.length);
        } else {
          // Test orders with images
          const testOrders = [
            {
              id: "FW-TEST1",
              restaurant: "Pizza Palace - Vijay Nagar",
              total: 299,
              status: "delivered",
              date: "Today", 
              time: "12:08 PM",
              itemsCount: 1,
              items: [{ 
                name: "Margherita Pizza", 
                price: 299, 
                quantity: 1,
                image: getFoodImage('Pizza')
              }]
            },
            {
              id: "FW-TEST2",
              restaurant: " Burger King - AB Road",
              total: 349,
              status: "confirmed",
              date: "Today",
              time: "11:45 AM",
              itemsCount: 2,
              items: [
                { 
                  name: "Cheese Burger", 
                  price: 199, 
                  quantity: 1,
                  image: getFoodImage('Burger')
                },
                { 
                  name: "French Fries", 
                  price: 150, 
                  quantity: 1,
                  image: getFoodImage('Fries')
                }
              ]
            }
          ];
          localStorage.setItem('userOrders', JSON.stringify(testOrders));
          realOrders = testOrders;
        }

        setOrders(realOrders.reverse());
        
      } catch (error) {
        console.error(' Error:', error);
        setOrders([{
          id: "FW-ERROR",
          restaurant: " FoodWalla Test",
          total: 199,
          status: "delivered",
          date: "Today",
          time: "12:08 PM",
          itemsCount: 1,
          items: [{ 
            name: "Test Pizza", 
            price: 199, 
            quantity: 1,
            image: getFoodImage('Pizza')
          }]
        }]);
      }
    };

    loadOrders();
    const interval = setInterval(loadOrders, 3000);
    return () => clearInterval(interval);
  }, []);

  const trackOrder = (order) => {
    localStorage.setItem('trackingOrder', JSON.stringify(order));
    onSectionChange('tracking');
  };

  const goHome = () => onSectionChange('home');

  const deleteOrder = (orderId) => {
    if (window.confirm(`Delete order #${orderId.slice(-6)}?`)) {
      const updatedOrders = orders.filter(order => order.id !== orderId);
      setOrders(updatedOrders);
      localStorage.setItem('userOrders', JSON.stringify(updatedOrders));
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '40px 20px', background: '#f8fafc' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ 
          fontSize: '44px', fontWeight: 'bold', 
          background: 'linear-gradient(90deg, #f97316, #ea580c)', 
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' 
        }}>
           My Orders ({orders.length})
        </h1>
        <p style={{ fontSize: '18px', color: '#64748b' }}>
          Latest orders from Indore restaurants
        </p>
      </div>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '100px 40px' }}>
          <div style={{ fontSize: '80px', marginBottom: '24px' }}>📦</div>
          <h2 style={{ fontSize: '32px' }}>No Orders Yet</h2>
          <button onClick={goHome} style={{
            padding: '16px 32px', background: '#f97316', color: 'white',
            border: 'none', borderRadius: '12px', fontSize: '18px', fontWeight: 'bold'
          }}>
            🍽️ Continue Shopping
          </button>
        </div>
      ) : (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {orders.map((order, index) => (
            <div key={order.id} style={{
              background: index === 0 ? '#fef7ed' : 'white',
              borderRadius: '24px', padding: '32px', marginBottom: '24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.08)', position: 'relative'
            }}>
              <button onClick={() => deleteOrder(order.id)} style={{
                position: 'absolute', top: '20px', right: '20px',
                width: '48px', height: '48px', background: '#ef4444',
                color: 'white', border: 'none', borderRadius: '12px',
                fontSize: '20px', cursor: 'pointer'
              }}>
                🗑️
              </button>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingRight: '80px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{
                    width: '72px', height: '72px', 
                    background: index === 0 ? '#f97316' : '#3b82f6',
                    borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <span style={{ color: 'white', fontSize: '22px' }}>
                      #{order.id.slice(-6)}
                    </span>
                  </div>
                  <div>
                    <h2 style={{ fontSize: '28px', fontWeight: 'bold' }}>{order.restaurant}</h2>
                    <div style={{ fontSize: '36px', color: '#059669' }}>₹{order.total}</div>
                  </div>
                </div>
                <div>
                  <span style={{
                    padding: '8px 16px', background: '#dbeafe', color: '#1e40af',
                    borderRadius: '20px', fontWeight: 'bold'
                  }}>{order.status}</span>
                  <div style={{ color: '#64748b' }}>{order.date} | {order.time}</div>
                </div>
              </div>

              <div style={{ margin: '24px 0' }}>
                <h3 style={{ fontSize: '20px', marginBottom: '16px' }}>
                  Items ({order.itemsCount})
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
                  {order.items.slice(0, 3).map((item, i) => (
                    <div key={i} style={{
                      display: 'flex', gap: '16px', padding: '16px', 
                      background: '#f8fafc', borderRadius: '12px'
                    }}>
                      {/*  REAL IMAGE */}
                      <img 
                        src={item.image || getFoodImage(item.name)} 
                        alt={item.name}
                        style={{ 
                          width: '64px', height: '64px', 
                          borderRadius: '12px', objectFit: 'cover',
                          fallback: 'https://via.placeholder.com/64?text=🍕'
                        }}
                        onError={(e) => {
                          e.target.src = getFoodImage(item.name);
                          e.target.style.background = '#f3f4f6';
                        }}
                      />
                      <div>
                        <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                        <div style={{ fontSize: '18px', color: '#059669' }}>
                          ₹{item.price} x{item.quantity}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button onClick={() => trackOrder(order)} style={{
                  padding: '14px 28px', 
                  background: 'linear-gradient(45deg, #8b5cf6, #ec4899)',
                  color: 'white', border: 'none', borderRadius: '12px', 
                  fontWeight: 'bold', cursor: 'pointer'
                }}>
              {/* temporary type fack map type   */}
                  📱 Track Live
                </button>
                <button onClick={goHome} style={{
                  padding: '14px 28px', 
                  background: 'linear-gradient(45deg, #10b981, #059669)',
                  color: 'white', border: 'none', borderRadius: '12px', 
                  fontWeight: 'bold', cursor: 'pointer'
                }}>
                  🏠 Shop More
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderHistory;
