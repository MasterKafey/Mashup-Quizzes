import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Admin from './pages/Admin';
import Mp3List from './pages/Mp3List';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Admin />} />
          <Route path="/mp3" element={<Mp3List />} />

        </Routes>
      </Router>
    </>
  );
}

export default App;
