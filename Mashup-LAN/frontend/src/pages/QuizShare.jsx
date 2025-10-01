import { useLocation, useParams } from 'react-router-dom';
import QRCode from 'react-qr-code';
import { useEffect, useState } from 'react';

function QuizShare() {
  const { quizId } = useParams();
  const location = useLocation();
  const quizName = location.state?.quizName || 'Unknown Quiz';

  const link = `http://localhost:5173/join/${quizId}`; // public join link for participants

  // WebSocket connection count
  const [count, setCount] = useState(0);

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:3001/${quizId}`); // backend WS endpoint

    ws.onmessage = (msg) => {
      try {
        const data = JSON.parse(msg.data);
        if (data.type === 'connectionCount') {
          setCount(data.count);
        }
      } catch (e) {
        console.error('WS message parse error', e);
      }
    };

    return () => ws.close();
  }, [quizId]);

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
      <p className="mt-6 text-lg">Active connections: {count}</p>
    </div>
  );
}

export default QuizShare;
