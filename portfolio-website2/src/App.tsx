import { Routes, Route } from 'react-router-dom';
import StudioLayout from './components/StudioLayout'; // Your new spatial layout
import GenogramPage from './genogram/GenogramPage'; // Your new isolated project
import JokeBookPage from './components/JokeBookPage';
import JokeBookPrivacy from './components/JokeBookPrivacy';
import BookedMicPage from './components/BookedMicPage';
import BookedMicPrivacy from './components/BookedMicPrivacy';
import SolutionsLayout from './solutions/SolutionsLayout';

function App() {
  return (
    <Routes>
      {/* The Main Portfolio (Home) */}
      <Route path="/" element={<StudioLayout />} />

      {/* The Secret Sandbox (Genogram) */}
      <Route path="/3Dgenogram" element={<GenogramPage />} />

      {/* JokeBook Product Page */}
      <Route path="/jokebook" element={<JokeBookPage />} />
      <Route path="/jokebook/privacy" element={<JokeBookPrivacy />} />

      {/* BookedMic Product Page */}
      <Route path="/bookedmic" element={<BookedMicPage />} />
      <Route path="/bookedmic/privacy" element={<BookedMicPrivacy />} />

      {/* Freelancing / Solutions Page */}
      <Route path="/freelancing" element={<SolutionsLayout />} />
    </Routes>
  );
}

export default App;
