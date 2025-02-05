const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const quotes = [
    "Believe in yourself!",
    "Every day is a second chance.",
    "You are stronger than you think.",
    "Keep going, you’re doing great!",
    "Your potential is endless."
];

app.get('/motivation', (req, res) => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    res.json({ message: randomQuote });
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
