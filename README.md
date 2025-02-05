# AI Wellness Companion 🧘‍♂️✨
A simple Node.js API that provides random motivational quotes.

## 🚀 How to Run

1. **Install dependencies:**
2. **Start the server:**
3. **Get a motivational quote:**
Open your browser and go to: http://localhost:3000/motivation

## 📌 Features
- Provides **random motivational quotes**.
- Built with **Node.js + Express**.
- Easy to deploy and extend.

---

🚀 **Enjoy the positivity!** add some information about the updated version

A more advanced **Node.js API** that provides users with **motivational quotes, daily affirmations, and guided breathing exercises** to promote mental well-being.

---

## 🚀 How to Run the Project (Step by Step)

### **1️⃣ Clone the Repository**
First, open a terminal or command prompt and clone the repository from GitHub:
 git clone https://github.com/your-username/ai-wellness-companion2.git

Then, move into the project directory:
cd ai-wellness-companion2

npm install

This will install:

express (Web framework)
dotenv (For environment variables)
nodemon (For automatic restarts in development)
concurrently (For running multiple scripts)
pm2 (For process management in production)

If you need to install them manually, run: npm install express dotenv nodemon concurrently pm2

To start the API, run:
npm start

or, if you want automatic restarts during development:
npx nodemon wellnessApp.js

For production use, you can start it with pm2:
pm2 start wellnessApp.js

Once the server is running, you can access the API in your browser or use Postman.
/motivation	Get a random motivational quote	http://localhost:4000/motivation
/affirmation	Get a daily affirmation	http://localhost:4000/affirmation
/breathing	Get a breathing exercise guide	http://localhost:4000/breathing

If you need to stop the server:
Press CTRL + C in the terminal.

If using pm2, stop it with:
pm2 stop wellnessApp.js

🛠️ Built With
Node.js – JavaScript runtime.
Express.js – Fast and minimal backend framework.
JavaScript – Core language for this project.

