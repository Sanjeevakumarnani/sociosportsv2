# SocioSports Local Setup Guide

This guide provides detailed instructions for setting up the SocioSports platform on your local development machine.

## Prerequisites

- **Node.js**: Version 18.x or higher.
- **npm**: Usually comes with Node.js.
- **Git**: For cloning the repository.
- **SQLite**: (Optional) The project uses SQLite for local development, which is file-based and doesn't require a separate server installation.

---

## 🚀 Automated Setup (Recommended)

On Windows, you can run the provided automation script:

1.  Open PowerShell in the root directory.
2.  Run: `.\setup-local.ps1`

This will install all dependencies, configure your `.env` files, and initialize the database.

---

## 🛠️ Manual Setup

If you prefer to set up manually or are on a non-Windows system, follow these steps:

### 1. Clone the Repository
```bash
git clone <repository-url>
cd SocioSports
```

### 2. Backend Setup (`server`)
```bash
cd server
npm install
```

**Environment Variables:**
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure `DATABASE_URL` is set to `file:./dev.db` for local development.

**Database Initialization:**
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

### 3. Frontend Setup (`app`)
```bash
cd ../app
npm install
```

**Environment Variables:**
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
The default `VITE_API_URL` should be `http://localhost:5000/api`.

---

## 🏃 Running the Application

You will need two terminal windows:

### Terminal 1: Backend
```bash
cd server
npm run dev
```

### Terminal 2: Frontend
```bash
cd app
npm run dev
```

The frontend will usually be available at `http://localhost:5173`.

### Centralized Control (Root)
If you have run the automated setup or if you have `concurrently` installed, you can start both servers from the root:
```bash
npm run dev
```

Other root commands:
- `npm run install:all`: Installs dependencies for root, server, and app.
- `npm run build:all`: Builds both frontend and backend.
- `npm run setup`: Runs the Windows setup script.

---

## 🛡️ Admin Access
After seeding, you can log in to the admin panel with:
- **Email**: `admin@sociosports.com` (or as defined in `prisma/seed-full.ts`)
- **Password**: Check `prisma/seed-full.ts` or the `create-admin.ts` script for default credentials.

---

## ❓ Troubleshooting

### 1. Node.js Version
The project requires **Node.js v18** or higher.
- Check version: `node -v`
- If you have multiple versions, use `nvm` (Node Version Manager) to switch.

### 2. Port Conflicts
- **Backend (5000)**: If port 5000 is in use (common on macOS), the server will fail to start.
    - Solution: Change `PORT=5000` in `.env` to another value like `5001`.
- **Frontend (5173)**: If 5173 is in use, Vite will automatically try the next port (5174, etc.).

### 3. Prisma & SQLite Errors
- **Lock Errors**: If you see "Database is locked", ensure no other process is using `dev.db`.
- **Schema Mismatch**: If you change the schema, run `npx prisma db push`.
- **Seeding Failures**: If seeding fails, try `npx prisma migrate reset` (Caution: this wipes data).

### 4. Missing Assets
- Ensure `server/assets/emails` contains the following images for email templates:
    - `header.png`
    - `footer.png`
    - `welcome.png`
- If missing, the email service will still start but might log warnings or fail to send images.

### 5. Frontend Build (Vite)
- If you see "Vite command not found", ensure `npm install` finished successfully in the `app` folder.
- For production build: `npm run build`

## 🎬 Getting Started (First Run)

Once your setup is complete and you have run `npm run dev`:

1.  **Open the Website**: Go to [http://localhost:5173](http://localhost:5173) in your browser.
2.  **Access Admin**: Navigate to [http://localhost:5173/admin](http://localhost:5173/admin).
3.  **Login**:
    - **Email**: `admin@sociosports.com`
    - **Password**: `Admin@2026`
4.  **Explore**: You can now manage events, institutions, blog posts, and site content from the dashboard.

---

## 🛠️ Development Workflow

- **Database GUI**: Run `npx prisma studio` in the `server` folder to view and edit data in your browser.
- **Adding Dependencies**: Always install in the specific folder (`server` or `app`).
