import { useParams } from 'react-router-dom';
import QRCode from 'react-qr-code';
import { useEffect, useState } from 'react';

function QuizShare() {
  const { quizId, quizName } = useParams();
  const [count, setCount] = useState(0);

  const link = import.meta.env.VITE_URL_FRONTEND + `/quiz-live/${quizId}`;
  const wsUrl = import.meta.env.VITE_URL_WS + `/${quizId}`;

  useEffect(() => {
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('🧑‍💼 Admin connected to WS');
      ws.send(JSON.stringify({ type: 'admin_join', data: { quizId } }));
    };

    ws.onmessage = (msg) => {
      try {
        const data = JSON.parse(msg.data);
        if (data.type === 'connectionCount') {
          setCount(data.count);
        }
      } catch (err) {
        console.error('WS message parse error', err);
      }
    };

    ws.onclose = () => console.log('❌ Admin WS closed');
    return () => ws.close();
  }, [quizId, wsUrl]);

  // Admin manually starts quiz
  const handleStartQuiz = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_URL_SERVER + '/start-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quizId })
      });
      const data = await res.json();
      console.log('🚀 Quiz started:', data);
    } catch (err) {
      console.error('Failed to start quiz:', err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">{quizName}</h1>

      <QRCode value={link} size={200} />
      <p className="mt-4 text-blue-600">{link}</p>

      <button
        onClick={() => navigator.clipboard.writeText(link)}
        className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
      >
        Copy Link
      </button>

      <button
        onClick={handleStartQuiz}
        className="bg-green-600 text-white px-4 py-2 rounded mt-4"
      >
        🚀 Start Quiz
      </button>

      <p className="mt-6 text-lg">
        Active connections: <span className="font-semibold">{count}</span>
      </p>
    </div>
  );
}

export default QuizShare;
