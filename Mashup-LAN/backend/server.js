const express = require('express');
const cors = require('cors');
const getMusicList = require('./getMusicList');
const { Quiz } = require('./mongo');

const PORT = 3000;
const app = express();

app.use(express.json());
app.use(cors());

// ====== Routes ======

// Return static music list
app.get('/music', (req, res) => {
  res.send(getMusicList());
});

// Admin password check
app.post('/admin', (req, res) => {
  console.log(req.body);
  const { password } = req.body;

  if (!password) {
    return res
      .status(400)
      .json({ success: false, message: 'Password is required' });
  }

  if (password === process.env.PASSWORD) {
    return res.json({ success: true, message: 'Access granted ✅' });
  } else {
    return res.status(401).json({ message: 'Invalid password ❌' });
  }
});

// Create a new quiz
app.post('/quiz-creation', async (req, res) => {
  console.log(req.body);
  const { questions, formName, selectedFiles } = req.body;
  console.log(questions, formName, selectedFiles)

});

// Get all quizzes
app.get('/quizs', async (req, res) => {
  try {
    const quizs = await Quiz.find();
    res.json(quizs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error ❌' });
  }
});

// ====== Start Server ======
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
