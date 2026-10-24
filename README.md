# ALFALAH COMMUNITY SUPPORT CENTRE (Birmingham, UK)
**Production-Ready Web Portal & Administrative Content Management System (CMS)**

Charity Number: 1150221 | Address: 89 Tindal Street, Balsall Heath, Birmingham, B12 9QU, United Kingdom

---

## 1. Overview
This monorepo contains the complete, production-ready website and Content Management System (CMS) for the **Alfalah Community Support Centre** (مركز الفلاح الإسلامي).

### Architecture
- **Monorepo Structure**:
  - `frontend/`: Next.js (App Router, React, TypeScript), Vanilla CSS design system for the public website, and Material-UI (MUI) for the `/admin` CMS dashboard.
  - `backend/`: NestJS, TypeScript, TypeORM, MySQL/MariaDB, Swagger OpenAPI (`/api/v1/docs`), Argon2id auth, Adhan astronomical prayer calculations, media management, rate limiting, and audit logging.
  - `infrastructure/`: Production Docker Compose, Nginx reverse-proxy configuration, systemd service units, and VPS backup/restore automation.
  - `docs/`: In-depth architecture, database schema, API reference, security, deployment, backups, and administrative user guide.

---

## 2. Quick Local Setup

### Prerequisites
- Node.js >= 20.x (current: v22.x)
- npm >= 10.x
- MySQL >= 8.0 or MariaDB >= 10.6

### 1. Environment Configuration
Copy `.env.example` files:
```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

### 2. Database Initialization
Local MySQL/MariaDB can be started directly or via Docker:
```bash
# Using local MariaDB/MySQL service:
mariadb -u root -e "CREATE DATABASE IF NOT EXISTS alfalah_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Migrations & Seed Development Data
```bash
npm run db:migrate
npm run db:seed
```

### 5. Start Development Servers
```bash
npm run dev
```
- **Public Website**: [http://localhost:3000](http://localhost:3000)
- **Admin CMS Dashboard**: [http://localhost:3000/admin](http://localhost:3000/admin)
- **Backend API**: [http://localhost:4000/api/v1](http://localhost:4000/api/v1)
- **Interactive Swagger Docs**: [http://localhost:4000/api/v1/docs](http://localhost:4000/api/v1/docs)

---

## 3. Monorepo Scripts
- `npm run dev`: Runs both frontend (port 3000) and backend (port 4000) concurrently.
- `npm run build`: Type-checks and builds both frontend and backend for production.
- `npm run lint`: Runs ESLint across all workspaces.
- `npm run typecheck`: Runs TypeScript compiler (`tsc --noEmit`) in all workspaces.
- `npm run test`: Runs unit and integration test suites.
- `npm run db:migrate`: Executes TypeORM database migrations.
- `npm run db:seed`: Seeds initial CMS settings, categories, and initial admin account.

---

## 4. Documentation Index
- [Architecture & Design](docs/ARCHITECTURE.md)
- [Database Schema & Migrations](docs/DATABASE.md)
- [API & Swagger Documentation](docs/API.md)
- [Security Specifications](docs/SECURITY.md)
- [Testing & Quality Assurance](docs/TESTING.md)
- [VPS & OVH Deployment Guide](docs/DEPLOYMENT.md)
- [Backup & Disaster Recovery](docs/BACKUPS.md)
- [Integrations (Prayer Times, Email, Maps, Media)](docs/INTEGRATIONS.md)
- [Administrator User Guide](docs/ADMIN_GUIDE.md)
