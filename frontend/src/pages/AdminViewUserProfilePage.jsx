import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useParams } from 'react-router-dom';

const AdminViewUserProfilePage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get(`/admin/users/${id}`);
        setUser(response.data.data.user);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [id]);

  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">{error}</div>;
  }

  if (!user) {
    return <div className="text-center p-8">User not found.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{user.name}'s Profile</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <p><strong>Country:</strong> {user.country || 'N/A'}</p>
        <p><strong>Phone:</strong> {user.phone || 'N/A'}</p>
        {user.role === 'guide' && (
          <>
            <h2 className="text-xl font-semibold mt-4">Guide Details</h2>
            <p><strong>Specialties:</strong> {user.specialties?.join(', ') || 'N/A'}</p>
            <p><strong>Languages:</strong> {user.languages?.join(', ') || 'N/A'}</p>
            <p><strong>Experience:</strong> {user.experience || 'N/A'}</p>
            <p><strong>Rating:</strong> {user.rating || 'N/A'}</p>
            <p><strong>Location:</strong> {user.location || 'N/A'}</p>
            <p><strong>Verification Status:</strong> {user.verificationStatus}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminViewUserProfilePage;
