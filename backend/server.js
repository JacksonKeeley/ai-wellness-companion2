// server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = global.fetch || require('node-fetch');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 4000;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// ── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(trackRequests);

/**
 * Track each non-analytics request in the DB
 */
async function trackRequests(req, res, next) {
  if (req.path !== '/analytics') {
    try {
      await pool.query(
        `INSERT INTO analytics(route, count)
         VALUES($1, 1)
         ON CONFLICT (route)
         DO UPDATE SET count = analytics.count + 1;`,
        [req.path]
      );
    } catch (err) {
      console.error('Error tracking analytics:', err);
    }
  }
  next();
}

// ── Routes ───────────────────────────────────────────────────────────────────
app.get('/ping-db', pingDatabase);
app.get('/motivation', sendRandomQuote);
app.get('/affirmation', sendRandomAffirmation);
app.get('/breathing', sendBreathingGuide);
app.get('/analytics', sendAnalytics);
app.post('/reset-analytics', resetAnalyticsData);
app.get('/journal_entries', listJournalEntries);
app.post('/journal_entries', authenticateToken, addJournalEntry);
app.post('/emotion-analysis', authenticateToken, analyzeEmotion);
app.post('/signup', signupUser);
app.post('/login', loginUser);

// ── Handlers ─────────────────────────────────────────────────────────────────

async function pingDatabase(req, res) {
  try {
    const { rows } = await pool.query('SELECT 1 AS ok');
    res.json(rows[0]);
  } catch (err) {
    console.error('DB ping failed:', err);
    res.status(500).json({ error: 'Database unreachable' });
  }
}

async function sendRandomQuote(req, res) {
  try {
    const { rows } = await pool.query(
      'SELECT message FROM quotes ORDER BY RANDOM() LIMIT 1'
    );
    res.json({ message: rows[0].message });
  } catch (err) {
    console.error('Fetch quote failed:', err);
    res.status(500).json({ error: 'Failed to fetch quote.' });
  }
}

async function sendRandomAffirmation(req, res) {
  try {
    const { rows } = await pool.query(
      'SELECT text FROM affirmations ORDER BY RANDOM() LIMIT 1'
    );
    res.json({ affirmation: rows[0].text });
  } catch (err) {
    console.error('Fetch affirmation failed:', err);
    res.status(500).json({ error: 'Failed to fetch affirmation.' });
  }
}

async function sendBreathingGuide(req, res) {
  try {
    const { rows } = await pool.query(
      'SELECT step1, step2, step3, repeat_cycle AS repeat FROM breathing_exercises LIMIT 1'
    );
    res.json({ exercise: rows[0] });
  } catch (err) {
    console.error('Fetch breathing guide failed:', err);
    res.status(500).json({ error: 'Failed to fetch breathing guide.' });
  }
}

async function sendAnalytics(req, res) {
  try {
    const { rows } = await pool.query('SELECT route, count FROM analytics');
    res.json({ usage: rows });
  } catch (err) {
    console.error('Fetch analytics failed:', err);
    res.status(500).json({ error: 'Failed to fetch analytics.' });
  }
}

async function resetAnalyticsData(req, res) {
  try {
    await pool.query('UPDATE analytics SET count = 0');
    res.json({ message: 'Analytics reset successfully.' });
  } catch (err) {
    console.error('Reset analytics failed:', err);
    res.status(500).json({ error: 'Failed to reset analytics.' });
  }
}

async function listJournalEntries(req, res) {
  try {
    const { userId } = req.user;
    const { rows } = await pool.query(
      'SELECT id, text, mood, created_at FROM journal_entries WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    const entries = rows.map((r) => ({
      id: r.id,
      entry: r.text,
      mood: r.mood,
      timestamp: r.created_at.toISOString(),
    }));

    if (entries.length) {
      const ids = entries.map(e => e.id);
      const { rows: emos } = await pool.query(
        'SELECT entry_id, label, score FROM entry_emotions WHERE entry_id = ANY($1)',
        [ids]
      );

      const map = {};
      emos.forEach(({ entry_id, label, score }) => {
        (map[entry_id] ||= []).push({ label, score });
      });

      entries.forEach(e => {
        e.emotions = map[e.id] || [];
      });
    }

    res.json({ entries });
  } catch (err) {
    console.error('List journal entries failed:', err);
    res.status(500).json({ error: 'Failed to fetch journal entries.' });
  }
}


