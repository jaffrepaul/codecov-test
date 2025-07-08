import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const moodAPI = {
  createMoodEntry: async (moodData) => {
    const response = await api.post('/moods', moodData);
    return response.data;
  },

  getMoodEntries: async (date = null) => {
    const params = date ? { date } : {};
    const response = await api.get('/moods', { params });
    return response.data;
  },

  getMoodStats: async () => {
    const response = await api.get('/moods/stats');
    return response.data;
  },
};

export default api; 