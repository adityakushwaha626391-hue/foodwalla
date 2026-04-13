import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

export default function AdminDashboard() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [connectionStatus, setConnectionStatus] = useState('loading');

  //  STATS CALCULATE
  const calculateStats = useCallback((data) => {
    const total = data.length;
    const pending = data.filter(r => r.status === 'pending').length;
    const approved = data.filter(r => r.status === 'approved').length;
    const rejected = data.filter(r => r.status === 'rejected').length;
    setStats({ total, pending, approved, rejected });
  }, []);

  //  lLOAD ONLY REAL DATA (No demo, no fake)
  const fetchRestaurants = async () => {
    setLoading(true);
    
    try {
      // Backend first
      const response = await axios.get('http://localhost:5001/api/admin/restaurants', { 
        timeout: 3000 
      });
      setRestaurants(response.data.restaurants || []);
      calculateStats(response.data.restaurants || []);
      setConnectionStatus('live');
      
    } catch (error) {
      // ONLY REAL LOCALSTORAGE DATA (PartnerRegistration se)
      const localDataRaw = localStorage.getItem('restaurantsData');
      
      if (localDataRaw) {
        const localData = JSON.parse(localDataRaw);
        //  \FILTER: Sirf PartnerRegistration format wale
        const realRegistrations = localData.filter(restaurant => 
          restaurant.name && 
          restaurant.ownerName && 
          restaurant.phone && 
          restaurant.email && 
          restaurant.city &&
          restaurant.registeredAt
        );
        
        setRestaurants(realRegistrations);
        calculateStats(realRegistrations);
        setConnectionStatus('local');
        
      } else {
        setRestaurants([]);
        setStats({ total: 0, pending: 0, approved: 0, rejected: 0 });
        setConnectionStatus('empty');
      }
      
    } finally {
      setLoading(false);
    }
  };

  // Auto refresh
  useEffect(() => {
    fetchRestaurants();
    const interval = setInterval(fetchRestaurants, 10000);
    return () => clearInterval(interval);
  }, []);

  
  const updateStatus = async (id, status) => {
    setRestaurants(prev => prev.map(r => 
      r.id === id ? { ...r, status } : r
    ));
    
    // Update localStorage
    const updated = restaurants.map(r => r.id === id ? { ...r, status } : r);
    localStorage.setItem('restaurantsData', JSON.stringify(updated));
    
    toast.success(`${status.toUpperCase()} ✅`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-orange-400 border-t-transparent mx-auto mb-8"></div>
          <h2 className="text-3xl font-bold">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Status */}
      <div className={`fixed top-0 left-1/2 -translate-x-1/2 w-72 z-50 p-4 rounded-b-2xl shadow-xl text-center font-bold ${
        connectionStatus === 'live' ? 'bg-green-500 text-white' :
        connectionStatus === 'local' ? 'bg-blue-500 text-white' :
        'bg-gray-500 text-white'
      }`}>
        {connectionStatus === 'live' && '🟢 LIVE'}
        {connectionStatus === 'local' && '🔵 LOCAL'}
        {connectionStatus === 'empty' && '⚪ EMPTY'}
        {stats.pending > 0 && ` (${stats.pending} Pending)`}
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-orange-900 text-white pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-black bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                🔐 Partner Dashboard
              </h1>
              <p className="text-xl mt-2">Real registrations only</p>
            </div>
            <button 
              onClick={fetchRestaurants}
              className="bg-white text-gray-900 px-8 py-4 rounded-2xl font-bold shadow-2xl hover:shadow-3xl"
            >
              🔄 REFRESH
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mb-12">
          {[
            { value: stats.total, label: 'Total', color: 'orange' },
            { value: stats.pending, label: 'Pending', color: 'yellow' },
            { value: stats.approved, label: 'Approved', color: 'green' },
            { value: stats.rejected, label: 'Rejected', color: 'red' }
          ].map(({ value, label, color }, i) => (
            <div key={i} className={`bg-white p-8 rounded-3xl shadow-2xl border-l-8 border-${color}-500`}>
              <p className="text-4xl font-black text-gray-900">{value}</p>
              <p className="text-sm text-gray-600 uppercase font-bold">{label}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl shadow-3xl overflow-hidden">
          <div className="p-8 bg-gradient-to-r from-orange-50 to-yellow-50 border-b">
            <h2 className="text-3xl font-bold text-gray-900">📋 Registration Requests</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left font-bold text-lg">Restaurant</th>
                  <th className="px-6 py-4 text-left font-bold text-lg">Owner</th>
                  <th className="px-6 py-4 text-left font-bold text-lg">Contact</th>
                  <th className="px-6 py-4 text-left font-bold text-lg">Location</th>
                  <th className="px-6 py-4 text-left font-bold text-lg">Status</th>
                  <th className="px-6 py-4 text-left font-bold text-lg">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {restaurants.map((restaurant) => (
                  <tr key={restaurant.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-500 text-white rounded-2xl flex items-center justify-center font-bold text-xl">
                          {restaurant.name?.[0] || 'R'}
                        </div>
                        <div>
                          <div className="font-bold text-lg">{restaurant.name}</div>
                          <div className="text-orange-600 font-medium">{restaurant.category || restaurant.cuisine}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold">{restaurant.ownerName}</td>
                    <td className="px-6 py-4">
                      <div>{restaurant.phone}</div>
                      <div className="text-sm text-gray-500">{restaurant.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold">{restaurant.city}</div>
                      <div className="text-sm">{restaurant.address}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                        restaurant.status === 'approved' ? 'bg-green-100 text-green-800' :
                        restaurant.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {restaurant.status?.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {restaurant.status === 'pending' ? (
                        <>
                          <button 
                            onClick={() => updateStatus(restaurant.id, 'approved')}
                            className="px-4 py-2 bg-green-500 text-white rounded-xl font-bold mr-2 hover:bg-green-600"
                          >
                            ✅
                          </button>
                          <button 
                            onClick={() => updateStatus(restaurant.id, 'rejected')}
                            className="px-4 py-2 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600"
                          >
                            
                          </button>
                        </>
                      ) : (
                        <span className="text-sm text-gray-500">Done</span>
                      )}
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(JSON.stringify(restaurant, null, 2));
                          toast.success('Copied!');
                        }}
                        className="ml-2 px-3 py-1 bg-blue-500 text-white text-sm rounded-lg"
                      >
                        📋
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {restaurants.length === 0 && (
          <div className="text-center py-32">
            <div className="w-24 h-24 bg-gray-100 rounded-3xl mx-auto mb-8 flex items-center justify-center">
              <span className="text-4xl">📭</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">No Registrations</h2>
            <p className="text-lg text-gray-600 mb-8">Partner page se registration ka wait karo</p>
            <button 
              onClick={fetchRestaurants}
              className="bg-orange-500 text-white px-8 py-3 rounded-2xl font-bold"
            >
              🔄 Check Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
