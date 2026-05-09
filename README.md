# LeylaDigital Monorepo

Personal brand, portfolio, and marketing website.

## Setup Instructions

1. **Clone the repository**

2. **Environment Variables**
   Copy `.env.example` files to `.env` in the root, `backend/`, and `frontend/` directories.
   ```bash
   cp .env.example .env
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

3. **Start the environment**
   Run the following command to start PostgreSQL, Backend, and Frontend using Docker:
   ```bash
   docker-compose up --build
   ```

## Services
- **Frontend (Vite + React)**: http://localhost:3000
- **Backend (Express)**: http://localhost:4000
- **Database (PostgreSQL)**: localhost:5432
