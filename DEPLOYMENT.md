# SocioSports Deployment Guide

## Production Environment Variables

### Backend (`server`)
You must set these in your production hosting environment (e.g., Render, Railway, AWS):

- `PORT`: (Default: 5000)
- `NODE_ENV`: `production`
- `DATABASE_URL`: Connection string for your production PostgreSQL database.
- `JWT_SECRET`: A long, random string for signing tokens.
- `SMTP_HOST`: Your email service host.
- `SMTP_PORT`: Usually 587 or 465.
- `SMTP_USER`: Email username.
- `SMTP_PASS`: Email password/app-password.

### Frontend (`app`)
- `VITE_API_URL`: The full URL of your production backend API (e.g., `https://api.sociosports.com/api`).

## Build Instructions

### Backend Build
```bash
cd server
npm install
npm run build
npm start
```

### Frontend Build
```bash
cd app
npm install
npm run build
```
The output will be in `app/dist`, which can be served as static files.

## Database Migrations
In production, use `npx prisma migrate deploy` to apply migrations safely without losing data.
