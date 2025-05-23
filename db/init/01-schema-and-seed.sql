-- db/init/01-schema-and-seed.sql

-- ── Quotes ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS quotes (
  id   SERIAL PRIMARY KEY,
  message TEXT NOT NULL
);

INSERT INTO quotes (message) VALUES
('Believe in yourself!'),
('Every day is a second chance.'),
('You are stronger than you think.'),
('Keep going, you’re doing great!'),
('Your potential is endless.'),
('You’ve got this!'),
('Make today count.'),
('Start where you are.'),
('Small progress is progress.'),
('Turn setbacks into comebacks.'),
('Push yourself; no one else will.'),
('Success starts with self-discipline.'),
('Believe, act, achieve.'),
('Stay curious, stay driven.'),
('Your effort defines your future.')
ON CONFLICT DO NOTHING;

-- ── Affirmations ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS affirmations (
  id   SERIAL PRIMARY KEY,
  text TEXT NOT NULL
);

INSERT INTO affirmations (text) VALUES
('I am confident and strong.'),
('I deserve happiness and success.'),
('I am in control of my thoughts and emotions.'),
('I radiate positive energy.'),
('I am growing and improving every day.')
ON CONFLICT DO NOTHING;

-- ── Wellness Tips ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS wellness_tips (
  id   SERIAL PRIMARY KEY,
  message TEXT NOT NULL
);

INSERT INTO wellness_tips (message) VALUES
('Take a 5-minute walk in nature'),
('Practice gratitude journaling'),
('Hydrate with a glass of water'),
('Stretch your body for 2 minutes'),
('Call a friend for a quick chat')
ON CONFLICT DO NOTHING;

-- ── Fitness Goals ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS fitness_goals (
  id SERIAL PRIMARY KEY,
  label TEXT NOT NULL
);

INSERT INTO fitness_goals (label) VALUES
  ('Walk 5,000 steps'),
  ('Drink 8 cups of water'),
  ('Stand up every hour'),
  ('Stretch for 5 minutes'),
  ('Get 7+ hours of sleep');


-- ── Breathing exercises ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS breathing_exercises (
  id    SERIAL PRIMARY KEY,
  step1 TEXT NOT NULL,
  step2 TEXT NOT NULL,
  step3 TEXT NOT NULL,
  repeat_cycle TEXT NOT NULL
);

INSERT INTO breathing_exercises (step1, step2, step3, repeat_cycle) VALUES
('Inhale deeply for 4 seconds', 'Hold your breath for 7 seconds', 'Exhale slowly for 8 seconds', 'Repeat for 5 cycles')
ON CONFLICT DO NOTHING;

-- ── Analytics counts ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS analytics (
  route TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 0
);

-- ── Journal entries ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS journal_entries (
  id SERIAL PRIMARY KEY,
  text TEXT NOT NULL,
  mood TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id INTEGER REFERENCES users(id)
);

-- ── Emotion analysis ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS entry_emotions (
  id        SERIAL PRIMARY KEY,
  entry_id  INTEGER NOT NULL
             REFERENCES journal_entries(id)
             ON DELETE CASCADE,
  label     TEXT    NOT NULL,
  score     REAL    NOT NULL  -- store as fraction (0.0–1.0); multiply by 100 in client for % if desired
);
