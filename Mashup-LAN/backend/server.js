const express = require('express');
const getMusicList = require('./getMusicList');
const app = express();     
const PORT = 3000;


app.get('/music', (req, res) => {
  res.send(getMusicList());
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
