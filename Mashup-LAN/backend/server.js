//Classic Stuff
const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const fs = require('fs');
const WebSocket = require('ws');
const app = express();
const PORT = 3000;
require('dotenv').config();

//Imports
const { Quiz } = require('./mongo');
const getMusicList = require('./getMusicList');

//New Libraries
const mm = require('music-metadata');

// =================== GLOBAL STATE ===================
const connections = {}; // players { userId: { ws, name } }
const admins = {}; // admins { adminId: ws }
let globalAnswers = {}; // collected answers

let currentQuestionIndex = 0;
let quizRunning = false;

// ✅ HTTP + WS server
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.json());
app.use(cors());

// =================== HTTP ROUTES ===================

app.get('/music', (req, res) => {
  res.send(getMusicList());
});

app.post('/admin', (req, res) => {
  const { password } = req.body;
  if (!password)
    return res
      .status(400)
      .json({ success: false, message: 'Password required' });

  if (password === process.env.PASSWORD)
    return res.json({ success: true, message: 'Access granted ✅' });

  return res.status(401).json({ message: 'Invalid password ❌' });
});

app.post('/quiz-creation', async (req, res) => {
  try {
    const { quiz } = req.body;
    if (!quiz || !quiz.formName || !Array.isArray(quiz.questions))
      return res
        .status(400)
        .json({ success: false, message: 'Invalid quiz data ❌' });

    const newQuiz = new Quiz({
      formName: quiz.formName,
      questions: quiz.questions
    });
    await newQuiz.save();
    res.json({ success: true, message: 'Quiz saved ✅', quiz: newQuiz });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: 'Server error ❌', error: err.message });
  }
});

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

app.get('/music/:filename', (req, res, next) => {
  const filePath = path.join(__dirname, 'mp3', req.params.filename);
  console.log(filePath);
  res.sendFile(filePath, (err) => {
    if (err) {
      if (err.code === 'ECONNABORTED') {
        console.warn(`⚠️ Client aborted while sending ${req.params.filename}`);
        return;
      }
      console.error('Error sending file:', err);
      if (!res.headersSent)
        res.status(err.statusCode || 500).send('File error');
    } else {
      console.log(`✅ Sent: ${req.params.filename}`);
    }
  });
});


app.get('/answers-txt', (req, res) => {
  const filePath = path.join(__dirname, 'answers.txt');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return res.status(500).send('Error reading file');
    }

    res.type('text/plain'); // ensure plain text response
    res.send(data);
  });
});

// =================== START QUIZ ===================

app.post('/start-quiz', async (req, res) => {
  try {
    if (quizRunning) {
      return res.json({ success: false, message: 'Quiz already started' });
    }

    const { quizId } = req.body;
    if (!quizId) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing quizId ❌' });
    }

    console.log('🚀 Starting quiz for all users, loading from DB...');
    globalAnswers = {}; // reset collected answers
    // ✅ Load questions from MongoDB
    const quiz = await Quiz.findById(quizId);
    if (
      !quiz ||
      !Array.isArray(quiz.questions) ||
      quiz.questions.length === 0
    ) {
      return res
        .status(404)
        .json({ success: false, message: 'Quiz not found or empty ❌' });
    }

    quizQuestions = quiz.questions; // store in global memory
    quizRunning = true;
    currentQuestionIndex = 0;

    // ✅ Notify players
    broadcastToPlayers({ type: 'quiz_started' });

    // ✅ Send the first question
    sendNextQuestion();

    res.json({
      success: true,
      message: 'Quiz started ✅',
      count: quizQuestions.length
    });
  } catch (err) {
    console.error('❌ Error starting quiz:', err);
    res
      .status(500)
      .json({ success: false, message: 'Server error ❌', error: err.message });
  }
});

// =================== TOOLS ===================

async function getFileDuration(filePath) {
  try {
    const metadata = await mm.parseFile(filePath);
    return metadata.format.duration; // in seconds
  } catch (err) {
    console.error('Error reading duration for', filePath, err);
    return 15; // fallback
  }
}

// =================== WEBSOCKET HANDLER ===================

