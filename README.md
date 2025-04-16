# AI Wellness Companion 🧘‍♂️✨

An advanced full-stack app designed to promote emotional wellness with **motivational quotes**, **daily affirmations**, **guided breathing exercises**, and an **AI-powered journaling system**.

---

## 🧩 Project Structure

```
/frontend   → Next.js 15 + React 19 + Tailwind v4 + ShadCN UI (Web App)
/backend    → Node.js + Express (API for quotes, affirmations, and exercises)
/deprecated → Old files used for reference that are no longer in production use
```

---

## 🚀 How to Run the Project

### 🔧 1. Clone the Repository

```bash
git clone https://github.com/your-username/ai-wellness-companion.git
cd ai-wellness-companion
```

---

### 🖥️ 2. Start the Backend

```bash
cd backend
npm install
npm start
```

The backend will start on: [http://localhost:4000](http://localhost:4000)

**Available routes:**
| Route         | Description                      |
|---------------|----------------------------------|
| `/motivation` | Get a random motivational quote  |
| `/affirmation`| Get a daily affirmation          |
| `/breathing`  | Get a breathing exercise guide   |
| `/analytics`  | View request analytics           |
| `/reset-analytics` | Reset analytics counters   |


If you want automatic restarts during development: `npx nodemon wellnessApp.js`

For production use, you can start it with pm2: `pm2 start wellnessApp.js`

If you need to stop the server: Press CTRL + C in the terminal.

If using pm2, stop it with: `pm2 stop wellnessApp.js`

---

### 🌐 3. Start the Frontend

```bash
cd ../frontend
npm install
npm run dev
```

The frontend will start on: [http://localhost:3000](http://localhost:3000)

---

## ✨ Features

- Motivational Quotes  
- Daily Affirmations  
- Breathing Exercise Guide  
- SmartJournal with emotion analysis  
- Emotion summaries and usage analytics  
- Frosted-glass UI with ShadCN and Tailwind  
- Full React 19 + App Router + Server Actions compatible  

---

## 🛠️ Tech Stack

### Frontend:
- **Next.js 15 (App Router)**
- **React 19**
- **Tailwind CSS v4**
- **ShadCN UI**
- **TypeScript**

### Backend:
- **Node.js**
- **Express.js**

---

## 🧠 Future Add-ons
- HuggingFace Emotion API integration
- OAuth 2.0 login
- Persistent journaling with PostgreSQL

---

## 🚦 Troubleshooting

- **Ports Conflicting**? Make sure port `4000` is free or update in both frontend and backend configs.

---

🚀 Enjoy the positivity! 