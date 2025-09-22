
function MyQuiz() {
  const quizzes = ["Mario Kart Quiz", "Zelda Quiz"];

  const handleClick = (quizName) => {
    console.log("Quiz clicked:", quizName);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          My Quizzes
        </h1>

        <ul className="space-y-4">
          {quizzes.map((quiz) => (
            <li
              key={quiz}
              className="flex items-center justify-between border-b pb-2"
            >
              <span className="text-gray-700">{quiz}</span>
              <button
                onClick={() => handleClick(quiz)}
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

export default MyQuiz;
