import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function MyQuizs() {
  const navigate = useNavigate();
  const [myQuizs, setMyQuizs] = useState([]);

  useEffect(() => {
    const fetchQuizs = async () => {
      try {
        const res = await axios.get(import.meta.env.VITE_URL_SERVER + '/quizs');
        const rawData = res.data;
        const formatedData = rawData.map((quizObj) => {
          return { quizId: quizObj._id, quizName: quizObj.formName };
        });

        console.log(formatedData);
        setMyQuizs(formatedData); // backend sends array of filenames
      } catch (err) {
        console.error(err);
        setError('Failed to load music list ❌');
      }
    };
    fetchQuizs();
  }, []);

  const handleClick = (quiz) => {
    console.log('Quiz clicked:', quiz.quizName);
    console.log('id', quiz.quizId);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          My Quizzes
        </h1>

        <ul className="space-y-4">
          {myQuizs.map((quiz) => (
            <li
              key={quiz.quizId}
              className="flex items-center justify-between border-b pb-2"
            >
              <span className="text-gray-700">{quiz.quizName}</span>
              <button
                id={quiz.quizId + ' button'}
                onClick={() => navigate(`/quiz-share/${quiz.quizName}/${quiz.quizId}`)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-1 rounded-lg shadow-md transition"
              >
                Start
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default MyQuizs;