wss.on('connection', (ws) => {
  console.log('🟢 New WS connection');

  ws.on('message', (raw) => {
    try {
      const data = JSON.parse(raw);

      // --- ADMIN JOIN ---
      if (data.type === 'admin_join') {
        const { quizId } = data.data;
        ws.role = 'admin';
        ws.quizId = quizId;
        const adminId = Math.random().toString(36).substring(2, 9);
        admins[adminId] = ws;
        console.log(`🧑‍💼 Admin connected for quiz ${quizId}`);
        sendConnectionCount();
        return;
      }

      // --- PLAYER JOIN ---
      if (data.type === 'join') {
        const { name, id } = data.data;
        if (!id || !name) return;
        ws.role = 'player';
        ws.userId = id;
        ws.name = name;
        connections[id] = { ws, name };
        console.log(`👤 ${name} (${id}) joined`);
        ws.send(JSON.stringify({ type: 'joined', message: 'Welcome!' }));
        sendConnectionCount();
        return;
      }


      if (data.type === 'answers') {
        const { id, name, answers } = data.data;
        globalAnswers[id] = { name, answers };
        console.log(`📥 Received all answers from ${name} ${JSON.stringify(answers)}`);

        // 🔹 Write to a text file
        const filePath = path.join(__dirname, 'answers.txt');

        // Format nicely (append new entries or overwrite each time)
        const content = Object.values(globalAnswers)
          .map(
            (entry) =>
              `👤 ${entry.name}\n${entry.answers
                .map((a, i) => `  Q${i + 1}: ${a.answer}`)
                .join('\n')}\n`
          )
          .join('\n----------------------\n');

        // Save the full global answers
        fs.writeFile(filePath, content, (err) => {
          if (err) {
            console.error('❌ Error writing answers file:', err);
          } else {
            console.log('📝 Answers saved to answers.txt');
          }
        });
      }
    } catch (err) {
      console.error('❌ WS message error:', err);
    }
  });

  ws.on('close', () => {
    if (ws.role === 'player' && ws.userId) {
      console.log(`🔴 ${ws.name} (${ws.userId}) disconnected`);
      delete connections[ws.userId];
      sendConnectionCount();
    }

    if (ws.role === 'admin') {
      Object.keys(admins).forEach((id) => {
        if (admins[id] === ws) delete admins[id];
      });
      console.log('🧑‍💼 Admin disconnected');
    }
  });
});

// =================== QUIZ FLOW ===================

async function sendNextQuestion() {
  if (!quizQuestions || quizQuestions.length === 0) {
    console.warn('⚠️ No quiz loaded in memory.');
    quizRunning = false;
    return;
  }

  if (currentQuestionIndex >= quizQuestions.length) {
    console.log('✅ Quiz finished!');
    broadcastToPlayers({ type: 'quiz_over' });
    quizRunning = false;
    return;
  }

  const question = quizQuestions[currentQuestionIndex];
  console.log(`📤 Sending question ${currentQuestionIndex + 1}`, question);

  // Default fallback duration
  let duration = 15;

  // If the question has a file, get its true duration
  if (question.file) {
    try {
      const filePath = path.join(__dirname, 'mp3', question.file);
      const fileDuration = await getFileDuration(filePath);
      duration = Math.ceil(fileDuration);
      console.log({ duration });
      console.log(`🎵 File duration detected: ${duration}s`);
    } catch (err) {
      console.error('❌ Error getting file duration:', err);
    }
  }

  // Broadcast question to all connected players
  broadcastToPlayers({ type: 'question', data: question, duration: duration });

  // Wait duration seconds before sending next question
  setTimeout(() => {
    currentQuestionIndex++;
    sendNextQuestion();
  }, duration * 1000);
}

// =================== BROADCAST HELPERS ===================

function broadcastToPlayers(obj) {
  const msg = JSON.stringify(obj);
  Object.values(connections).forEach(({ ws }) => {
    if (ws.readyState === ws.OPEN) ws.send(msg);
  });
}

function broadcastToAdmins(obj) {
  const msg = JSON.stringify(obj);
  Object.values(admins).forEach((ws) => {
    if (ws.readyState === ws.OPEN) ws.send(msg);
  });
}

function sendConnectionCount() {
  const count = Object.keys(connections).length;
  broadcastToAdmins({ type: 'connectionCount', count });
}

// =================== START SERVER ===================

server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
