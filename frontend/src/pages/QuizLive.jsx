import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function QuizLive() {
  const { quizId } = useParams();

  const [phase, setPhase] = useState('enterName'); // 'enterName' | 'waiting' | 'playing' | 'finished'
  const [name, setName] = useState(localStorage.getItem('name') || '');
  const [userId, setUserId] = useState(localStorage.getItem('id') || '');
  const [socket, setSocket] = useState(null);

  const [question, setQuestion] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0); // purely cosmetic timer
  const [answer, setAnswer] = useState('');
  const [answers, setAnswers] = useState([]);

  // ✅ Generate an ID if needed
  useEffect(() => {
    if (!userId) {
      const newId = Math.random().toString(36).substring(2, 9);
      setUserId(newId);
      localStorage.setItem('id', newId);
    }
  }, []);

  // ✅ Establish WebSocket connection
  useEffect(() => {
    const ws = new WebSocket(
      import.meta.env.VITE_URL_WS
    );
    setSocket(ws);

    ws.onopen = () => console.log('✅ Connected to WS server');

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      console.log('📩 WS message:', msg);

      switch (msg.type) {
        case 'quiz_started':
          setPhase('playing');
          break;

        case 'question':
          setQuestion(msg.data);
          setTimeLeft(30); // purely cosmetic
          setAnswer('');
          break;

        case 'time_update':
          // optional if server sends it
          setTimeLeft(msg.data);
          break;

        case 'quiz_over':
          setPhase('finished');
          break;

        default:
          break;
      }
    };

    ws.onclose = () => console.log('❌ WS disconnected');

    return () => ws.close();
  }, [quizId]);

  // ✅ Local cosmetic countdown
  useEffect(() => {
    if (phase !== 'playing' || !timeLeft) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [phase, timeLeft]);

  const handleJoin = () => {
    if (!name.trim() || !socket) return;

    // Wait for connection to be ready
    if (socket.readyState !== WebSocket.OPEN) {
      console.warn('⏳ Waiting for socket to open...');
      socket.addEventListener(
        'open',
        () => {
          socket.send(
            JSON.stringify({
              type: 'join',
              data: { name: name.trim(), id: userId }
            })
          );
          setPhase('waiting');
        },
        { once: true }
      );
      return;
    }

    socket.send(
      JSON.stringify({
        type: 'join',
        data: { name: name.trim(), id: userId }
      })
    );
    setPhase('waiting');
  };

  // ✅ Handle answer submission
  const handleConfirm = () => {
    if (!answer.trim() || !socket || !question) return;

    socket.send(
      JSON.stringify({
        type: 'answer',
        data: { questionId: question._id, answer: answer.trim(), id: userId }
      })
    );

    setAnswers((prev) => [
      ...prev,
      { questionId: question._id, answer: answer.trim() }
    ]);
    setAnswer('');
  };

  // --- UI per phase ---
  if (phase === 'enterName') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-xl font-semibold mb-4">
          Entre ton nom pour commencer
        </h2>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ton prénom"
          className="border rounded-xl p-3 mb-4"
        />
        <button
          onClick={handleJoin}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl"
        >
          Rejoindre le quiz
        </button>
      </div>
    );
  }

  if (phase === 'waiting') {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg text-gray-600">
        En attente que l’hôte démarre le quiz...
      </div>
    );
  }

  if (phase === 'playing' && question) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-xl text-center">
          <h2 className="text-2xl font-semibold mb-6">
            {question.type === 'TextQuestion'
              ? question.textQuestion
              : 'Écoute et réponds 👇'}
          </h2>

          {question.type === 'MusiqueQuestion' && (
            <audio
              key={question._id}
              controls
              className="w-full mb-6 rounded-md"
            >
              <source
                src={`${import.meta.env.VITE_URL_SERVER}/music/${
                  question.file
                }`}
                type="audio/mpeg"
              />
            </audio>
          )}

          <p className="text-gray-500 mb-2">Temps restant : {timeLeft}s</p>

          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Ta réponse..."
            className="w-full p-3 border border-gray-300 rounded-xl mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

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

  if (phase === 'finished') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-semibold mb-4">Quiz terminé 🎉</h2>
        <p>Merci d’avoir participé, {name} !</p>
      </div>
    );
  }

  return null;
}

export default QuizLive;
