# Mood Journal

A full-stack application for tracking daily moods and emotions with a Node.js backend and React frontend.

## Features

- **Create Mood Entries**: Add mood entries with date, mood type, and optional description
- **View Mood History**: Browse all mood entries with date filtering
- **Mood Statistics**: View comprehensive statistics including total entries, most common mood, and mood breakdown with percentages
- **Modern UI**: Clean, responsive design built with React and Tailwind CSS

## Tech Stack

### Backend
- Node.js with Express (ES Modules)
- SQLite database
- Vitest for testing
- ESLint and Prettier for code quality

### Frontend
- React with Vite
- Tailwind CSS for styling
- Axios for API calls
- date-fns for date handling

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation

1. Clone the repository
2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

### Running the Application

1. Start the backend server:
   ```bash
   npm run dev
   ```
   The API will be available at `http://localhost:3000`

2. In a new terminal, start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`

## API Endpoints

- `GET /api/moods` - Get all mood entries (optional `date` query parameter)
- `POST /api/moods` - Create a new mood entry
- `GET /api/moods/stats` - Get mood statistics

## Available Scripts

### Backend
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run Vitest tests
- `npm run test:watch` - Run Vitest in watch mode
- `npm run test:ui` - Run Vitest with UI
- `npm run test:coverage` - Run tests with coverage report
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Project Structure

```
├── src/
│   ├── database/
│   │   └── database.js          # SQLite database setup
│   ├── routes/
│   │   └── moodRoutes.js        # API routes
│   └── server.js                # Express server
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── MoodEntryForm.jsx
│   │   │   ├── MoodEntriesList.jsx
│   │   │   └── MoodStats.jsx
│   │   ├── services/
│   │   │   └── api.js            # API service layer
│   │   └── App.jsx
│   └── ...
├── __tests__/
│   └── moodRoutes.test.js       # API tests
└── ...
```

## Database Schema

The SQLite database contains a `mood_entries` table with the following structure:

```sql
CREATE TABLE mood_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  mood TEXT NOT NULL,
  description TEXT,
  date TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Available Moods

The application supports the following mood types:
- Happy 😊
- Sad 😢
- Angry 😠
- Anxious 😰
- Excited 🤩
- Calm 😌
- Neutral 😐