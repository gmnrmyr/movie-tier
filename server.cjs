const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const SAVE_PATH = path.join(__dirname, 'movie-tier.json');

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.post('/save', (req, res) => {
  try {
    fs.writeFileSync(SAVE_PATH, JSON.stringify(req.body, null, 2));
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

app.listen(3001, () => console.log('save server running on :3001'));
