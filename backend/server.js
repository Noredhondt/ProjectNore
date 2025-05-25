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
    console.log('✅ Verbonden met SQLite database');
  }
});

// ✅ Route: Alle vragen ophalen (met kolom 'tekst')
app.get('/api/questions', (req, res) => {
  db.all('SELECT id, tekst AS text FROM Question', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// ✅ Route: Antwoordopties voor een specifieke vraag (met kolommen 'code' en 'tekst')
app.get('/api/questions/:id/options', (req, res) => {
  const questionId = req.params.id;
  db.all(
    'SELECT code AS answer_value, tekst AS text FROM Answer WHERE question_id = ?',
    [questionId],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(rows);
      }
    }
  );
});

// Route: Verwerk quiz antwoorden en bepaal persoonlijkheidstype
app.post('/api/submit', (req, res) => {
  const answers = req.body.answers;

  if (!answers || !Array.isArray(answers) || answers.length === 0) {
    return res.status(400).json({ error: 'Geen antwoorden ontvangen' });
  }

  const counts = { a: 0, b: 0, c: 0, d: 0 };
  answers.forEach(code => {
    if (counts.hasOwnProperty(code)) {
      counts[code]++;
    }
  });

  let maxCode = 'a';
  let maxCount = counts['a'];
  for (const code of ['b', 'c', 'd']) {
    if (counts[code] > maxCount) {
      maxCode = code;
      maxCount = counts[code];
    }
  }

  const codeToPersonalityId = { a: 1, b: 2, c: 3, d: 4 };
  const personalityId = codeToPersonalityId[maxCode];

  db.get('SELECT * FROM PersonalityType WHERE id = ?', [personalityId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Database fout' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Persoonlijkheidstype niet gevonden' });
    }
    res.json({ personalityType: {
      name: row.naam, 
      description: row.omschrijving
    } 
  });
  });
});

// Server starten
app.listen(PORT, () => {
  console.log(`🚀 Server draait op http://localhost:${PORT}`);
});


