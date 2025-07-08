import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import MoodStats from '../MoodStats.jsx';
import { moodAPI } from '../../services/api.js';

// Mock the API module
vi.mock('../../services/api.js', () => ({
  moodAPI: {
    getMoodStats: vi.fn()
  }
}));

describe('MoodStats Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Emoji Display', () => {
    it('should display the correct angry emoji (😡)', async () => {
      const mockStats = {
        total_entries: 5,
        most_common_mood: 'angry',
        mood_breakdown: [
          { mood: 'angry', count: 3 },
          { mood: 'happy', count: 2 }
        ]
      };

      moodAPI.getMoodStats.mockResolvedValue(mockStats);

      render(<MoodStats refreshTrigger={0} />);

      await waitFor(() => {
        expect(screen.getByText('😡 angry')).toBeInTheDocument();
      });
    });

    it('should display all mood emojis correctly', async () => {
      const mockStats = {
        total_entries: 7,
        most_common_mood: 'happy',
        mood_breakdown: [
          { mood: 'happy', count: 1 },
          { mood: 'sad', count: 1 },
          { mood: 'angry', count: 1 },
          { mood: 'anxious', count: 1 },
          { mood: 'excited', count: 1 },
          { mood: 'calm', count: 1 },
          { mood: 'neutral', count: 1 }
        ]
      };

      moodAPI.getMoodStats.mockResolvedValue(mockStats);

      render(<MoodStats refreshTrigger={0} />);

      await waitFor(() => {
        expect(screen.getByText('😊 happy')).toBeInTheDocument();
        expect(screen.getByText('😢 sad')).toBeInTheDocument();
        expect(screen.getByText('😡 angry')).toBeInTheDocument();
        expect(screen.getByText('😰 anxious')).toBeInTheDocument();
        expect(screen.getByText('🤩 excited')).toBeInTheDocument();
        expect(screen.getByText('😌 calm')).toBeInTheDocument();
        expect(screen.getByText('😐 neutral')).toBeInTheDocument();
      });
    });

    it('should display default emoji for unknown mood', async () => {
      const mockStats = {
        total_entries: 1,
        most_common_mood: 'unknown_mood',
        mood_breakdown: [
          { mood: 'unknown_mood', count: 1 }
        ]
      };

      moodAPI.getMoodStats.mockResolvedValue(mockStats);

      render(<MoodStats refreshTrigger={0} />);

      await waitFor(() => {
        expect(screen.getByText('😐 unknown_mood')).toBeInTheDocument();
      });
    });
  });

  describe('Component States', () => {
    it('should show loading state initially', () => {
      moodAPI.getMoodStats.mockImplementation(() => new Promise(() => {})); // Never resolves

      render(<MoodStats refreshTrigger={0} />);

      expect(screen.getByText('Loading mood statistics...')).toBeInTheDocument();
    });

    it('should show error state when API fails', async () => {
      const errorMessage = 'Failed to fetch mood stats';
      moodAPI.getMoodStats.mockRejectedValue(new Error(errorMessage));

      render(<MoodStats refreshTrigger={0} />);

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });

    it('should show error message from API response', async () => {
      const apiError = {
        response: {
          data: {
            error: 'Custom API error message'
          }
        }
      };
      moodAPI.getMoodStats.mockRejectedValue(apiError);

      render(<MoodStats refreshTrigger={0} />);

      await waitFor(() => {
        expect(screen.getByText('Custom API error message')).toBeInTheDocument();
      });
    });

    it('should show empty state when no mood entries exist', async () => {
      const mockStats = {
        total_entries: 0,
        most_common_mood: null,
        mood_breakdown: []
      };

      moodAPI.getMoodStats.mockResolvedValue(mockStats);

      render(<MoodStats refreshTrigger={0} />);

      await waitFor(() => {
        expect(screen.getByText('No mood entries yet. Add some entries to see your mood statistics!')).toBeInTheDocument();
      });
    });

    it('should show empty state when stats is null', async () => {
      moodAPI.getMoodStats.mockResolvedValue(null);

      render(<MoodStats refreshTrigger={0} />);

      await waitFor(() => {
        expect(screen.getByText('No mood entries yet. Add some entries to see your mood statistics!')).toBeInTheDocument();
      });
    });
  });

  describe('Data Display', () => {
    it('should display total entries correctly', async () => {
      const mockStats = {
        total_entries: 15,
        most_common_mood: 'happy',
        mood_breakdown: [
          { mood: 'happy', count: 15 }
        ]
      };

      moodAPI.getMoodStats.mockResolvedValue(mockStats);

      render(<MoodStats refreshTrigger={0} />);

      await waitFor(() => {
        expect(screen.getByText('15')).toBeInTheDocument();
        expect(screen.getByText('Total Entries')).toBeInTheDocument();
      });
    });

    it('should display most common mood correctly', async () => {
      const mockStats = {
        total_entries: 10,
        most_common_mood: 'happy',
        mood_breakdown: [
          { mood: 'happy', count: 6 },
          { mood: 'sad', count: 4 }
        ]
      };

      moodAPI.getMoodStats.mockResolvedValue(mockStats);

      render(<MoodStats refreshTrigger={0} />);

      await waitFor(() => {
        expect(screen.getByText('😊 happy')).toBeInTheDocument();
        expect(screen.getByText('Most Common Mood')).toBeInTheDocument();
      });
    });

    it('should display mood breakdown with correct counts and percentages', async () => {
      const mockStats = {
        total_entries: 10,
        most_common_mood: 'happy',
        mood_breakdown: [
          { mood: 'happy', count: 6 },
          { mood: 'angry', count: 4 }
        ]
      };

      moodAPI.getMoodStats.mockResolvedValue(mockStats);

      render(<MoodStats refreshTrigger={0} />);

      await waitFor(() => {
        expect(screen.getByText('6 entries')).toBeInTheDocument();
        expect(screen.getByText('4 entries')).toBeInTheDocument();
        expect(screen.getByText('60.0%')).toBeInTheDocument();
        expect(screen.getByText('40.0%')).toBeInTheDocument();
      });
    });

    it('should display singular "entry" for count of 1', async () => {
      const mockStats = {
        total_entries: 1,
        most_common_mood: 'happy',
        mood_breakdown: [
          { mood: 'happy', count: 1 }
        ]
      };

      moodAPI.getMoodStats.mockResolvedValue(mockStats);

      render(<MoodStats refreshTrigger={0} />);

      await waitFor(() => {
        expect(screen.getByText('1 entry')).toBeInTheDocument();
      });
    });
  });

  describe('Component Behavior', () => {
    it('should fetch stats when refreshTrigger changes', async () => {
      const mockStats = {
        total_entries: 1,
        most_common_mood: 'happy',
        mood_breakdown: [{ mood: 'happy', count: 1 }]
      };

      moodAPI.getMoodStats.mockResolvedValue(mockStats);

      const { rerender } = render(<MoodStats refreshTrigger={0} />);
      
      expect(moodAPI.getMoodStats).toHaveBeenCalledTimes(1);

      rerender(<MoodStats refreshTrigger={1} />);
      
      expect(moodAPI.getMoodStats).toHaveBeenCalledTimes(2);
    });
  });
});