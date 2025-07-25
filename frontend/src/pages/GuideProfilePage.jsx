import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const GuideProfilePage = () => {
  const { id } = useParams();
  const [guide, setGuide] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/guides/${id}`);
        setGuide(res.data.data.guide);
        setReviews(res.data.data.reviews);
      } catch (err) {
        setError('Failed to load guide profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchGuide();
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!guide) return <div className="p-8 text-center">Guide not found.</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md mt-8">
      <div className="flex items-center mb-6">
        <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 border mr-6">
          {guide.profilePicture ? (
            <img src={guide.profilePicture} alt="Profile" className="w-full h-full object-cover" />
          ) : guide.googleId ? (
            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(guide.name || 'Guide')}&background=0D8ABC&color=fff`} alt="Google Avatar" className="w-full h-full object-cover" />
          ) : (
            <span className="text-2xl font-bold text-blue-600 flex items-center justify-center h-full">{guide.name?.charAt(0) || 'G'}</span>
          )}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{guide.name}</h2>
          <p className="text-gray-600">{guide.country}</p>
          <p className="text-gray-600 capitalize">Gender: {guide.gender || 'Not specified'}</p>
        </div>
      </div>
      <div className="mb-4">
        <h3 className="font-semibold">Experience</h3>
        <p className="bg-gray-50 rounded-md p-3 text-gray-900">{guide.experience || 'Not provided'}</p>
      </div>
      <div className="mb-4">
        <h3 className="font-semibold">Certificates</h3>
        <ul className="bg-gray-50 rounded-md p-3 text-gray-900 list-disc list-inside">
          {Array.isArray(guide.certificates) && guide.certificates.length > 0 ? guide.certificates.map((c, i) => (
            <li key={i}>{typeof c === 'string' ? c : c?.title || JSON.stringify(c)}</li>
          )) : <li>None</li>}
        </ul>
      </div>
      <div className="mb-4">
        <h3 className="font-semibold">Completed Trips</h3>
        <p className="bg-gray-50 rounded-md p-3 text-gray-900">{guide.completedTrips ?? 0}</p>
      </div>
      <div className="mb-4">
        <h3 className="font-semibold">Languages</h3>
        <p className="bg-gray-50 rounded-md p-3 text-gray-900">{guide.languages?.join(', ') || 'Not specified'}</p>
      </div>
      <div className="mb-4">
        <h3 className="font-semibold">Bio</h3>
        <p className="bg-gray-50 rounded-md p-3 text-gray-900">{guide.bio || 'No bio available.'}</p>
      </div>
      <div>
        <h3 className="font-semibold mb-2">Reviews</h3>
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          <ul className="space-y-2">
            {reviews.map((review, i) => (
              <li key={i} className="bg-gray-50 rounded-md p-3">
                <div className="font-semibold">{review.touristName || 'Tourist'}</div>
                <div className="text-yellow-500">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div>
                <div className="text-gray-800 mt-1">{review.comment || ''}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default GuideProfilePage;
