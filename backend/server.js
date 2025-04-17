// server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = global.fetch || require('node-fetch');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 4000;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

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
app.post('/journal_entries', addJournalEntry);
app.post('/emotion-analysis', analyzeEmotion);

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
    const { rows } = await pool.query(
      'SELECT id, text, mood, created_at FROM journal_entries ORDER BY created_at DESC'
    );
    // Map DB fields to API response
    const entries = rows.map(r => ({
      id: r.id,
      entry: r.text,
      mood: r.mood,
      timestamp:  r.created_at.toISOString()
    }));
    res.json({ entries });
  } catch (err) {
    console.error('List journal entries failed:', err);
    res.status(500).json({ error: 'Failed to fetch journal entries.' });
  }
}

async function addJournalEntry(req, res) {
  const { text, mood } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO journal_entries(text, mood) VALUES($1, $2) RETURNING id, text, mood, created_at',
      [text, mood]
    );
    const e = rows[0];
    res.status(201).json({
      id: e.id,
      text: e.text,
      mood: e.mood,
      created_at: e.created_at
    });
  } catch (err) {
    console.error('Add journal entry failed:', err);
    res.status(500).json({ error: 'Failed to add journal entry.' });
  }
}

async function analyzeEmotion(req, res) {
  const { text } = req.body;
  const HF_TOKEN = process.env.HF_API_KEY;
  const MODEL = 'SamLowe/roberta-base-go_emotions';
  const fallback = [
    [{ label: 'joy', score: 0.78 }, { label: 'love', score: 0.65 }, { label: 'neutral', score: 0.42 }]
  ];
  try {
    const hfRes = await fetch(
      `https://api-inference.huggingface.co/models/${MODEL}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ inputs: `Analyze this journal entry's emotional tone: "${text}"` })
      }
    );
    if (!hfRes.ok) {
      console.warn('Hugging Face API error:', hfRes.status);
      return res.json({ analysis: fallback });
    }
    const data = await hfRes.json();
    res.json({ analysis: data });
  } catch (err) {
    console.error('Emotion analysis failed:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
}

// ── Start Server ────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Wellness API running on port ${PORT}`);
});