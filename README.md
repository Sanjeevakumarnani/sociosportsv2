# SocioSports - India's Premier Sports Ecosystem

![SocioSports Logo](app/public/images/logo.png)

SocioSports is a comprehensive digital foundation for India’s sports ecosystem. It brings together athletes, trainers, institutions, events, and communities on a single, high-performance platform designed for professional growth and institutional credibility.

## ⚡ Super-Quick Start (Windows)

If you are on Windows and want to get the site running **immediately**, follow these steps:

1.  **Run the Setup Script**:
    Right-click `setup-local.ps1` and select "Run with PowerShell" (or run `.\setup-local.ps1` in your terminal).
2.  **Start the Servers**:
    Once setup finishes, run the following command in the root folder:
    ```bash
    npm run dev
    ```
3.  **Login to Admin**:
    - **URL**: [http://localhost:5173/admin](http://localhost:5173/admin)
    - **Credentials**: `admin@sociosports.com` / `Admin@2026`

For detailed manual instructions, troubleshooting, and Linux/Mac setup, see [local-setup.md](local-setup.md).

---

## 🚀 100% Hardened & Production Ready

The platform has undergone a rigorous post-implementation audit to ensure maximum security, scalability, and connection resilience.

- **Frontend**: React 18 + Vite 7 + Tailwind CSS 3.4
- **Backend**: Node.js + Express + Prisma ORM
- **Database**: SQLite (Development) / PostgreSQL-ready (Production)
- **Security**: JWT-based RBAC (Role-Based Access Control) + Protected Admin Routes

---

## 🔥 Core Features

### 1. Athlete & Coach Ecosystem
- **Verified Registry**: Professional identity portal for athletes to showcase milestones.
- **Coach Booking**: Direct connection between NIS-certified coaches and talent.
- **Institutional Onboarding**: Dedicated pathways for sports academies and schools.

### 2. Events & Management
- **Tournament Hub**: Live registration and payment tracking for leagues.
- **Venue Booking**: Simple UI for sports facility owners to manage bookings.
- **Sports on Wheels**: Fleet management for mobile sports infrastructure units.

### 3. Intelligence & Community
- **Knowledge Hub**: Content-driven articles, podcasts, and athlete success stories.
- **Career Gateway**: Specialized job board for sports professionals (Physios, Managers, Coaches).
- **Arena of Unity**: Social networking hub for grassroots sports engagement.

### 4. Enterprise Admin Control
- **Dynamic Dashboard**: Real-time stats on users, events, and revenue.
- **Content CMS**: Full control over homepage heroes, team members, and blogs.
- **System Hardening**: Global error handling and secure secrets management.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React, TypeScript, GSAP (Animations), Lucide (Icons), Vite |
| **Backend** | Express, Node.js, Prisma ORM, JWT, Bcrypt |
| **Storage** | SQLite (Dev), Multer (File Uploads), Local Static Assets |
| **Analytics** | Google Analytics 4 (GA4) with Route Tracking |

---

## ⚡ Quick Start

### 1. Automated Setup (Windows)
If you are on Windows, simply run the setup script in the root directory:
```powershell
.\setup-local.ps1
```
This script will install all dependencies and set up the local database for you.

### 2. Manual Setup
Refer to [local-setup.md](local-setup.md) for step-by-step manual installation.

---

## 📄 Documentation

- [Project Handover](HANDOVER_REPORT.md) - **(Start Here)** SOW Compliance & Deliverables.
- [Technical Documentation](TECHNICAL_DOCS.md) - Architecture, Database Schema, and API details.
- [Deployment Guide](DEPLOYMENT.md) - Environment variables and production setup.
- [Setup Guide](local-setup.md) - Local development commands and automation.


---

*SocioSports: Empowering the Indian Athlete to Explore, Excel, and Grow.*
