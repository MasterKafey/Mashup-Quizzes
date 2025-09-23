import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Admin from './pages/Admin';
import MyQuizs from './pages/MyQuizs';
import QuizCreation from './pages/QuizCreation';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Admin />} />
          <Route path="/quiz" element={<QuizCreation />} />
          <Route path="/my-quizs" element={<MyQuizs />} />

        </Routes>
      </Router>
    </>
  );
}

export default App;
