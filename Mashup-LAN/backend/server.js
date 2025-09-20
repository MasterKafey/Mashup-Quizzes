const express = require('express');
const getMusicList = require('./getMusicList');
const cors = require('cors');
const PORT = 3000;
const app = express();
app.use(express.json());
app.use(cors());

app.get('/music', (req, res) => {
  res.send(getMusicList());
});

app.post('/admin', (req, res) => {

  console.log(req.body)
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

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
