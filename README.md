# AI Wellness Companion 🧘‍♂️✨

An advanced full-stack app designed to promote emotional wellness with **motivational quotes**, **daily affirmations**, **guided breathing exercises**, and an **AI-powered journaling system**.

---

## 🧩 Project Structure

```
/frontend           → Next.js 15 + React 19 + Tailwind v4 + ShadCN UI
/backend            → Node.js + Express + PostgreSQL
/docker-compose.yml → defines frontend, backend, and postgres services
/deprecated         → old reference files (not in production)
```

---

## 🚀 How to Run (Docker‑Compose)

1. **Copy the example env file**  
   ```bash
   cp .env.example backend/.env
   ```
   Edit `.env` to set:
   ```env
   DATABASE_URL=postgres://appuser:apppass@postgres:5432/appdb
   PORT=4000
   HF_API_KEY=<your_huggingface_token>
   ```

2. **(Optional) Initialize your database schema**  
   Place any `.sql` files under `backend/db/init/` — Docker’s Postgres image will run them at startup.

3. **Bring up the stack**  
   ```bash
   docker-compose up --build -d
   ```

4. **Access the services**  
   - Frontend → http://localhost:3000  
   - Backend  → http://localhost:4000  
   - Postgres → port 5432 (service name: `postgres`)
   - pgAdmin  → port 8080 (service name: `pgAdmin`)

5. **Shut down**  
   ```bash
   docker-compose down
   ```

   To delete all database data:
   ```bash
   docker-compose down -v
   ```

---

## ✨ Features

- **Motivational Quotes**  
- **Daily Affirmations**  
- **Guided Breathing Exercises**  
- **Emotion‑analysis Journaling** 
- **Usage Analytics**

---

## 🛠️ Tech Stack

### Frontend
- Next.js 15 (App Router)  
- React 19  
- Tailwind CSS v4  
- ShadCN UI  
- TypeScript 

### Backend
- Node.js 18+  
- Express.js  
- PostgreSQL  

### Dev / Ops
- Docker & Docker Compose
- pgAdmin

---

## 🚦 Troubleshooting

- **Ports Conflicts**? Ensure `3000`, `4000`, and `5432` are free or adjust `docker-compose.yml` and `.env`.  
- **DB Errors**? Confirm `DATABASE_URL` is correct and any init scripts in `backend/db` ran successfully.  
- **Hugging Face**? Verify `HF_API_KEY` is set in your `.env`.

---

Enjoy the positivity! 🚀  
