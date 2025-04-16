require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware to parse JSON
app.use(express.json());

// Track route usage
const requestCount = {};
app.use((req, res, next) => {
    const route = req.path;
    if (route !== "/analytics") {
        requestCount[route] = (requestCount[route] || 0) + 1;
        console.log(`Route ${route} accessed ${requestCount[route]} times.`);
    }
    next();
});

// ===== Sample Content =====
const quotes = [
    "Believe in yourself!",
    "Every day is a second chance.",
    "You are stronger than you think.",
    "Keep going, you’re doing great!",
    "Your potential is endless."
];

const affirmations = [
    "I am confident and strong.",
    "I deserve happiness and success.",
    "I am in control of my thoughts and emotions.",
    "I radiate positive energy.",
    "I am growing and improving every day."
];

function breathingExercise() {
    return {
        step1: "Inhale deeply for 4 seconds",
        step2: "Hold your breath for 7 seconds",
        step3: "Exhale slowly for 8 seconds",
        repeat: "Repeat for 5 cycles"
    };
}

// ===== Journal Entries In-Memory Store =====
let journalEntries = [];

// ===== API Routes =====

// 🧠 SmartJournal Routes
app.post('/journal', (req, res) => {
    const { entry, mood } = req.body;
    if (!entry) return res.status(400).json({ error: "Journal entry is required." });

    const newEntry = {
        id: journalEntries.length + 1,
        timestamp: new Date(),
        entry,
        mood: mood || "neutral"
    };

    journalEntries.push(newEntry);
    res.status(201).json({ message: "Journal entry saved.", entry: newEntry });
});

app.get('/journal', (req, res) => {
    res.json({ entries: journalEntries });
});

app.get('/journal/summary', (req, res) => {
    if (journalEntries.length === 0) {
        return res.json({ summary: "No journal entries to summarize." });
    }

    const combined = journalEntries.map(e => e.entry).join(' ');
    const wordCount = combined.split(/\s+/).length;

    res.json({
        summary: `You’ve written ${journalEntries.length} entries, totaling ${wordCount} words.`,
        lastMood: journalEntries[journalEntries.length - 1].mood
    });
});

// 💬 Motivation & Mindfulness
app.get('/motivation', (req, res) => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    res.json({ message: randomQuote });
});

app.get('/affirmation', (req, res) => {
    const randomAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];
    res.json({ affirmation: randomAffirmation });
});

app.get('/breathing', (req, res) => {
    res.json({ exercise: breathingExercise() });
});

// 📊 Analytics Routes
app.get('/analytics', (req, res) => {
    res.json({ usage: requestCount });
});

app.post('/reset-analytics', (req, res) => {
    Object.keys(requestCount).forEach(route => delete requestCount[route]);
    console.log("Analytics reset.");
    res.json({ message: "Analytics reset successfully." });
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Wellness API running on port ${PORT}`));
