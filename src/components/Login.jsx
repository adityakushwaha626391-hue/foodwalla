import React, { useState } from 'react';
import axios from 'axios';

export default function Login({ onLoginSuccess, setCurrentSection }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('🔐 Login attempt:', formData.email);
      
      // FIXED: Demo credentials - FORCE Admin role
      if (formData.email === 'admin@foodwalla.com' && formData.password === 'admin123') {
        const adminUser = { role: 'admin', email: formData.email };
        console.log(' Creating ADMIN user:', adminUser); // DEBUG
        
        localStorage.setItem('user', JSON.stringify(adminUser));
        alert(' Admin Login Successful!');
        
        //  FIXED: Direct call (no optional chaining issue)
        if (onLoginSuccess) onLoginSuccess(adminUser);
        if (setCurrentSection) setCurrentSection('admin');
        return;
      }
      
      if (formData.email === 'customer@foodwalla.com' && formData.password === 'customer123') {
        const customerUser = { role: 'customer', email: formData.email };
        localStorage.setItem('user', JSON.stringify(customerUser));
        alert(' Customer Login Successful!');
        
        if (onLoginSuccess) onLoginSuccess(customerUser);
        if (setCurrentSection) setCurrentSection('home');
        return;
      }

      // Real API call
      const response = await axios.post('http://localhost:5001/api/auth/login', formData);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('token', response.data.token);
      
      alert(' Login Successful!');
      if (onLoginSuccess) onLoginSuccess(response.data.user);
      
    } catch (error) {
      console.error(' Login failed:', error);
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        
        {/* Logo & Title */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl flex items-center justify-center shadow-2xl">
            <img 
              src="https://user-gen-media-assets.s3.amazonaws.com/seedream_images/4cd41e8c-bf7e-4154-8c61-f07449a59a0d.png" 
              alt="FoodWalla" 
              className="w-16 h-16 object-contain"
            />
          </div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
            Welcome Back
          </h1>
          <p className="text-xl text-gray-600">Login to your FoodWalla account</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50">
          
          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-400 rounded-2xl">
              <p className="font-semibold text-red-800 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Email Field */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Email Address</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@foodwalla.com"
                className="w-full p-4 pl-12 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-200 focus:border-orange-400 transition-all text-lg bg-gradient-to-r from-orange-50 to-yellow-50" 
                required 
              />
              <svg className="absolute left-4 top-[3.2rem] w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            </div>

            {/* Password Field */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Password</label>
              <input 
                type={showPassword ? "text" : "password"} 
                name="password" 
                value={formData.password}
                onChange={handleChange}
                placeholder="admin123"
                className="w-full p-4 pl-12 pr-12 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-200 focus:border-orange-400 transition-all text-lg bg-gradient-to-r from-orange-50 to-yellow-50" 
                required 
              />
              <svg className="absolute left-4 top-[3.2rem] w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-4 top-[3.2rem] text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {showPassword ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L19.8 19.8M15 9a3 3 0 11-6 0 3 3 0 016 0z" />
                  )}
                </svg>
              </button>
            </div>

            {/* Login Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 text-white py-4 rounded-2xl font-black text-xl shadow-2xl hover:shadow-3xl hover:from-orange-600 hover:to-orange-800 transition-all duration-300 transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
            >
              {loading ? (
                <>
                  <div className="w-7 h-7 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing In...
                </>
              ) : (
                <>
                  <svg className="w-7 h-7 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Login Securely
                </>
              )}
            </button>
          </form>

          {/*  Demo ke liye Credentials - Clickable */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="font-semibold text-gray-700 mb-4">🧪 Quick Demo Login:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                onClick={() => {
                  setFormData({ email: 'admin@foodwalla.com', password: 'admin123' });
                  setError('');
                }}
                className="p-3 bg-red-50 border-2 border-red-200 rounded-2xl hover:bg-red-100 transition text-left"
              >
                <div className="font-bold text-red-800">🛡️ Admin</div>
                <div className="text-sm text-red-600">admin@foodwalla.com</div>
                <div className="text-xs">admin123</div>
              </button>
              <button 
                onClick={() => {
                  setFormData({ email: 'customer@foodwalla.com', password: 'customer123' });
                  setError('');
                }}
                className="p-3 bg-blue-50 border-2 border-blue-200 rounded-2xl hover:bg-blue-100 transition text-left"
              >
                <div className="font-bold text-blue-800">👤 Customer</div>
                <div className="text-sm text-blue-600">customer@foodwalla.com</div>
                <div className="text-xs">customer123</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
