import { Routes, Route } from 'react-router-dom';
import BentoGrid from './components/BentoGrid'; // Your main portfolio
import GenogramPage from './genogram/GenogramPage'; // Your new isolated project

function App() {
  return (
    <Routes>
      {/* The Main Portfolio (Home) */}
      <Route path="/" element={<BentoGrid />} />

      {/* The Secret Sandbox (Genogram) */}
      <Route path="/3Dgenogram" element={<GenogramPage />} />
    </Routes>
  );
}

export default App;
