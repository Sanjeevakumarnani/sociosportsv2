# SocioSports Technical Documentation

## Architecture Overview

SocioSports is built as a decoupled Client-Server architecture.

### Frontend (`app`)
- **Framework**: React 18
- **Build Tool**: Vite 7
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3.4
- **Animations**: GSAP & Framer Motion

### Backend (`server`)
- **Runtime**: Node.js
- **Framework**: Express.js
- **ORM**: Prisma
- **Database**: SQLite (Local Dev) / PostgreSQL (Production ready)
- **Auth**: JWT (JSON Web Tokens) with Role-Based Access Control

### Orchestration Layer
- **Package Manager**: npm (Workspace-like structure with root `package.json`)
- **Task Runner**: `concurrently` for running dev servers in parallel.
- **Automation**: `setup-local.ps1` (PowerShell) for environment bootstrapping.

## Database Schema
The database schema is defined in [server/prisma/schema.prisma](file:///c:/Users/ssk/Desktop/kimi/SocioSports/server/prisma/schema.prisma).

Key Models:
- `User`: Handles authentication and roles (ADMIN, USER, COACH, etc.)
- `Event`: Manages sports tournaments and bookings.
- `TeamMember`: CMS-driven team profiles.
- `PageContent`: Flexible JSON storage for dynamic website content.
- `Post`: Blog and news articles.

## API Endpoints
The API base URL is `/api`.

- `/auth`: Login, Register, Profile management.
- `/events`: CRUD for sports events.
- `/content`: Fetching dynamic page sections.
- `/team`: Retrieving team and advisor data.
- `/posts`: Blog post management.

## File Uploads
The server uses `multer` for handling file uploads, storing them in the `server/uploads` directory. In production, this should be moved to a cloud storage provider (like AWS S3).
