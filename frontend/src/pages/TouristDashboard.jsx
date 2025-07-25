import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plus, Clock, CheckCircle, User, MapPin, Calendar, AlertCircle, Phone, Mail, Star } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

const TouristDashboard = () => {
  const { requests, guides, destinations, loading: dataLoading } = useData();
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();
  const [notification, setNotification] = useState(null);
  const [openGuideModal, setOpenGuideModal] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState(null);

  const userRequests = requests.filter(req => req.touristId === user.id);

  useEffect(() => {
    if (location.state?.message) {
      setNotification({
        type: 'success',
        message: location.state.message
      });
      setTimeout(() => setNotification(null), 5000);
    }
  }, [location.state]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'assigned': return 'text-green-600 bg-green-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return Clock;
      case 'assigned': return CheckCircle;
      case 'completed': return CheckCircle;
      default: return AlertCircle;
    }
  };

  const getAssignedGuide = (guideId) => {
    return guides.find(guide => guide.id === guideId);
  };









  // Dummy work history for demonstration; replace with real data if available
  const getGuideWorkHistory = (guideId) => {
    // In real app, fetch from backend or guide object
    return [
      { id: 1, tour: 'Everest Base Camp Trek', year: 2023, rating: 4.9 },
      { id: 2, tour: 'Annapurna Circuit', year: 2022, rating: 4.8 },
      { id: 3, tour: 'Kathmandu Heritage Tour', year: 2024, rating: 5.0 },
    ];
  };








  
  const getDestinationName = (destId) => {
    const destination = destinations.find(d => d.id === destId);
    return destination ? destination.name : `Destination ${destId}`;
  };

  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Notification */}
        {notification && (
          <div className={`mb-6 p-4 rounded-md ${
            notification.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 
            'bg-red-50 border border-red-200 text-red-800'
          }`}>
            <div className="flex">
              <CheckCircle className="h-5 w-5 mt-0.5 mr-3" />
              <p>{notification.message}</p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}! 🏔️</h1>
          <p className="text-gray-600 mt-2">Manage your guide requests and plan your next adventure in Nepal</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                <p className="text-2xl font-bold text-gray-900">
                  {userRequests.filter(req => req.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Assigned Guides</p>
                <p className="text-2xl font-bold text-gray-900">
                  {userRequests.filter(req => req.status === 'assigned').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed Tours</p>
                <p className="text-2xl font-bold text-gray-900">
                  {userRequests.filter(req => req.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>
          
          <Link 
            to="/request"
            className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:scale-105 text-white"
          >
            <div className="text-center">
              <Plus className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm font-medium">New Request</p>
              <p className="text-lg font-bold">Plan Adventure</p>
            </div>
          </Link>
        </div>

        {/* My Requests */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">My Guide Requests</h2>
            <Link 
              to="/request"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </Link>
          </div>
          
          {userRequests.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No requests yet</h3>
              <p className="text-gray-600 mb-6">Start your Nepal adventure by requesting a guide</p>
              <Link 
                to="/request"
                className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-5 w-5 mr-2" />
                Request Guide
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {userRequests.map((request) => {
                const StatusIcon = getStatusIcon(request.status);
                const assignedGuide = request.assignedGuide ? getAssignedGuide(request.assignedGuide) : null;
                
                return (
                  <div key={request.id} className="p-6 hover:bg-gray-50 transition-colors duration-200 rounded-lg">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <StatusIcon className="h-6 w-6 text-gray-400" />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 capitalize">
                            {request.tourType} Tour
                          </h3>
                          <p className="text-sm text-gray-600 flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            Submitted on {new Date(request.submittedAt).toLocaleDateString()}
                          </p>
                          {request.startDate && (
                            <p className="text-sm text-gray-600 flex items-center mt-1">
                              <Calendar className="h-4 w-4 mr-1" />
                              Preferred start: {new Date(request.startDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        {request.duration}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <User className="h-4 w-4 mr-2" />
                        {request.groupSize}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        {request.selectedDestinations.length} destinations
                      </div>
                      <div className="text-sm text-gray-600 capitalize">
                        Budget: {request.budget}
                      </div>
                    </div>

                    {/* Selected Destinations */}
                    <div className="mb-4">
                      <span className="text-sm font-medium text-gray-700">Selected Destinations:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {request.selectedDestinations.map(destId => (
                          <span key={destId} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            {getDestinationName(destId)}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {request.specialInterests && request.specialInterests.length > 0 && (
                      <div className="mb-4">
                        <span className="text-sm font-medium text-gray-700">Special Interests:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {request.specialInterests.map((interest, index) => (
                            <span key={interest.id || `interest-${index}`} className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                              {interest.name || interest}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {request.additionalRequirements && (
                      <div className="mb-4">
                        <span className="text-sm font-medium text-gray-700">Additional Requirements:</span>
                        <p className="text-sm text-gray-600 mt-1">{request.additionalRequirements}</p>
                      </div>
                    )}
                    
                    {assignedGuide && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Your Assigned Guide
                        </h4>
                        <div className="flex items-start space-x-4">
                          <img 
                            src={assignedGuide.profileImage} 
                            alt={assignedGuide.name}
                            className="w-16 h-16 rounded-full object-cover border-2 border-green-200"
                          />
                          <div className="flex-1">
                            <Link to={`/guides/${assignedGuide.id}`} className="font-medium text-green-800 text-lg hover:underline">
  {assignedGuide.name}
</Link>
                            <p className="text-sm text-green-600 flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {assignedGuide.experience} experience • {assignedGuide.location}
                            </p>
                            <p className="text-sm text-green-600">
                              Languages: {assignedGuide.languages.join(', ')}
                            </p>
                            <p className="text-sm text-green-600 flex items-center">
                              <Star className="h-3 w-3 mr-1" />
                              {assignedGuide.rating}/5.0 • {assignedGuide.completedTrips} completed trips
                            </p>
                            <button
                              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium"
                              onClick={() => { setSelectedGuide(assignedGuide); setOpenGuideModal(true); }}
                            >
                              View Full Profile & Work History
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
      {/* Guide Profile Modal */}
      {openGuideModal && selectedGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setOpenGuideModal(false)}
            >
              ×
            </button>
            <div className="flex items-center space-x-4 mb-4">
              <img src={selectedGuide.profileImage} alt={selectedGuide.name} className="w-20 h-20 rounded-full object-cover border-2 border-green-200" />
              <div>
                <h3 className="text-2xl font-bold text-green-800">{selectedGuide.name}</h3>
                <p className="text-sm text-green-600 flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {selectedGuide.experience} experience • {selectedGuide.location}
                </p>
                <p className="text-sm text-green-600">Languages: {selectedGuide.languages.join(', ')}</p>
                <p className="text-sm text-green-600 flex items-center">
                  <Star className="h-4 w-4 mr-1" />
                  {selectedGuide.rating}/5.0 • {selectedGuide.completedTrips} completed trips
                </p>
              </div>
            </div>
            <div className="mb-4">
              <span className="text-sm font-medium text-green-700">Specialties:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {selectedGuide.specialties.map((specialty, index) => (
                  <span key={specialty.id || `specialty-${index}`} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                    {specialty.name || specialty}
                  </span>
                ))}
              </div>
            </div>
            {selectedGuide.bio && (
              <p className="text-sm text-green-700 mt-2 italic">"{selectedGuide.bio}"</p>
            )}
            <div className="mt-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Work History</h4>
              <ul className="space-y-2">
                {getGuideWorkHistory(selectedGuide.id).map(work => (
                  <li key={work.id} className="flex items-center justify-between bg-gray-50 rounded px-3 py-2">
                    <span className="font-medium text-gray-800">{work.tour}</span>
                    <span className="text-gray-500 text-sm">{work.year}</span>
                    <span className="flex items-center text-yellow-500 text-sm"><Star className="h-4 w-4 mr-1" />{work.rating}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-4">
              <span className="text-sm font-medium text-green-700">Contact:</span>
              <div className="flex flex-col gap-1 mt-1">
                <span className="text-sm text-green-600 flex items-center"><Phone className="h-4 w-4 mr-1" />{selectedGuide.phone}</span>
                <span className="text-sm text-green-600 flex items-center"><Mail className="h-4 w-4 mr-1" />{selectedGuide.email}</span>
              </div>
            </div>
          </div>
        </div>
      )}

                    {request.status === 'pending' && (
                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          <Clock className="h-4 w-4 inline mr-1" />
                          Your request is being reviewed. We'll assign a suitable guide soon!
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Explore More Destinations</h3>
            <p className="text-gray-600 mb-4">Discover amazing places in Nepal for your next adventure</p>
            <Link 
              to="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              View Destinations
              <MapPin className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
            <p className="text-gray-600 mb-4">Contact our support team for assistance with your bookings</p>
            <Link 
              to="/profile"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              Update Profile
              <User className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TouristDashboard;
