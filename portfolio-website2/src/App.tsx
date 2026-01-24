import { Routes, Route } from 'react-router-dom';
import BentoGrid from './components/BentoGrid'; // Your main portfolio
import GenogramPage from './genogram/GenogramPage'; // Your new isolated project
import JokeBookPage from './components/JokeBookPage';
import JokeBookPrivacy from './components/JokeBookPrivacy';

function App() {
  return (
    <Routes>
      {/* The Main Portfolio (Home) */}
      <Route path="/" element={<BentoGrid />} />

      {/* The Secret Sandbox (Genogram) */}
      <Route path="/3Dgenogram" element={<GenogramPage />} />

      {/* JokeBook Product Page */}
      <Route path="/jokebook" element={<JokeBookPage />} />
      <Route path="/jokebook/privacy" element={<JokeBookPrivacy />} />
    </Routes>
  );
}

export default App;
