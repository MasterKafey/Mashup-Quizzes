import axios from 'axios';
import { useState, useEffect } from 'react';

function Mp3List() {
  const [files, setFiles] = useState([]);
  const [checked, setChecked] = useState([]);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [formName, setFormName] = useState('');

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
   * Collects and logs all selected files.
   * In a real app, you might send this list to the backend.
   */
  const handleConfirm = () => {
    const mashup = {};

    mashup.mashupName = formName

    const selectedFiles = files.filter((_, i) => checked[i]);
    mashup.selectedFiles = selectedFiles

    if(mashup.mashupName.trim() === "" || mashup.selectedFiles.length <= 0){
      alert("Met un ptn de nom ou choisi des fichiers jsp .. c'est évident");
      return 
    }
    console.log('Selected files:', mashup);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
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

        <label>Mashup Name</label>
        <input
          placeholder="Mario Kart, Claire Obscure... "
          onChange={(e) => setFormName(e.target.value)}
          className="flex-1 mx-2 px-2 py-1 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></input>
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

        <button className="w-full bg-blue-600 hover:bg-blue-700 mb-2 text-white font-semibold py-2 rounded-lg shadow-md transition">
          My Quizs
        </button>
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
