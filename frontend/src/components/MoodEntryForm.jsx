import { useState } from 'react';
import { format } from 'date-fns';
import { moodAPI } from '../services/api';

const MoodEntryForm = ({ onMoodAdded }) => {
  const [formData, setFormData] = useState({
    mood: '',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd'),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const moodOptions = [
    { value: 'happy', label: '😊 Happy', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'sad', label: '😢 Sad', color: 'bg-blue-100 text-blue-800' },
    { value: 'angry', label: '😠 Angry', color: 'bg-red-100 text-red-800' },
    { value: 'anxious', label: '😰 Anxious', color: 'bg-purple-100 text-purple-800' },
    { value: 'excited', label: '🤩 Excited', color: 'bg-green-100 text-green-800' },
    { value: 'calm', label: '😌 Calm', color: 'bg-blue-100 text-blue-800' },
    { value: 'neutral', label: '😐 Neutral', color: 'bg-gray-100 text-gray-800' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const newEntry = await moodAPI.createMoodEntry(formData);
      onMoodAdded(newEntry);
      setFormData({
        mood: '',
        description: '',
        date: format(new Date(), 'yyyy-MM-dd'),
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add mood entry');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Add Mood Entry</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How are you feeling?
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {moodOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setFormData({ ...formData, mood: option.value })}
                className={`p-3 rounded-lg border transition-all duration-200 ${
                  formData.mood === option.value
                    ? `${option.color} border-current`
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description (optional)
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Tell us more about your mood..."
          />
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          disabled={!formData.mood || loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {loading ? 'Adding...' : 'Add Mood Entry'}
        </button>
      </form>
    </div>
  );
};

export default MoodEntryForm;