async function addJournalEntry(req, res) {
  const { userId } = req.user;
  const { text, mood } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO journal_entries(text, mood, user_id) VALUES($1, $2, $3) RETURNING id, text, mood, created_at, user_id',
      [text, mood, userId]
    );
    const e = rows[0];
    res.status(201).json({
      id: e.id,
      text: e.text,
      mood: e.mood,
      created_at: e.created_at,
      user_id: e.user_id,
    });
  } catch (err) {
    console.error('Add journal entry failed:', err);
    res.status(500).json({ error: 'Failed to add journal entry.' });
  }
}

async function analyzeEmotion(req, res) {
  const { userId } = req.user;
  const { entryId, text } = req.body;

  if (!entryId) return res.status(400).json({ error: 'Missing entryId' });

  try {
    // ✅ Check if entry belongs to the user
    const { rows } = await pool.query(
      'SELECT user_id FROM journal_entries WHERE id = $1',
      [entryId]
    );
    const entry = rows[0];
    if (!entry || entry.user_id !== userId) {
      return res.status(403).json({ error: 'Unauthorized: entry does not belong to you' });
    }

    // ✅ Continue with emotion analysis as usual
    const HF_TOKEN = process.env.HF_API_KEY;
    const MODEL = 'SamLowe/roberta-base-go_emotions';
    const fallback = [{ label: 'neutral', score: 1.0 }];

    let data;
    try {
      const hfRes = await fetch(
        `https://api-inference.huggingface.co/models/${MODEL}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${HF_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: `Analyze this journal entry's emotional tone: "${text}"`,
          }),
        }
      );
      data = hfRes.ok ? await hfRes.json() : fallback;
    } catch (err) {
      console.error('Emotion analysis failed:', err);
      return res.status(500).json({ error: 'External analysis failed.' });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      await client.query('DELETE FROM entry_emotions WHERE entry_id = $1', [entryId]);

      const flat = Array.isArray(data[0]) ? data.flat() : data;
      for (const item of flat) {
        if (
          !item ||
          typeof item.label !== 'string' ||
          typeof item.score !== 'number'
        ) {
          continue;
        }
        await client.query(
          'INSERT INTO entry_emotions(entry_id, label, score) VALUES($1, $2, $3)',
          [entryId, item.label, item.score]
        );
      }

      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('Failed to store emotion analysis:', err);
      return res.status(500).json({ error: 'Could not save analysis.' });
    } finally {
      client.release();
    }

    res.json({ analysis: data });
  } catch (err) {
    console.error('Error checking entry owner:', err);
    res.status(500).json({ error: 'Server error during analysis' });
  }
}


/**
 * Signup new user
 */
async function signupUser(req, res) {
  const { name, email, password, role = 'user' } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const isFirstUser = (await pool.query('SELECT COUNT(*) FROM users')).rows[0].count === '0';
    const finalRole = isFirstUser ? 'admin' : role || 'user';
    await pool.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4)',
      [name, email, hash, finalRole]
    );
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Signup failed:', err);
    res.status(400).json({ error: 'Email already exists or invalid data' });
  }
}

/**
 * Login user and return JWT
 */
async function loginUser(req, res) {
  const { email, password } = req.body;
  try {
    const { rows } = await pool.query(
      'SELECT id, name, email, password_hash, role FROM users WHERE email = $1',
      [email]
    );    
    const user = rows[0];
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { userId: user.id, name: user.name, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );    

    res.json({ token });
  } catch (err) {
    console.error('Login failed:', err);
    res.status(500).json({ error: 'Login failed' });
  }
}

/**
 * Auth middleware to protect routes
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// ── Start Server ────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Wellness API running on port ${PORT}`);
});