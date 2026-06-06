const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');

const app = express();
const SAVE_PATH = path.join(__dirname, 'movie-tier.json');
const AUTOSAVE = path.join(process.env.HOME, 'clawd/scripts/git-autosave.sh');

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// fonte de verdade: lê o JSON no boot do app
app.get('/data', (req, res) => {
  try {
    if (fs.existsSync(SAVE_PATH)) return res.json(JSON.parse(fs.readFileSync(SAVE_PATH, 'utf8')));
    res.status(404).json({ ok: false, error: 'sem movie-tier.json' });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

app.post('/save', (req, res) => {
  try {
    fs.writeFileSync(SAVE_PATH, JSON.stringify(req.body, null, 2));
    res.json({ ok: true });
    // cofre: commita+push em background, sem bloquear a resposta
    execFile('bash', [AUTOSAVE, __dirname, 'movie-tier.json', 'movie-tier autosave'], () => {});
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

app.listen(3001, () => console.log('save server running on :3001'));
