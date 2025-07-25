import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { CheckCircle, ShieldAlert } from 'lucide-react';

const GuideVerificationPage = () => {
  const { fetchAllGuidesForVerification, verifyGuide, loading } = useData();
  const [guides, setGuides] = useState([]);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const loadGuides = async () => {
      const result = await fetchAllGuidesForVerification();
      if (result.success) {
        setGuides(result.data.guides);
      } else {
        setMessage({ type: 'error', text: result.error });
      }
    };
    loadGuides();
  }, [fetchAllGuidesForVerification]);

  const handleVerifyGuide = async (guideId) => {
    const result = await verifyGuide(guideId);
    if (result.success) {
      setGuides(guides.map(guide =>
        guide._id === guideId ? { ...guide, verificationStatus: 'verified' } : guide
      ));
      setMessage({ type: 'success', text: 'Guide verified successfully.' });
    } else {
      setMessage({ type: 'error', text: result.error });
    }
    setTimeout(() => setMessage(null), 5000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Guide Verification</h1>
        {message && (
          <div className={`mb-6 p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            <p>{message.text}</p>
          </div>
        )}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {guides.map((guide) => (
                <tr key={guide._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{guide.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{guide.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      guide.verificationStatus === 'verified'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {guide.verificationStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {guide.verificationStatus !== 'verified' && (
                      <button
                        onClick={() => handleVerifyGuide(guide._id)}
                        disabled={loading}
                        className="text-indigo-600 hover:text-indigo-900 disabled:opacity-50"
                      >
                        {loading ? 'Verifying...' : 'Verify'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GuideVerificationPage;