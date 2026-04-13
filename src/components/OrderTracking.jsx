import React, { useState, useEffect, useRef } from 'react';

function OrderTracking({ onSectionChange }) {
  const [order, setOrder] = useState(null);
  const [liveStatus, setLiveStatus] = useState('confirmed');
  const [deliveryPartner, setDeliveryPartner] = useState({
    name: 'Ramesh',
    vehicle: 'Hero Splendor',
    phone: '98765-43210',
    distance: '3.2',
    eta: '12'
  });
  
  const [showReview, setShowReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [previewPhoto, setPreviewPhoto] = useState('');
  const fileInputRef = useRef(null);
  
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const restaurantPos = { lat: 22.7196, lng: 75.8577 };
  const [deliveryPos, setDeliveryPos] = useState({ lat: 22.7100, lng: 75.8500 });

  const statuses = [
    { id: 'confirmed', label: '✅ Order Confirmed', progress: 25 },
    { id: 'preparing', label: '👨‍🍳 Preparing Food', progress: 50 },
    { id: 'out-for-delivery', label: '🚚 Out for Delivery', progress: 75 },
    { id: 'delivered', label: '🎉 Delivered!', progress: 100 }
  ];

  //  IMAGE FUNCTION - TOP ME ADD
  const getFoodImage = (name, index) => {
    const images = [
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100&h=100&fit=crop&round=16', // Pizza
      'https://images.unsplash.com/photo-1626074961196-c8c9ba5d031e?w=100&h=100&fit=crop&round=16', // Bread
      'https://images.unsplash.com/photo-1572490478982-22f6b8d3d1e1?w=100&h=100&fit=crop&round=16', // Coffee
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&h=100&fit=crop&round=16'  // Burger aur bhi add kar lunga baad me
    ];
    return images[index % images.length];
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setPreviewPhoto(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const submitReview = () => {
    if (rating === 0) return;
    
    const reviewData = {
      orderId: order.id,
      restaurant: order.restaurant,
      rating, reviewText, previewPhoto,
      timestamp: new Date().toISOString()
    };

    const reviews = JSON.parse(localStorage.getItem('userReviews') || '[]');
    reviews.push(reviewData);
    localStorage.setItem('userReviews', JSON.stringify(reviews));

    alert(`Thank you! ${rating}/5 ⭐ submitted!`);
    setRating(0); setReviewText(''); setPreviewPhoto(''); setShowReview(false);
    setTimeout(() => onSectionChange('orders'), 1000);
  };

  useEffect(() => {
    if (liveStatus === 'delivered') {
      setTimeout(() => setShowReview(true), 2000);
    }
  }, [liveStatus]);

  //  MAP SETUP
  useEffect(() => {
    if (!window.L) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);

      link.onload = () => {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        document.head.appendChild(script);
        script.onload = initMap;
      };
    } else {
      initMap();
    }
  }, []);

  const initMap = () => {
    if (window.L && mapRef.current && !mapRef.current._leaflet_id) {
      const map = window.L.map(mapRef.current).setView([22.7196, 75.8577], 14);
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
      
      window.L.marker([restaurantPos.lat, restaurantPos.lng], {
        icon: window.L.divIcon({html: '🍕', iconSize: [40, 40], iconAnchor: [20, 20]})
      }).addTo(map).bindPopup('Pizza Palace');
      
      markerRef.current = window.L.marker([deliveryPos.lat, deliveryPos.lng], {
        icon: window.L.divIcon({html: '🚚', iconSize: [40, 40], iconAnchor: [20, 20]})
      }).addTo(map);
      
      mapRef.current.map = map;
    }
  };

  //  TRACKING ANIMATION
  useEffect(() => {
    const interval = setInterval(() => {
      const idx = statuses.findIndex(s => s.id === liveStatus);
      if (idx < statuses.length - 1) {
        setLiveStatus(statuses[idx + 1].id);
        
        setDeliveryPos(prev => {
          const newLat = prev.lat + (restaurantPos.lat - prev.lat) * 0.1;
          const newLng = prev.lng + (restaurantPos.lng - prev.lng) * 0.1;
          if (markerRef.current && mapRef.current?.map) {
            markerRef.current.setLatLng([newLat, newLng]);
            mapRef.current.map.panTo([newLat, newLng]);
          }
          return { lat: newLat, lng: newLng };
        });

        setDeliveryPartner(prev => ({
          ...prev,
          distance: Math.max(0, parseFloat(prev.distance) - 0.3).toFixed(1),
          eta: Math.max(0, parseInt(prev.eta) - 1)
        }));
      }
    }, 2500);
    return () => clearInterval(interval);
  }, [liveStatus]);

  //  FIXED ORDER LOADING WITH IMAGES
  useEffect(() => {
    const trackingOrder = localStorage.getItem('trackingOrder');
    let loadedOrder;
    
    if (trackingOrder) {
      loadedOrder = JSON.parse(trackingOrder);
      console.log(' Tracking Order loaded:', loadedOrder);
    } else {
      // Default order
      loadedOrder = {
        id: "FW" + Date.now().toString().slice(-6),
        restaurant: "🍕 Pizza Palace - Vijay Nagar, Indore",
        total: 599,
        items: []
      };
    }
    
    //  GUARANTEE IMAGES FOR EVERY ITEM
    const orderWithImages = {
      ...loadedOrder,
      items: loadedOrder.items.length > 0 
        ? loadedOrder.items.map((item, index) => ({
            ...item,
            image: item.image || getFoodImage(item.name, index)
          }))
        : [ // Default items if empty
            { name: "Margherita Pizza", price: 299, quantity: 1, image: getFoodImage('pizza', 0) },
            { name: "Garlic Bread", price: 149, quantity: 2, image: getFoodImage('bread', 1) }
          ]
    };
    
    console.log('✅ FINAL ORDER WITH IMAGES:', orderWithImages);
    setOrder(orderWithImages);
  }, []);

  const goBack = () => onSectionChange('orders');
  const currentStatusObj = statuses.find(s => s.id === liveStatus);

  if (!order) {
    return <div style={{padding: '40px', textAlign: 'center', color: '#64748b'}}>
      <div style={{fontSize: '48px', marginBottom: '24px'}}>🚀</div>
      Loading Order Details...
    </div>;
  }

  return (
    <>
      <div style={{ minHeight: '100vh', padding: '20px', background: '#f8fafc' }}>
        {/* Header */}
        <div style={{ position: 'relative', textAlign: 'center', marginBottom: '32px' }}>
          <button onClick={goBack} style={{
            position: 'absolute', left: 0, top: 0,
            padding: '12px 20px', background: '#6b7280', color: 'white',
            border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer'
          }}>
            ← Back
          </button>
          <h1 style={{ 
            fontSize: '44px', fontWeight: 'bold', 
            background: 'linear-gradient(90deg, #8b5cf6, #ec4899)', 
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            margin: '0 100px'
          }}>
            📱 Live Tracking
          </h1>
          <p style={{ fontSize: '18px', color: '#64748b', margin: '8px 0' }}>
            Order #{order.id.slice(-6)} • ₹{order.total}
          </p>
        </div>

        {/* Progress Bar */}
        <div style={{ maxWidth: '600px', margin: '0 auto 32px' }}>
          <div style={{ 
            height: '12px', background: '#e5e7eb', 
            borderRadius: '6px', overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{
              height: '100%', width: `${currentStatusObj.progress}%`,
              background: 'linear-gradient(90deg, #10b981, #059669)',
              borderRadius: '6px', transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
            }} />
          </div>
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <span style={{
              padding: '12px 24px', background: '#dcfce7', color: '#166534',
              borderRadius: '24px', fontWeight: 'bold', fontSize: '18px',
              boxShadow: '0 4px 12px rgba(16,185,129,0.2)'
            }}>
              {currentStatusObj.label}
            </span>
          </div>
        </div>

        {/* OpenStreetMap */}
        <div style={{ 
          maxWidth: '600px', margin: '0 auto 24px',
          height: '300px', background: '#e0f2fe',
          borderRadius: '20px', overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          position: 'relative'
        }}>
          <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
          <div style={{
            position: 'absolute', top: '12px', left: '12px',
            background: 'rgba(255,255,255,0.95)', padding: '8px 12px',
            borderRadius: '12px', fontSize: '14px', fontWeight: '500', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            📍 {deliveryPartner.distance}km away • ETA: {deliveryPartner.eta}min
          </div>
        </div>

        {/*  ORDER ITEMS - PERFECT IMAGES */}
        <div style={{ maxWidth: '600px', margin: '0 auto 24px' }}>
          <div style={{ 
            background: 'white', borderRadius: '20px', 
            padding: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{ fontSize: '20px', marginBottom: '20px', color: '#374151' }}>
              📦 Order Items ({order.items.length})
            </h3>
            {order.items.map((item, i) => (
              <div key={i} style={{ 
                display: 'flex', gap: '16px', padding: '20px', 
                background: '#f8fafc', borderRadius: '16px', marginBottom: '12px',
                border: '1px solid #e5e7eb', transition: 'all 0.2s'
              }}>
                {/*  IMAGE - GUARANTEED TO SHOW */}
                <img 
                  src={item.image || getFoodImage(item.name, i)}
                  alt={item.name}
                  style={{ 
                    width: '72px', height: '72px', 
                    borderRadius: '14px', objectFit: 'cover',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    background: '#f3f4f6'
                  }}
                  onError={(e) => {
                    e.target.src = getFoodImage(item.name || 'default', i);
                  }}
                  loading="lazy"
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ 
                    fontWeight: 'bold', fontSize: '16px', 
                    marginBottom: '4px', color: '#1f2937'
                  }}>
                    {item.name}
                  </div>
                  <div style={{ 
                    color: '#059669', fontSize: '18px', fontWeight: '600'
                  }}>
                    ₹{item.price} × {item.quantity}
                  </div>
                </div>
              </div>
            ))}
            <div style={{ 
              fontSize: '24px', fontWeight: 'bold', 
              textAlign: 'center', color: '#1f2937', 
              padding: '16px', background: '#f0fdf4', 
              borderRadius: '12px', mt: '12px'
            }}>
              💰 Total: ₹{order.total}
            </div>
          </div>
        </div>

        {/* Delivery Partner */}
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ 
            background: 'white', borderRadius: '20px', 
            padding: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>🚚</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
              {deliveryPartner.name}
            </div>
            <div style={{ color: '#64748b', fontSize: '16px', marginBottom: '8px' }}>
              {deliveryPartner.vehicle} • {deliveryPartner.phone}
            </div>
            <div style={{ 
              color: '#059669', fontSize: '18px', fontWeight: '500',
              background: '#dcfce7', padding: '8px 16px', borderRadius: '20px'
            }}>
              📍 {deliveryPartner.distance}km away
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {showReview && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', 
          justifyContent: 'center', zIndex: 1000, padding: '20px'
        }}>
          <div style={{
            background: 'white', maxWidth: '500px', width: '100%', 
            borderRadius: '24px', padding: '40px', textAlign: 'center',
            boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '16px', color: '#10b981' }}>✅</div>
            <h2 style={{ fontSize: '28px', marginBottom: '8px', color: '#1f2937' }}>
              Order Delivered Successfully!
            </h2>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '24px' }}>
              {[5,4,3,2,1].map(star => (
                <button key={star} onClick={() => setRating(star)} style={{
                  fontSize: '48px', background: 'none', border: 'none', cursor: 'pointer',
                  color: star <= rating ? '#facc15' : '#d1d5db'
                }}>⭐</button>
              ))}
            </div>
            <textarea 
              value={reviewText} 
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Tell us about your experience..." 
              style={{
                width: '100%', height: '100px', padding: '16px', borderRadius: '12px',
                border: '2px solid #e5e7eb', marginBottom: '20px', resize: 'vertical',
                fontFamily: 'inherit', fontSize: '16px'
              }} 
            />
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={() => setShowReview(false)} style={{
                padding: '14px 28px', background: '#6b7280', color: 'white',
                border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer'
              }}>
                Skip
              </button>
              <button onClick={submitReview} disabled={rating === 0} style={{
                padding: '14px 28px', background: rating ? '#10b981' : '#9ca3af',
                color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold',
                cursor: rating ? 'pointer' : 'not-allowed'
              }}>
                Submit Review ({rating}/5 ⭐)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default OrderTracking;
