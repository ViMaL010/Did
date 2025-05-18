// App.js
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import DID from './pages/D-id';
import { Home } from './pages/Home';
import InsuranceDiscovery from './pages/Insurance';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/agent" element={<DID/>} />
        <Route path="/insurance" element={<InsuranceDiscovery/>} />
      </Routes>
    </Router>
  );
}

export default App;