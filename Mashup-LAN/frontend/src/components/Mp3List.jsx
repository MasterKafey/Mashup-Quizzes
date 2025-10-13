import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Mp3List() {
  const [files, setFiles] = useState([]);
  const [checked, setChecked] = useState([]);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [formName, setFormName] = useState('');
  const [questions, setQuestions] = useState([]);

  const navigate = useNavigate();

  /**
   * Fetches the list of music files from the backend `/music` route
   * and updates the `files` state.
   * Runs only once when the component mounts.
   */
  useEffect(() => {
    const fetchMusic = async () => {
      try {
        const res = await axios.get('http://localhost:3000/music');
        setFiles(res.data); // backend sends array of filenames
      } catch (err) {
        console.error(err);
        setError('Failed to load music list ❌');
      }
    };

    fetchMusic();
  }, []);

  /**
   * Ensures `checked` array always has the same length as `files`.
   * Whenever `files` changes, reset all checkboxes to `false`.
   */
  useEffect(() => {
    setChecked(files.map(() => false));
  }, [files]);

  /**
   * Returns only the files that match the current search query.
   * @returns {string[]} Array of filenames matching the search.
   */
  const filteredFiles = files.filter((file) =>
    file.toLowerCase().includes(search.toLowerCase())
  );

  /**
   * Determines if all filtered files are checked.
   * - If no files are visible → false
   * - If all visible files are checked → true
   * - Otherwise → false
   * @returns {boolean}
   */
  const allChecked =
    filteredFiles.length > 0 &&
    filteredFiles.every((file) => checked[files.indexOf(file)]);

  /**
   * Toggles all filtered files at once.
   * - If all are checked, uncheck them.
   * - If not all are checked, check them.
   * Non-filtered files keep their previous state.
   */
  const toggleAll = () => {
    setChecked(
      files.map((file) =>
        filteredFiles.includes(file)
          ? !allChecked
          : checked[files.indexOf(file)]
      )
    );
  };

  /**
   * Toggles the checked state of a single file at the given index.
   * @param {number} index - Index of the file in the `files` array.
   */
  const toggleOne = (index) => {
    setChecked(checked.map((c, i) => (i === index ? !c : c)));
  };

  /**
   * This function takes all the data from the front and returns a Quiz object
   * TODO: Quiz type cote front
   */
  function prepareQuizData(formName, selectedFiles, questions) {
    const quiz = {
      formName: formName,
      questions: []
    };

    // Ajout des questions de type "Musique"
    selectedFiles.forEach((musicFile) => {
      quiz.questions.push({
        type: 'MusiqueQuestion',
        file: musicFile
      });
    });

    // Ajout des questions de type "Texte"
    questions.forEach((textQuestion) => {
      quiz.questions.push({
        type: 'TextQuestion',
        textQuestion: textQuestion.question
      });
    });

    return quiz;
  }

  async function createQuiz(quiz) {
    try {
      const response = await axios.post('http://localhost:3000/quiz-creation', {
        quiz
      });

      console.log('✅ Quiz created:', response.data);
      return response.data;
    } catch (error) {
      if (error.response) {
        // Server responded with an error (400, 500, etc.)
        console.error('❌ Error:', error.response.data);
        alert(error.response.data.message);
      } else {
        // Network or other issue
        console.error('⚠️ Network error:', error.message);
      }
    }
  }

  /**
   * Collects and logs all selected files.
   * In a real app, you might send this list to the backend.
   */
  const handleConfirm = () => {
    const selectedFiles = files.filter((_, i) => checked[i]);

    if (
      formName.trim() === '' ||
      (selectedFiles.length <= 0 && questions.length <= 0)
    ) {
      alert("Met un ptn de nom ou choisi des fichiers jsp .. c'est évident");
      return;
    }
    console.log('Selected files:', formName, selectedFiles, questions);
    const quiz = prepareQuizData(formName, selectedFiles, questions);
    createQuiz(quiz);
  };

  // 2 EME COMPOSANT  C EST MOCHE MAIS CA MARCHE
  // QUESTIONS TEXTES 
  function QuestionsQuiz() {
    // Add an empty question
    const addQuestion = () => {
      setQuestions([...questions, { question: '' }]);
    };

    // Remove a question by index
    const removeQuestion = (index) => {
      setQuestions(questions.filter((_, i) => i !== index));
    };

    // Update a question text
    const updateQuestion = (index, value) => {
      const updated = [...questions];
      updated[index].question = value;
      setQuestions(updated);
    };

    return (
      <div className="flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
          {/* Questions List */}
          <ul className="space-y-3 mb-6">
            {questions.map((q, index) => (
              <li
                key={index}
                className="flex items-center justify-between gap-2 border-b pb-2"
              >
                <input
                  type="text"
                  value={q.question}
                  onChange={(e) => updateQuestion(index, e.target.value)}
                  placeholder={`Question ${index + 1}`}
                  className="flex-1 px-2 py-1 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => removeQuestion(index)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>

          {/* Add Question Button */}
          <button
            onClick={addQuestion}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg shadow-md transition mb-2"
          >
            ➕ Add Question
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center bg-gray-100 flex-col">
      <button
        onClick={() => navigate('/my-quizs')}
        className="w-1/3 bg-blue-600 hover:bg-blue-700 mb-2 text-white font-semibold py-2 rounded-lg shadow-md transition"
      >
        My Quizs
      </button>
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
        <label>Mashup Name</label>
        <input
          placeholder="Mario Kart, Claire Obscure... "
          onChange={(e) => setFormName(e.target.value)}
          className="flex-1 mx-2 px-2 py-1 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></input>
        <div className="flex items-center justify-between border-b pb-2 mb-4 gap-2">
          <span className="font-semibold text-gray-800">MP3</span>

          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 mx-2 px-2 py-1 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="checkbox"
            checked={allChecked}
            onChange={toggleAll}
            className="w-4 h-4"
          />
        </div>

        {error && <p className="text-red-600">{error}</p>}

        <ul className="space-y-3 mb-6">
          {filteredFiles.map((file, index) => {
            const realIndex = files.indexOf(file);
            return (
              <li
                key={file}
                className="flex items-center justify-between border-b pb-2"
              >
                <span className="text-gray-700">{file}</span>
                <input
                  type="checkbox"
                  checked={checked[realIndex] || false}
                  onChange={() => toggleOne(realIndex)}
                  className="w-4 h-4"
                />
              </li>
            );
          })}

          {filteredFiles.length === 0 && (
            <li className="text-center text-gray-400 text-sm">
              No results found
            </li>
          )}
        </ul>
        {QuestionsQuiz()}

        {/* Confirm Button */}
        <button
          onClick={handleConfirm}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow-md transition"
        >
          Confirm
        </button>
      </div>
    </div>
  );
}

export default Mp3List;
