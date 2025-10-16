const express = require('express');
const cors = require('cors');
const getMusicList = require('./getMusicList');
const path = require('path');
const http = require('http');
const { Quiz } = require('./mongo');
const WebSocket = require('ws');
require('dotenv').config();


const PORT = 3000;
const app = express();
const connections = {}; // { username: ws }

// ✅ Create HTTP server for both Express + WS
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.json());
app.use(cors());

/////////////////////////////HTTP REQUESTS/////////////////////////////

// Return static music list
app.get('/music', (req, res) => {
  res.send(getMusicList());
});

// Admin password check
app.post('/admin', (req, res) => {
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
  try {
    console.log(req.body);
    const { quiz } = req.body;

    if (!quiz || !quiz.formName || !Array.isArray(quiz.questions)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid quiz data ❌'
      });
    }

    const newQuiz = new Quiz({
      formName: quiz.formName,
      questions: quiz.questions
    });

    await newQuiz.save();

    return res.json({
      success: true,
      message: 'Quiz saved ✅',
      quiz: newQuiz
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Server error ❌',
      error: err.message
    });
  }
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

app.get('/quiz/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/music/:filename', (req, res) => {
  const fileName = req.params.filename;
  const filePath = path.join(__dirname, 'mp3', fileName);

  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(404).send('File not found');
    } else {
      console.log('Sent:', fileName);
    }
  });
});

// ======================
//  ADMIN WS TRIGGER
// ======================
app.post('/start-quiz', (req, res) => {
  console.log('🚀 Starting quiz for all users');

  Object.values(connections).forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'start_quiz' }));
    }
  });

  res.json({ success: true, message: 'Quiz started for all users' });
});


/////////////////////////////WS REQUESTS/////////////////////////////

wss.on('connection', (ws) => {
  console.log('🟢 New WS connection');

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);

      if (data.type === 'join') {
        const username = data.username.trim();
        if (!username) return;

        connections[username] = ws;
        ws.username = username;

        console.log(`👤 ${username} joined`);
        // Optionally send confirmation
        ws.send(JSON.stringify({ type: 'joined', message: 'Welcome!' }));
      }

      if (data.type === 'ping') {
        ws.send(JSON.stringify({ type: 'pong' }));
      }
    } catch (err) {
      console.error('WS message error:', err);
    }
  });

  ws.on('close', () => {
    if (ws.username) {
      console.log(`🔴 ${ws.username} disconnected`);
      delete connections[ws.username];
    }
  });
});

// ====== Start Server ======
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
