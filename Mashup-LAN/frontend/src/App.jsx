import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Admin from './pages/Admin';
import MyQuizs from './pages/MyQuizs';
import QuizCreation from './pages/QuizCreation';
import QuizShare from './pages/QuizShare';
import QuizLive from './pages/QuizLive';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Admin />} />
          <Route path="/quiz" element={<QuizCreation />} />
          <Route path="/my-quizs" element={<MyQuizs />} />
          <Route path="/quiz-share/:quizName/:quizId" element={<QuizShare />} />
          <Route path="/quiz-live/:quizId" element={<QuizLive />} />


        </Routes>
      </Router>
    </>
  );
}

export default App;
