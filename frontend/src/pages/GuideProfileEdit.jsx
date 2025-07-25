import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Phone, MapPin, Book, Briefcase, Languages, Calendar, CheckSquare, AlertCircle, CheckCircle } from 'lucide-react';

const GuideProfileEdit = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        location: user.location || '',
        bio: user.bio || '',
        specialties: user.specialties || [],
        languages: user.languages || [],
        experienceYears: user.experienceYears || 1,
        experienceDetails: user.experienceDetails || '',
        available: user.available || true,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNotification(null);

    // Convert comma-separated strings to arrays
    const profileData = {
      ...formData,
      specialties: typeof formData.specialties === 'string' ? formData.specialties.split(',').map(s => s.trim()) : formData.specialties,
      languages: typeof formData.languages === 'string' ? formData.languages.split(',').map(l => l.trim()) : formData.languages,
    };

    const result = await updateProfile(profileData);
    setLoading(false);

    if (result.success) {
      setNotification({ type: 'success', message: result.message });
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } else {
      setNotification({ type: 'error', message: result.message });
    }
  };

  if (user === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Your Profile</h1>
        <p className="mt-1 text-gray-600">Keep your information up to date for tourists to see.</p>
      </div>

      {notification && (
        <div className={`mb-6 p-4 rounded-md ${
          notification.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          <div className="flex items-center">
            {notification.type === 'success' ? <CheckCircle className="h-5 w-5 mr-3" /> : <AlertCircle className="h-5 w-5 mr-3" />}
            <p>{notification.message}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-lg shadow-md">
        
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
          <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input type="text" name="phone" id="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
          <input type="text" name="location" id="location" value={formData.location} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
          <textarea name="bio" id="bio" rows="4" value={formData.bio} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"></textarea>
        </div>

        <div>
          <label htmlFor="experienceYears" className="block text-sm font-medium text-gray-700">Years of Experience</label>
          <input type="number" name="experienceYears" id="experienceYears" value={formData.experienceYears} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
        </div>

        <div>
          <label htmlFor="experienceDetails" className="block text-sm font-medium text-gray-700">Experience Details</label>
          <textarea name="experienceDetails" id="experienceDetails" rows="4" value={formData.experienceDetails} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"></textarea>
        </div>

        <div className="flex items-center">
          <input type="checkbox" name="available" id="available" checked={formData.available} onChange={handleChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
          <label htmlFor="available" className="ml-2 block text-sm text-gray-900">Available for new assignments</label>
        </div>

        <div className="flex justify-end">
          <button 
            type="submit" 
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300 flex items-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GuideProfileEdit;
