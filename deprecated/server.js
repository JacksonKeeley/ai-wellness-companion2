const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// List of motivational quotes
const quotes = [
    "Believe in yourself!",
    "Every day is a second chance.",
    "You are stronger than you think.",
    "Keep going, you’re doing great!",
    "Your potential is endless.",
    "Difficulties in life are intended to make us better, not bitter."
];

// API endpoint to get a random motivational quote
app.get('/motivation', (req, res) => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    res.json({ message: randomQuote });
});

// Start the server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
