import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const initialState = {
  name: '',
  description: '',
  image: '',
  category: '',
  difficulty: '',
  location: '',
  altitude: '',
  bestSeason: [],
  durationMin: '',
  durationMax: '',
  highlights: '',
  requirements: '',
};

const categories = ['trekking', 'culture', 'adventure', 'spiritual', 'wildlife', 'photography'];
const difficulties = ['easy', 'moderate', 'challenging', 'expert'];
const seasons = ['spring', 'summer', 'autumn', 'winter'];

const DestinationForm = ({ editMode = false, destination: destinationProp = null, onSubmit }) => {
  const { id } = useParams();
  const [destination, setDestination] = useState(destinationProp);
  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    const fetchDestination = async () => {
      if (editMode && id) {
        try {
          const res = await fetch(`/api/destinations/${id}`);
          const data = await res.json();
          if (data.status === 'success') {
            setDestination(data.data.destination);
          }
        } catch (error) {
          console.error("Failed to fetch destination:", error);
        }
      }
    };

    if (editMode && !destinationProp) {
      fetchDestination();
    } else if (destinationProp) {
      setDestination(destinationProp);
    }
  }, [id, editMode, destinationProp]);

  useEffect(() => {
    if (destination) {
      setFormData({
        ...initialState,
        ...destination,
        durationMin: destination.duration?.min || '',
        durationMax: destination.duration?.max || '',
        highlights: Array.isArray(destination.highlights) ? destination.highlights.join('\n') : '',
        requirements: Array.isArray(destination.requirements) ? destination.requirements.join('\n') : '',
      });
    } else {
      setFormData(initialState);
    }
  }, [destination]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async e => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setMessage(null);
    const formDataUpload = new FormData();
    formDataUpload.append('image', file);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
        credentials: 'include',
      });
      const data = await res.json();
      if (data.status === 'success') {
        setFormData(prev => ({ ...prev, image: data.url }));
        setMessage({ type: 'success', text: 'Image uploaded!' });
      } else {
        setMessage({ type: 'error', text: data.message || 'Upload failed' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Image upload failed. Try again.' });
    }
    setUploading(false);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage(null);
    const payload = {
      ...formData,
      duration: { min: Number(formData.durationMin), max: Number(formData.durationMax) },
      highlights: formData.highlights.split('\n').filter(Boolean),
      requirements: formData.requirements.split('\n').filter(Boolean),
      bestSeason: Array.isArray(formData.bestSeason) ? formData.bestSeason : [formData.bestSeason],
      altitude: Number(formData.altitude),
    };
    try {
      const res = await fetch(editMode ? `/api/destinations/${destination._id}` : '/api/destinations', {
        method: editMode ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.status === 'success') {
        setMessage({ type: 'success', text: `Destination ${editMode ? 'updated' : 'created'}!` });
        if (onSubmit) onSubmit(data.data.destination);
        else navigate('/admin');
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to save destination.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save destination.' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-xl w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6">{editMode ? 'Edit' : 'Create'} Destination</h2>
        {message && (
          <div className={`mb-4 p-3 rounded-md ${message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>{message.text}</div>
        )}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input name="name" value={formData.name} onChange={handleChange} required className="w-full p-3 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required className="w-full p-3 border rounded" rows={2} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Image</label>
            {formData.image && <img src={formData.image} alt="Destination" className="w-32 h-32 object-cover rounded mb-2" />}
            <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select name="category" value={formData.category} onChange={handleChange} required className="w-full p-3 border rounded">
              <option value="">Select category</option>
              {categories.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Difficulty</label>
            <select name="difficulty" value={formData.difficulty} onChange={handleChange} required className="w-full p-3 border rounded">
              <option value="">Select difficulty</option>
              {difficulties.map(d => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input name="location" value={formData.location} onChange={handleChange} required className="w-full p-3 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Altitude (m)</label>
            <input name="altitude" type="number" value={formData.altitude} onChange={handleChange} className="w-full p-3 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Best Season</label>
            <select name="bestSeason" value={formData.bestSeason} onChange={handleChange} className="w-full p-3 border rounded">
              <option value="">Select season</option>
              {seasons.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Duration Min (days)</label>
              <input name="durationMin" type="number" value={formData.durationMin} onChange={handleChange} className="w-full p-3 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Duration Max (days)</label>
              <input name="durationMax" type="number" value={formData.durationMax} onChange={handleChange} className="w-full p-3 border rounded" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Highlights (one per line)</label>
            <textarea name="highlights" value={formData.highlights} onChange={handleChange} className="w-full p-3 border rounded" rows={2} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Requirements (one per line)</label>
            <textarea name="requirements" value={formData.requirements} onChange={handleChange} className="w-full p-3 border rounded" rows={2} />
          </div>
          <button type="submit" disabled={uploading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50">
            {uploading ? 'Uploading...' : editMode ? 'Update Destination' : 'Create Destination'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DestinationForm;
