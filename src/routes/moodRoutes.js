import express from 'express';
import { db } from '../database/database.js';

const router = express.Router();

router.post('/', (req, res) => {
  const { mood, description, date } = req.body;

  if (!mood || !date) {
    return res.status(400).json({ error: 'Mood and date are required' });
  }

  const query = `INSERT INTO mood_entries (mood, description, date) VALUES (?, ?, ?)`;
  
  db.run(query, [mood, description || '', date], function(err) {
    if (err) {
      console.error('Error creating mood entry:', err.message);
      return res.status(500).json({ error: 'Failed to create mood entry' });
    }

    res.status(201).json({
      id: this.lastID,
      mood,
      description,
      date,
      message: 'Mood entry created successfully'
    });
  });
});

router.get('/', (req, res) => {
  const { date } = req.query;
  
  let query = 'SELECT * FROM mood_entries';
  let params = [];

  if (date) {
    query += ' WHERE date = ?';
    params.push(date);
  }

  query += ' ORDER BY created_at DESC';

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('Error retrieving mood entries:', err.message);
      return res.status(500).json({ error: 'Failed to retrieve mood entries' });
    }

    res.json(rows);
  });
});

router.get('/stats', (req, res) => {
  const statsQuery = `
    SELECT 
      COUNT(*) as total_entries,
      mood,
      COUNT(mood) as mood_count
    FROM mood_entries 
    GROUP BY mood
    ORDER BY mood_count DESC
  `;

  db.all(statsQuery, [], (err, rows) => {
    if (err) {
      console.error('Error retrieving mood stats:', err.message);
      return res.status(500).json({ error: 'Failed to retrieve mood stats' });
    }

    const totalEntries = rows.reduce((sum, row) => sum + row.mood_count, 0);
    const mostCommonMood = rows.length > 0 ? rows[0].mood : null;

    res.json({
      total_entries: totalEntries,
      most_common_mood: mostCommonMood,
      mood_breakdown: rows.map(row => ({
        mood: row.mood,
        count: row.mood_count
      }))
    });
  });
});

export default router;