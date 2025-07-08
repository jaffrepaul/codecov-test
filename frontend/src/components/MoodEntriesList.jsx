import { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { moodAPI } from '../../src/services/api';

const MoodEntriesList = ({ refreshTrigger }) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterDate, setFilterDate] = useState('');

  const moodEmojis = {
    happy: '😊',
    sad: '😢',
    angry: '😠',
    anxious: '😰',
    excited: '🤩',
    calm: '😌',
    neutral: '😐',
  };

  const moodColors = {
    happy: 'bg-yellow-100 text-yellow-800',
    sad: 'bg-blue-100 text-blue-800',
    angry: 'bg-red-100 text-red-800',
    anxious: 'bg-purple-100 text-purple-800',
    excited: 'bg-green-100 text-green-800',
    calm: 'bg-blue-100 text-blue-800',
    neutral: 'bg-gray-100 text-gray-800',
  };

  const fetchEntries = async (dateFilter = '') => {
    try {
      setLoading(true);
      setError('');
      const data = await moodAPI.getMoodEntries(dateFilter || null);
      setEntries(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch mood entries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [refreshTrigger]);

  const handleDateFilter = (e) => {
    const date = e.target.value;
    setFilterDate(date);
    fetchEntries(date);
  };

  const clearFilter = () => {
    setFilterDate('');
    fetchEntries();
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-500">Loading mood entries...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 sm:mb-0">Mood Entries</h2>
        <div className="flex items-center space-x-2">
          <input
            type="date"
            value={filterDate}
            onChange={handleDateFilter}
            className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {filterDate && (
            <button
              onClick={clearFilter}
              className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors duration-200"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {entries.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {filterDate ? 'No mood entries found for this date.' : 'No mood entries yet. Add your first mood entry!'}
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <div key={entry.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${moodColors[entry.mood] || moodColors.neutral}`}>
                    {moodEmojis[entry.mood] || '😐'} {entry.mood}
                  </span>
                  <span className="text-sm text-gray-500">
                    {format(parseISO(entry.date), 'MMM d, yyyy')}
                  </span>
                </div>
                <span className="text-xs text-gray-400">
                  {format(parseISO(entry.created_at), 'h:mm a')}
                </span>
              </div>
              {entry.description && (
                <p className="text-gray-700 leading-relaxed">{entry.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MoodEntriesList;