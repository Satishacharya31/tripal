import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Phone, MapPin, Save } from 'lucide-react';

const CompleteProfilePage = () => {
  const { user, updateProfile, fetchUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    country: user?.country || '',
    role: user?.role || 'tourist',
    gender: user?.gender || '',
    experience: user?.experience || '',
    certificates: user?.certificates || [],
    completedTrips: user?.completedTrips || 0,
    profilePicture: user?.profilePicture || ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      localStorage.setItem('token', token);
      fetchUser().then(() => {
        window.history.replaceState({}, document.title, '/complete-profile');
      });
    }
  }, [fetchUser]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await updateProfile({
        ...formData,
        profileIncomplete: false,
      });

      if (result.success) {
        navigate('/dashboard');
      } else {
        console.error('Profile update failed:', result.error);
      }
    } catch (error) {
      console.error('Profile update failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Profile</h1>
          <p className="text-gray-600">
            Welcome, {user?.name}! Please provide a few more details to finish setting up your account.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Profile Picture Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
              {formData.profilePicture && (
                <div className="mb-2">
                  <img src={formData.profilePicture} alt="Preview" className="w-20 h-20 rounded-full object-cover border" />
                </div>
              )}
              <input type="file" accept="image/*" onChange={async e => {
                const file = e.target.files[0];
                if (!file) return;
                setIsLoading(true);
                const formDataUpload = new FormData();
                formDataUpload.append('image', file);
                try {
                  const res = await fetch('/api/upload', {
                    method: 'POST',
                    body: formDataUpload,
                    credentials: 'include'
                  });
                  const data = await res.json();
                  if (data.status === 'success') {
                    setFormData(prev => ({ ...prev, profilePicture: data.url }));
                  } else {
                    alert(data.message || 'Upload failed');
                  }
                } catch (err) {
                  alert('Image upload failed. Try again.');
                }
                setIsLoading(false);
              }} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">I am a</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value="tourist"
                    checked={formData.role === 'tourist'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Tourist
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value="guide"
                    checked={formData.role === 'guide'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Guide
                </label>
              </div>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your phone number"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="country"
                  name="country"
                  type="text"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your country"
                  required
                />
              </div>
            </div>

            {/* Gender Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Guide-specific fields */}
            {formData.role === 'guide' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                  <textarea
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={2}
                    placeholder="Describe your experience"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Certificates / Certifications</label>
                  <textarea
                    name="certificates"
                    value={Array.isArray(formData.certificates) ? formData.certificates.join('\n') : formData.certificates}
                    onChange={e => setFormData(prev => ({ ...prev, certificates: e.target.value.split('\n') }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={2}
                    placeholder="List certificates, one per line"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Completed Trips</label>
                  <input
                    type="number"
                    name="completedTrips"
                    value={formData.completedTrips}
                    min={0}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </>
            )}


            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  Save and Continue
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfilePage;
