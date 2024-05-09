import { Routes, Route } from 'react-router-dom';
import '../styles/App.css';
import HomePage from './HomePage';
import GoPage from './GoPage';
import CoachingPage from './CoachingPage';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/go" element={<GoPage />} />
        <Route path="/coaching" element={<CoachingPage />} />
      </Routes>
    </div>
  );
}

export default App;

