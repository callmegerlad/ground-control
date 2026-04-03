<div align="center">
  <img src="./frontend/public/static/logo.png" alt="Ground Control logo" width="100">
  <h1>☕️ Ground Control</h1>
  <p style="font-size:16px;font-weight:normal;">Full-stack cafe management system</p>
</div>

<div align="center">
  <p align="center">
    <a href="#introduction">Introduction</a> &nbsp;&bull;&nbsp;
    <a href="#system-overview">System Overview</a> &nbsp;&bull;&nbsp;
    <a href="#getting-started">Getting Started</a> &nbsp;&bull;&nbsp;
    <a href="#development-workflow">Development Workflow</a> &nbsp;&bull;&nbsp;
    <a href="#production-deployment">Production Deployment</a>
  </p>
</div>


## Introduction

**Ground Control** is a full-stack cafe management system designed to manage **cafes, employees, and their assignments**. It provides a clean, table-driven interface for operations while exposing a robust API for backend logic.

Built with a modern, containerised stack, the project supports both **local development** and **cloud-native deployment**.


## System Overview

### System Architecture

The application follows a typical **client-server architecture**:

* **Frontend (React + Vite)** communicates with the backend via REST APIs
* **Backend (FastAPI)** handles business logic and database operations
* **PostgreSQL** persists application data
* **Docker Compose** orchestrates all services locally


### Tech Stack

**Frontend**

* React
* Vite
* Ant Design
* AG Grid
* TanStack Query

**Backend**

* FastAPI
* SQLAlchemy
* Alembic
* Python 3.12+

**Database**

* PostgreSQL / Supabase

**Infrastructure & Tooling**

* Docker
* Docker Compose


### Repository Structure

```
.
├── backend/           # FastAPI application, models, migrations, seed scripts
├── frontend/          # React single-page application
├── docker-compose.yml # Local orchestration
```


### Environment Variables

#### Backend

* `DB_HOST`
* `DB_PORT`
* `DB_NAME`
* `DB_USER`
* `DB_PASSWORD`
* `FRONTEND_ORIGIN`

#### Frontend

* `VITE_API_BASE_URL`
* `VITE_ALLOWED_HOSTS`


## Getting Started

### Pre-requisites

* Docker & Docker Compose
* Node.js 22+ (optional, for local frontend dev)
* Python 3.12+ (optional, for local backend dev)


### 1. Clone the Repository

```bash
git clone git@github.com:callmegerlad/ground-control.git
cd ground-control
```

### 2. Run the Full Stack (Docker)

```bash
docker-compose up --build
```

Services will be available at:

* Frontend → [http://localhost:5173](http://localhost:5173)
* Backend → [http://localhost:8000](http://localhost:8000)
* API Docs → [http://localhost:8000/docs](http://localhost:8000/docs)

### 3. Seed the Database

```bash
docker-compose exec backend python manage_db.py seed
```

To reset and reseed:

```bash
docker-compose exec backend python manage_db.py reset
```


## Development Workflow

### Running Without Docker

#### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend

```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```


### Useful Commands

```bash
# Run backend tests
docker compose exec backend pytest

# Frontend linting
docker compose exec frontend npm run lint
```


### API Documentation

Interactive API docs are available via **Swagger UI**: http://localhost:8000/docs


## Production Deployment

The project is designed for deployment in **containerised environments** such as Google Cloud Run.


### Backend Deployment

* Build image from `backend/Dockerfile`
* Provide production database credentials via environment variables
* Ensure `FRONTEND_ORIGIN` matches deployed frontend URL for CORS

### Frontend Deployment

* Build image from `frontend/Dockerfile`
* Configure:

  * `VITE_API_BASE_URL` → Backend API URL
  * `VITE_ALLOWED_HOSTS` → Comma-separated hostnames

Example:

```bash
VITE_ALLOWED_HOSTS=ground-control-frontend-xxx.run.app,ground-control.geraldkjk.com
```

### Notes

* `allowedHosts` should contain **hostnames only** (no `https://`)
* Database can be initialised using backend seed scripts
* API is always explorable via `/docs`


## License

This project is for technical assessment and demonstration purposes.
