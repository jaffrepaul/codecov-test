import request from 'supertest';
import app from '../src/server.js';
import { db, initializeDatabase } from '../src/database/database.js';
import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest';

describe('Mood Routes', () => {
  beforeAll(async () => {
    await initializeDatabase();
  });

  beforeEach(async () => {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM mood_entries', (err) => {
        if (err) {
          console.error('Error clearing test data:', err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });

  afterAll(async () => {
    return new Promise((resolve) => {
      db.close(() => resolve());
    });
  });

  describe('POST /api/moods', () => {
    it('should create a new mood entry', async () => {
      const moodData = {
        mood: 'happy',
        description: 'I had a great day!',
        date: '2023-12-01'
      };

      const response = await request(app)
        .post('/api/moods')
        .send(moodData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.mood).toBe('happy');
      expect(response.body.description).toBe('I had a great day!');
      expect(response.body.date).toBe('2023-12-01');
      expect(response.body.message).toBe('Mood entry created successfully');
    });

    it('should return 400 if mood is missing', async () => {
      const moodData = {
        description: 'I had a great day!',
        date: '2023-12-01'
      };

      const response = await request(app)
        .post('/api/moods')
        .send(moodData)
        .expect(400);

      expect(response.body.error).toBe('Mood and date are required');
    });

    it('should return 400 if date is missing', async () => {
      const moodData = {
        mood: 'happy',
        description: 'I had a great day!'
      };

      const response = await request(app)
        .post('/api/moods')
        .send(moodData)
        .expect(400);

      expect(response.body.error).toBe('Mood and date are required');
    });
  });

  describe('GET /api/moods', () => {
    beforeEach(async () => {
      const testData = [
        { mood: 'happy', description: 'Great day!', date: '2023-12-01' },
        { mood: 'sad', description: 'Bad day', date: '2023-12-02' },
        { mood: 'happy', description: 'Another great day!', date: '2023-12-01' }
      ];

      return new Promise((resolve, reject) => {
        let completed = 0;
        testData.forEach((data) => {
          db.run(
            'INSERT INTO mood_entries (mood, description, date) VALUES (?, ?, ?)',
            [data.mood, data.description, data.date],
            (err) => {
              if (err) {
                reject(err);
              } else {
                completed++;
                if (completed === testData.length) {
                  resolve();
                }
              }
            }
          );
        });
      });
    });

    it('should retrieve all mood entries', async () => {
      const response = await request(app)
        .get('/api/moods')
        .expect(200);

      expect(response.body).toHaveLength(3);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('mood');
      expect(response.body[0]).toHaveProperty('description');
      expect(response.body[0]).toHaveProperty('date');
    });

    it('should retrieve mood entries by date', async () => {
      const response = await request(app)
        .get('/api/moods?date=2023-12-01')
        .expect(200);

      expect(response.body).toHaveLength(2);
      response.body.forEach((entry) => {
        expect(entry.date).toBe('2023-12-01');
      });
    });
  });

  describe('GET /api/moods/stats', () => {
    beforeEach(async () => {
      const testData = [
        { mood: 'happy', description: 'Great day!', date: '2023-12-01' },
        { mood: 'happy', description: 'Another great day!', date: '2023-12-02' },
        { mood: 'sad', description: 'Bad day', date: '2023-12-03' }
      ];

      return new Promise((resolve, reject) => {
        let completed = 0;
        testData.forEach((data) => {
          db.run(
            'INSERT INTO mood_entries (mood, description, date) VALUES (?, ?, ?)',
            [data.mood, data.description, data.date],
            (err) => {
              if (err) {
                reject(err);
              } else {
                completed++;
                if (completed === testData.length) {
                  resolve();
                }
              }
            }
          );
        });
      });
    });

    it('should return mood statistics', async () => {
      const response = await request(app)
        .get('/api/moods/stats')
        .expect(200);

      expect(response.body).toHaveProperty('total_entries', 3);
      expect(response.body).toHaveProperty('most_common_mood', 'happy');
      expect(response.body).toHaveProperty('mood_breakdown');
      expect(response.body.mood_breakdown).toHaveLength(2);
      
      const happyMood = response.body.mood_breakdown.find(m => m.mood === 'happy');
      expect(happyMood.count).toBe(2);
      
      const sadMood = response.body.mood_breakdown.find(m => m.mood === 'sad');
      expect(sadMood.count).toBe(1);
    });
  });
});