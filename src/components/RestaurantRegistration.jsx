import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function RestaurantRegistration({ onSuccess }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    ownerName: '',
    phone: '',
    email: '',
    city: 'Bhopal',
    address: '',
    cuisine: '',
    fssai: '',
    photo: null,
    photoPreview: null
  });
  const [loading, setLoading] = useState(false);

  //  FILE UPLOAD HANDLER
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.size < 5 * 1024 * 1024 && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData({
          ...formData,
          photo: file,
          photoPreview: e.target.result
        });
        toast.success(' Photo uploaded!');
      };
      reader.readAsDataURL(file);
    } else {
      toast.error;
    }
  };

  //  FORM VALIDATION
  const isStepValid = (currentStep) => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.ownerName && formData.phone && formData.email;
      case 2:
        return formData.address && formData.city;
      case 3:
        return formData.cuisine && formData.photo;
      default:
        return true;
    }
  };

  //  NEXT STEP
  const nextStep = () => {
    if (isStepValid(step)) {
      setStep(step + 1);
    } else {
      toast.error;
    }
  };

  //  PREVIOUS STEP
  const prevStep = () => {
    setStep(step - 1);
  };

  //  FINAL SUBMIT - ADMIN DASHBOARD MEIN SAVE
  const handleSubmit = async () => {
    if (!formData.cuisine || !formData.photo) {
      toast.error;
      return;
    }

    setLoading(true);
    
    //  NEW RESTAURANT DATA
    const newRestaurant = {
      id: `rest_${Date.now()}`,
      name: formData.name,
      ownerName: formData.ownerName,
      phone: formData.phone,
      email: formData.email,
      city: formData.city,
      address: formData.address,
      category: formData.cuisine,
      image: formData.photoPreview,
      rating: 4.2,
      deliveryTime: '25-35 min',
      items: [], 
      status: 'pending',
      fssai: formData.fssai || 'N/A',
      registeredAt: new Date().toLocaleDateString('en-IN')
    };

    try {
      const existing = JSON.parse(localStorage.getItem('restaurantsData') || '[]');
      const updated = [newRestaurant, ...existing];
      localStorage.setItem('restaurantsData', JSON.stringify(updated));
      
      toast.success(' Registration successful! Admin verification mein hai (24 hrs)');
      toast.success(` ${formData.name} live hone wala hai!`);
      
      onSuccess?.();
      
      // Reset form
      setFormData({
        name: '', ownerName: '', phone: '', email: '', city: 'Bhopal',
        address: '', cuisine: '', fssai: '', photo: null, photoPreview: null
      });
      setStep(1);
      
    } catch (error) {
      toast.error(' Registration failed! Try again.');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      {/*  PROGRESS BAR */}
      <div className="flex items-center justify-center mb-12">
        {[1, 2, 3].map((s, idx) => (
          <React.Fragment key={s}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold transition-all ${
              step >= s 
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-xl' 
                : 'bg-gray-200 text-gray-500'
            } ${step === s ? 'ring-4 ring-orange-200' : ''}`}>
              {s}
            </div>
            {idx < 2 && (
              <div className={`flex-1 h-1 mx-4 ${
                step > s ? 'bg-gradient-to-r from-orange-500 to-orange-600' : 'bg-gray-200'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/*  STEP 1: BASIC INFO */}
      {step === 1 && (
        <div className="bg-white rounded-3xl shadow-2xl p-10">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">1️⃣ Basic Info</h2>
          <p className="text-xl text-gray-600 mb-8">Restaurant ka basic information daalo</p>
          
          <div className="space-y-6">
            <input
              type="text"
              placeholder="Restaurant Name *"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full p-5 border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 text-xl"
            />
            <input
              type="text"
              placeholder="Owner Name *"
              value={formData.ownerName}
              onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
              className="w-full p-5 border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 text-xl"
            />
            <input
              type="tel"
              placeholder="Phone Number *"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full p-5 border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 text-xl"
            />
            <input
              type="email"
              placeholder="Email *"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full p-5 border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 text-xl"
            />
          </div>
        </div>
      )}

      {/*  STEP 2: LOCATION */}
      {step === 2 && (
        <div className="bg-white rounded-3xl shadow-2xl p-10">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">2️⃣ Location</h2>
          <p className="text-xl text-gray-600 mb-8">Restaurant ka address daalo</p>
          
          <div className="space-y-6">
            <select
              value={formData.city}
              onChange={(e) => setFormData({...formData, city: e.target.value})}
              className="w-full p-5 border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 text-xl"
            >
              <option>Bhopal</option>
              <option>Indore</option>
              <option>Delhi</option>
              <option>Mumbai</option>
            </select>
            <textarea
              rows="4"
              placeholder="Complete Address *"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              className="w-full p-5 border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 text-xl resize-none"
            />
          </div>
        </div>
      )}

      {/*  STEP 3: COMPLETE - FIXED! */}
      {step === 3 && (
        <div className="bg-white rounded-3xl shadow-2xl p-10">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">3️⃣ Complete</h2>
          <p className="text-xl text-gray-600 mb-8">Final details daalo aur submit karo! 🎯</p>
          
          <div className="space-y-6">
            {/*  CUISINE - FIXED */}
            <div>
              <label className="block text-lg font-semibold mb-3 text-gray-800">Cuisine Type *</label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {['Indian', 'Chinese', 'Pizza', 'Burger', 'Fast Food', 'South Indian', 'Continental'].map(cuisine => (
                  <button
                    key={cuisine}
                    onClick={() => setFormData({...formData, cuisine})}
                    className={`p-4 rounded-2xl font-semibold transition-all ${
                      formData.cuisine === cuisine
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-xl'
                        : 'bg-gray-100 hover:bg-gray-200 border-2 border-gray-200'
                    }`}
                  >
                    {cuisine}
                  </button>
                ))}
              </div>
            </div>

            {/*  FSSAI YAH EK NUMBER HOTA HAI  */}
            <input
              type="text"
              placeholder="FSSAI License (Optional)"
              value={formData.fssai}
              onChange={(e) => setFormData({...formData, fssai: e.target.value})}
              className="w-full p-5 border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 text-xl"
            />

            {/*  PHOTO UPLOAD - FIXED */}
            <div>
              <label className="block text-lg font-semibold mb-3 text-gray-800">Restaurant Photo *</label>
              <div className="border-2 border-dashed border-gray-300 rounded-3xl p-8 text-center hover:border-orange-400 transition-all">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="photo-upload"
                />
                <label htmlFor="photo-upload" className="cursor-pointer">
                  <div className="mb-4">
                    <span className="text-5xl mb-4 block">📸</span>
                    <p className="text-xl font-semibold text-gray-700">Click to upload photo</p>
                    <p className="text-sm text-gray-500">Max 5MB (JPG, PNG)</p>
                  </div>
                </label>
                
                {formData.photoPreview && (
                  <div className="mt-6">
                    <img 
                      src={formData.photoPreview} 
                      alt="Preview" 
                      className="w-32 h-32 object-cover rounded-2xl mx-auto shadow-xl"
                    />
                    <p className="text-green-600 font-semibold mt-2">✅ Photo Selected</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/*  NAVIGATION BUTTONS */}
      <div className="flex gap-4 mt-12 justify-center">
        {step > 1 && (
          <button
            onClick={prevStep}
            className="px-12 py-4 bg-gray-200 text-gray-800 font-bold rounded-2xl hover:bg-gray-300 transition-all text-lg flex items-center gap-2 shadow-lg"
          >
            ⬅️ Previous
          </button>
        )}
        
        {step < 3 ? (
          <button
            onClick={nextStep}
            disabled={!isStepValid(step)}
            className="px-12 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-2xl hover:from-orange-600 hover:to-orange-700 transition-all text-lg shadow-xl disabled:opacity-50 flex-1 max-w-sm"
          >
            Next Step →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading || !formData.cuisine || !formData.photo}
            className="px-16 py-5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-2xl text-xl shadow-2xl hover:shadow-3xl hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50 flex items-center gap-3"
          >
            {loading ? ' Submitting...' : ' Register Restaurant'}
          </button>
        )}
      </div>
    </div>
  );
}
