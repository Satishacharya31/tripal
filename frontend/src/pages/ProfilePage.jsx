import React, { useState } from 'react';
import { User, Mail, Phone, Globe, Edit2, Save, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { apiPaths } from '../utils/apiPaths';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    country: user.country || '',
    gender: user.gender || '',
    profilePicture: user.profilePicture || '',
    experience: user.experience || '',
    certificates: user.certificates || [],
    completedTrips: user.completedTrips || 0
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    const dataToSave = {
      ...formData,
      profileIncomplete: false,
    };
    try {
      await updateProfile(dataToSave);
      setIsEditing(false);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to update profile. Please try again.' });
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      country: user.country || ''
    });
    setIsEditing(false);
    setMessage(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account information</p>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-md ${
            message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' :
            'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center bg-gray-100 border">
                {formData.profilePicture || user.profilePicture ? (
                  <img src={formData.profilePicture || user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                ) : user.googleId ? (
                  <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=0D8ABC&color=fff`} alt="Google Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-bold text-blue-600">{user.name?.charAt(0) || 'U'}</span>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                <p className="text-gray-600 capitalize">{user.role}</p>
                <p className="text-sm text-gray-500">
                  Member since {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                <Edit2 className="h-4 w-4" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>

          {/* Profile Information */}
          <div className="space-y-6">
            {/* Profile Picture Upload */}
            {isEditing && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
                <input type="file" accept="image/*" onChange={async e => {
                  const file = e.target.files[0];
                  if (!file) return;
                  setMessage(null);
                  setLoading(true);
                  const formDataUpload = new FormData();
                  formDataUpload.append('image', file);
                  try {
                    const res = await api.post(apiPaths.upload, formDataUpload, {
                      headers: {
                        'Content-Type': 'multipart/form-data',
                      },
                    });
                    if (res.data.status === 'success') {
                      setFormData(prev => ({ ...prev, profilePicture: res.data.url }));
                      setMessage({ type: 'success', text: 'Image uploaded!' });
                    } else {
                      setMessage({ type: 'error', text: res.data.message || 'Upload failed' });
                    }
                  } catch (err) {
                    setMessage({ type: 'error', text: 'Image upload failed. Try again.' });
                  }
                  setLoading(false);
                }} />
              </div>
            )}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="h-4 w-4 inline mr-2" />
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
                  />
                ) : (
                  <p className="p-3 bg-gray-50 rounded-md text-gray-900">{user.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="h-4 w-4 inline mr-2" />
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
                  />
                ) : (
                  <p className="p-3 bg-gray-50 rounded-md text-gray-900">{user.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="h-4 w-4 inline mr-2" />
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
                  />
                ) : (
                  <p className="p-3 bg-gray-50 rounded-md text-gray-900">{user.phone || 'Not provided'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Globe className="h-4 w-4 inline mr-2" />
                  Country
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
                  />
                ) : (
                  <p className="p-3 bg-gray-50 rounded-md text-gray-900">{user.country || 'Not provided'}</p>
                )}
              </div>

              {/* Gender Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                {isEditing ? (
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                ) : (
                  <p className="p-3 bg-gray-50 rounded-md text-gray-900 capitalize">{user.gender || 'Not specified'}</p>
                )}
              </div>

              {/* Guide-specific fields */}
              {user.role === 'guide' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                    {isEditing ? (
                      <textarea
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
                        rows={2}
                        placeholder="Describe your experience"
                      />
                    ) : (
                      <p className="p-3 bg-gray-50 rounded-md text-gray-900">{user.experience || 'Not provided'}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Certificates / Certifications</label>
                    {isEditing ? (
                      <textarea
                        name="certificates"
                        value={Array.isArray(formData.certificates) ? formData.certificates.map(c => c.name).join('\n') : ''}
                        onChange={e => setFormData(prev => ({ ...prev, certificates: e.target.value.split('\n').map(name => ({ name, issuedBy: 'N/A' })) }))}
                        className="w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
                        rows={2}
                        placeholder="List certificates, one per line"
                      />
                    ) : (
                      <ul className="p-3 bg-gray-50 rounded-md text-gray-900 list-disc list-inside">
                        {Array.isArray(user.certificates) && user.certificates.length > 0 ? user.certificates.map((c, i) => (
                          <li key={i}>{typeof c === 'string' ? c : c?.title || JSON.stringify(c)}</li>
                        )) : <li>None</li>}
                      </ul>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Completed Trips</label>
                    {isEditing ? (
                      <input
                        type="number"
                        name="completedTrips"
                        value={formData.completedTrips}
                        min={0}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="p-3 bg-gray-50 rounded-md text-gray-900">{user.completedTrips ?? 0}</p>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  onClick={handleCancel}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="h-4 w-4" />
                  <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Account Information */}
        <div className="bg-white rounded-xl shadow-md p-8 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600">Account Role</span>
              <span className="font-medium text-gray-900 capitalize">{user.role}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600">Member Since</span>
              <span className="font-medium text-gray-900">
                {new Date(user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-gray-600">Account Status</span>
              <span className="font-medium text-green-600">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
