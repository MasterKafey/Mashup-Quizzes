import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Admin from './pages/Admin';
import Mp3List from './pages/Mp3List';
import MyQuiz from './pages/MyQuiz';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Admin />} />
          <Route path="/mp3" element={<Mp3List />} />
          <Route path="/my-quiz" element={<MyQuiz />} />

        </Routes>
      </Router>
    </>
  );
}

export default App;
