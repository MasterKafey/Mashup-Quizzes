const fs = require('fs');
const path = require('path');
require('dotenv').config();


/**
 * Reads the music folder defined in the environment variable `MUSIC_FOLDER`
 * (relative to the current file's directory) and returns a list of file names.
 *
 * The function:
 * - Resolves the absolute path of the music folder using `__dirname` + `process.env.MUSIC_FOLDER`.
 * - Reads all entries in that folder.
 * - Filters out subdirectories, keeping only files.
 * - Returns an array of file names (strings).
 *
 * @function getMusicList
 * @returns {string[]} An array containing the names of all files in the music folder.
 *
 * @example
 * // .env
 * // MUSIC_FOLDER=mp3
 *
 * const musicList = getMusicList();
 * console.log(musicList);
 * // -> [ 'song1.mp3', 'song2.wav' ]
 */
function getMusicList() {
  const musicFolder = path.join(__dirname, process.env.MUSIC_FOLDER);

  try {
    const files = fs.readdirSync(musicFolder);

    const fileList = files.filter((file) => {
      const fullPath = path.join(musicFolder, file);
      return fs.statSync(fullPath).isFile();
    });

    return fileList;
  } catch (err) {
    console.error('Error reading folder:', err.message);
    return [];
  }
}

module.exports = getMusicList;
