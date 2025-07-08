import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import moodRoutes from './routes/moodRoutes.js';
import { initializeDatabase } from './database/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
}));
app.use(express.json());

app.use('/api/moods', moodRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Mood Journal API is running!' });
});

app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, async () => {
  await initializeDatabase();
  console.log(`Server is running on port ${PORT}`);
});

export default app;