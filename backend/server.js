// server.js (in backend/)

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Verbind met de SQLite database
const db = new sqlite3.Database('/Users/noredhondt/Documents/Postgraduaat/Project/database/muziektestk.db', (err) => {
  if (err) {
    console.error('Fout bij verbinden met database:', err.message);
  } else {
    console.log(' Verbonden met SQLite database');
  }
});

// Route: Alle vragen ophalen
app.get('/api/questions', (req, res) => {
  db.all('SELECT * FROM Question', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Route: Antwoordopties voor een specifieke vraag
app.get('/api/questions/:id/options', (req, res) => {
  const questionId = req.params.id;
  db.all('SELECT answer_value, text FROM Answer WHERE Question_id = ?', [questionId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Server starten
app.listen(PORT, () => {
  console.log(`🚀 Server draait op http://localhost:3001`);
});
