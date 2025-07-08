import { useState, useEffect } from 'react';
import { moodAPI } from '../services/api';

const MoodStats = ({ refreshTrigger }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
    happy: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    sad: 'bg-blue-100 text-blue-800 border-blue-200',
    angry: 'bg-red-100 text-red-800 border-red-200',
    anxious: 'bg-purple-100 text-purple-800 border-purple-200',
    excited: 'bg-green-100 text-green-800 border-green-200',
    calm: 'bg-blue-100 text-blue-800 border-blue-200',
    neutral: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await moodAPI.getMoodStats();
      setStats(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch mood stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [refreshTrigger]);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-500">Loading mood statistics...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!stats || stats.total_entries === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Mood Statistics</h2>
        <div className="text-center py-8 text-gray-500">
          No mood entries yet. Add some entries to see your mood statistics!
        </div>
      </div>
    );
  }

  const getPercentage = (count) => {
    return ((count / stats.total_entries) * 100).toFixed(1);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Mood Statistics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">{stats.total_entries}</div>
          <div className="text-sm text-blue-600">Total Entries</div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="text-2xl font-bold text-green-600 flex items-center">
            {moodEmojis[stats.most_common_mood] || '😐'} {stats.most_common_mood}
          </div>
          <div className="text-sm text-green-600">Most Common Mood</div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Mood Breakdown</h3>
        {stats.mood_breakdown.map((mood) => (
          <div key={mood.mood} className="flex items-center justify-between p-3 rounded-lg border">
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${moodColors[mood.mood] || moodColors.neutral}`}>
                {moodEmojis[mood.mood] || '😐'} {mood.mood}
              </span>
              <span className="text-gray-600">
                {mood.count} {mood.count === 1 ? 'entry' : 'entries'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-20 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getPercentage(mood.count)}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-500 w-12 text-right">
                {getPercentage(mood.count)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoodStats;