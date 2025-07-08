import { useState } from 'react';
import MoodEntryForm from './components/MoodEntryForm';
import MoodEntriesList from './components/MoodEntriesList';
import MoodStats from './components/MoodStats';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleMoodAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Mood Journal</h1>
          <p className="text-gray-600">Track your daily moods and emotions</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <MoodEntryForm onMoodAdded={handleMoodAdded} />
          <MoodStats refreshTrigger={refreshTrigger} />
        </div>

        <MoodEntriesList refreshTrigger={refreshTrigger} />
      </div>
    </div>
  );
}

export default App;