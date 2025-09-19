import React, { useState } from 'react';

function Mp3List() {
  const files = ["Mario Kart.mp3", "Zelda.mp3"];
  //retourne un [] de la même longueur que files avec des false ex  : [false, false]
  const [checked, setChecked] = useState(files.map(() => false));
  const [search, setSearch] = useState("");


  /**
   * Retourne uniquement les fichiers qui contiennent le texte saisi dans "search".
   */
  const filteredFiles = files.filter(file =>
    file.toLowerCase().includes(search.toLowerCase())
  );

  /**
   * Vérifie si tous les fichiers filtrés sont cochés.
   * - Si aucun fichier filtré => false
   * - Si tous les fichiers visibles sont cochés => true
   * - Sinon => false
   */
  const allChecked = filteredFiles.length > 0 && filteredFiles.every(file =>
    checked[files.indexOf(file)]
  );

  /**
   * Coche ou décoche tous les fichiers visibles (filtrés).
   * - Si tous sont cochés, les décoche.
   * - Sinon, les coche.
   * Les fichiers non visibles (non filtrés) ne sont pas affectés.
   */
  const toggleAll = () => {
    setChecked(
      files.map(file =>
        filteredFiles.includes(file) ? !allChecked : checked[files.indexOf(file)]
      )
    );
  };

  /**
   * Coche/décoche un seul fichier selon son index.
   */
  const toggleOne = (index) => {
    setChecked(checked.map((c, i) => (i === index ? !c : c)));
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
                  checked={checked[realIndex]}
                  onChange={() => toggleOne(realIndex)}
                  className="w-4 h-4"
                />
              </li>
            );
          })}
          {filteredFiles.length === 0 && (
            <li className="text-center text-gray-400 text-sm">No results found</li>
          )}
        </ul>

        {/* Confirm button */}
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow-md transition">
          Confirm
        </button>
      </div>
    </div>
  );
}

export default Mp3List;
