const cors = require('cors');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;
app.use(cors());
// Middleware for JSON requests
app.use(express.json());

const requestCount = {};

// Middleware to track route usage
app.use((req, res, next) => {
    const route = req.path;
    if (route !== "/analytics") {
        requestCount[route] = (requestCount[route] || 0) + 1;
        console.log(`Route ${route} accessed ${requestCount[route]} times.`);
    }
    next();
});

// Sample data for different wellness features
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

// Function to simulate a simple breathing exercise
function breathingExercise() {
    return {
        step1: "Inhale deeply for 4 seconds",
        step2: "Hold your breath for 7 seconds",
        step3: "Exhale slowly for 8 seconds",
        repeat: "Repeat for 5 cycles"
    };
}

// API route: Get a random motivational quote
app.get('/motivation', (req, res) => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    res.json({ message: randomQuote });
});

// API route: Get a daily affirmation
app.get('/affirmation', (req, res) => {
    const randomAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];
    res.json({ affirmation: randomAffirmation });
});

// API route: Get a simple breathing exercise guide
app.get('/breathing', (req, res) => {
    res.json({ exercise: breathingExercise() });
});

// API route: Fetch analytics
app.get('/analytics', (req, res) => {
    res.json({ usage: requestCount });
});

// API route: Reset analytics data
app.post('/reset-analytics', (req, res) => {
    Object.keys(requestCount).forEach(route => delete requestCount[route]); // Remove all keys
    console.log("Analytics reset.");
    res.json({ message: "Analytics reset successfully." });
});


// Start the server
app.listen(PORT, () => console.log(`🚀 Wellness API running on port ${PORT}`));
