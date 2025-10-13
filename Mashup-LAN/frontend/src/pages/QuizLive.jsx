import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function QuizLive() {
  const { quizId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch(`http://localhost:3000/quiz/${quizId}`);
        const data = await response.json();
        setQuestions(data.questions || []);
      } catch (error) {
        console.error('Error fetching quiz:', error);
      }
    };

    fetchQuiz();
  }, [quizId]);

  const handleConfirm = () => {
    if (!answer.trim()) return;

    const currentQuestion = questions[currentIndex];
    setAnswers(prev => [
      ...prev,
      { questionId: currentQuestion._id, answer: answer.trim() }
    ]);

    setAnswer('');
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      alert('Quiz completed!');
      console.log('All answers:', answers);
    }
  };

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen text-lg text-gray-500">
        Loading quiz...
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-xl text-center">
        <h2 className="text-2xl font-semibold mb-6">
          Question {currentIndex + 1} / {questions.length}
        </h2>

        {/* --- MusiqueQuestion --- */}
        {currentQuestion.type === 'MusiqueQuestion' && (
          <div className="flex flex-col items-center mb-6">
            <audio controls className="w-full mb-4 rounded-md">
              <source
                src={`http://localhost:3000/music/test2.mp4`}
                type="audio/mpeg"
              />
              Your browser does not support the audio element.
            </audio>
            <p className="text-gray-600">Écoute le son et réponds ci-dessous 👇</p>
          </div>
        )}

        {/* --- TextQuestion --- */}
        {currentQuestion.type === 'TextQuestion' && (
          <p className="text-lg font-medium text-gray-800 mb-6">
            {currentQuestion.textQuestion}
          </p>
        )}

        {/* --- Input --- */}
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Ta réponse..."
          className="w-full p-3 border border-gray-300 rounded-xl mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* --- Confirm Button --- */}
        <button
          onClick={handleConfirm}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-xl transition"
        >
          Confirmer
        </button>
      </div>
    </div>
  );
}

export default QuizLive;
