# Docker Development Guide

This document covers the common Docker Compose commands for developing, logging, and stopping Next.js + Express backend and Next.js frontend.

## Prerequisites

- Docker & Docker Compose installed
- Project root contains:
  - `docker-compose.yml`
  - `Dockerfile.frontend`
  - `Dockerfile.backend`
  - `.dockerignore`

## 1. Build & Run Services

### Full stack (frontend + backend)
```bash
# Build images and start containers in detached mode
docker-compose up --build -d
```

### Individual service
```bash
# Start only the backend service
docker-compose up --build -d backend

# Start only the frontend service
docker-compose up --build -d frontend
```

## 2. View Logs

### Follow all logs
```bash
docker-compose logs -f
```

### Follow a specific service
```bash
# Backend logs
docker-compose logs -f backend

# Frontend logs
docker-compose logs -f frontend
```

## 3. Stop & Clean Up

```bash
# Stop and remove containers, networks
docker-compose down

# Stop, remove containers, networks, and volumes (data reset)
docker-compose down -v
```

## 4. Rebuild Images

Use this when Dockerfile or dependencies change.

```bash
# Backend only
docker-compose build backend

# Frontend only
docker-compose build frontend

# Rebuild both
docker-compose build
```

## 5. Exec into a Container

```bash
# Open a shell in the backend container
docker-compose exec backend sh

# Open a shell in the frontend container
docker-compose exec frontend sh
```

## 6. Useful Docker Compose Shortcuts

- `docker-compose ps` — List running containers
- `docker-compose restart <service>` — Restart a specific service
