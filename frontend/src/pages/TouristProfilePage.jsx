import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Mail, Phone, Calendar, User, Star } from 'lucide-react';

const TouristProfilePage = () => {
  const { id } = useParams();
  const [tourist, setTourist] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTourist = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/users/${id}/with-requests`, { credentials: 'include' });
        const data = await res.json();
        if (data.status === 'success') {
          setTourist(data.data.user);
          setRequests(data.data.requests);
        } else {
          setError(data.message || 'Failed to fetch tourist');
        }
      } catch (err) {
        setError('Failed to fetch tourist');
      }
      setLoading(false);
    };
    fetchTourist();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div></div>;
  }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;
  }
  if (!tourist) return null;

  // Find latest or active request with assigned guide
  const activeRequest = requests.find(r => r.assignedGuide && ['assigned', 'in-progress'].includes(r.status));
  const assignedGuide = activeRequest?.assignedGuide;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-8">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-lg p-8 mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <img src={tourist.profilePicture || tourist.avatar} alt="Tourist" className="w-20 h-20 rounded-full object-cover border" />
          <div>
            <h2 className="text-2xl font-bold">{tourist.name}</h2>
            <p className="text-gray-600 flex items-center"><User className="h-4 w-4 mr-1" /> Tourist</p>
          </div>
        </div>
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-700"><Mail className="h-4 w-4 mr-2" /> {tourist.email}</div>
          {tourist.phone && <div className="flex items-center text-gray-700"><Phone className="h-4 w-4 mr-2" /> {tourist.phone}</div>}
          {tourist.country && <div className="flex items-center text-gray-700"><span className="font-medium mr-2">Country:</span> {tourist.country}</div>}
          {tourist.gender && <div className="flex items-center text-gray-700"><span className="font-medium mr-2">Gender:</span> {tourist.gender}</div>}
          <div className="flex items-center text-gray-700"><Calendar className="h-4 w-4 mr-2" /> Joined: {new Date(tourist.createdAt).toLocaleDateString()}</div>
        </div>
        {/* Assigned Guide Section */}
        {assignedGuide && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-4">
              <img src={assignedGuide.profilePicture || assignedGuide.avatar} alt="Guide" className="w-14 h-14 rounded-full object-cover border" />
              <div>
                <h3 className="text-lg font-semibold text-blue-900">Assigned Guide</h3>
                <p className="text-blue-800 font-medium">{assignedGuide.name}</p>
                <p className="text-gray-600 text-xs">{assignedGuide.email}</p>
                <p className="text-gray-600 text-xs">{assignedGuide.phone}</p>
                <Link to={`/guides/${assignedGuide._id}`} className="text-blue-600 hover:underline text-xs font-medium">View Full Guide Profile</Link>
                <div className="flex items-center mt-1 text-yellow-500 text-xs">
                  <Star className="h-4 w-4 mr-1" /> {assignedGuide.rating || 4.5}
                </div>
              </div>
            </div>
            {assignedGuide.specialties && (
              <div className="mt-2 text-xs text-gray-700">Specialties: {assignedGuide.specialties.join(', ')}</div>
            )}
            {assignedGuide.languages && (
              <div className="text-xs text-gray-700">Languages: {assignedGuide.languages.join(', ')}</div>
            )}
            {assignedGuide.bio && (
              <div className="text-xs text-gray-700 mt-1">Bio: {assignedGuide.bio}</div>
            )}
          </div>
        )}
        {/* Requests List */}
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Tour Requests</h3>
          {requests.length === 0 ? (
            <p className="text-gray-500 text-sm">No requests found for this tourist.</p>
          ) : (
            <ul className="space-y-2">
              {requests.map((req, i) => (
                <li key={req._id} className="bg-gray-50 rounded-md p-3 text-sm">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">{req.tourType}</span> - {req.status}
                      <span className="ml-2 text-xs text-gray-400">{new Date(req.createdAt).toLocaleDateString()}</span>
                    </div>
                    {req.assignedGuide && (
                      <Link to={`/guides/${req.assignedGuide._id}`} className="text-blue-600 hover:underline text-xs font-medium">Guide: {req.assignedGuide.name}</Link>
                    )}
                  </div>
                  {req.selectedDestinations && req.selectedDestinations.length > 0 && (
                    <div className="text-xs text-gray-600 mt-1">
                      Destinations: {req.selectedDestinations.map(d => d.name).join(', ')}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default TouristProfilePage;
