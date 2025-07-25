import React from 'react';
import { useData } from '../context/DataContext';

const DestinationManagementPage = () => {
  const { destinations } = useData();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Manage Destinations</h1>
          <a href="/admin/destinations/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">+ Add Destination</a>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg">
            <thead>
              <tr>
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Category</th>
                <th className="py-2 px-4">Location</th>
                <th className="py-2 px-4">Image</th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {destinations && destinations.map(dest => (
                <tr key={dest._id} className="border-t">
                  <td className="py-2 px-4">{dest.name}</td>
                  <td className="py-2 px-4">{dest.category}</td>
                  <td className="py-2 px-4">{dest.location}</td>
                  <td className="py-2 px-4">{dest.image && <img src={dest.image} alt={dest.name} className="w-12 h-12 object-cover rounded" />}</td>
                  <td className="py-2 px-4">
                    <a href={`/admin/destinations/${dest._id}/edit`} className="text-blue-600 hover:underline mr-2">Edit</a>
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

export default DestinationManagementPage;