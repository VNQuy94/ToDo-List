# Todo List

A production-ready, containerized full-stack ToDo-List application built using MongoDB, Express, React, and Node.js.

## Project Structure

```text
├── backend/            # Express REST API Server
├── frontend/           # React 19 Client (Vite, Tailwind, shadcn/ui)
├── data/               # Seed data definitions (todos.json)
├── scripts/            # Database operational scripts (seed, clear, reset)
├── docker-compose.yml  # Orchestrates MongoDB, backend, frontend, and db-seeder
└── package.json        # Workspace-wide NPM tasks and dependencies
```

## Prerequisites

- [Node.js v20+](https://nodejs.org/)
- [pnpm v9+](https://pnpm.io/)
- [Docker & Docker Compose](https://www.docker.com/get-started/)

## Getting Started

### 1. Environment Configurations
Clone the `.env.example` configurations to local `.env` files:
```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### 2. Local Development
Install dependencies and run the client/server separately:
```bash
# Install monorepo dependencies
pnpm install

# Run backend API server (http://localhost:5000)
pnpm dev:backend

# Run frontend client (http://localhost:5173)
pnpm dev:frontend
```

---

## Running with Docker Compose

Spin up the entire stack (MongoDB, Backend, Frontend) with integrated healthchecks and isolated networks:
```bash
docker compose up -d
```

- **Frontend Client**: `http://localhost:5173`
- **Backend API Docs (Swagger)**: `http://localhost:5000/api-docs`

---

## Database Seeding Operations

We support database seeding in both local environments and within Docker using a profile-gated seeder container.

### Local Commands
```bash
pnpm seed         # Seed database (skipped if already seeded)
pnpm seed:clear   # Delete all todo records
pnpm seed:reset   # Delete all records, then re-seed
```

### Docker Compose Commands
```bash
pnpm docker:seed        # Seed database inside Docker
pnpm docker:seed:clear  # Clear database inside Docker
pnpm docker:seed:reset  # Reset database inside Docker
```
