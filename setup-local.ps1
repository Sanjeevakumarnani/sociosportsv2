# SocioSports Local Setup Automation Script
# This script installs dependencies, sets up environment variables, and initializes the database.

Write-Host "🚀 Starting SocioSports Local Setup..." -ForegroundColor Cyan

# 1. Check for Node.js
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Error: Node.js is not installed. Please install Node.js (v18+) and try again." -ForegroundColor Red
    exit 1
}

# 1.5 Install Root Dependencies
Write-Host "`n📦 Installing root dependencies..." -ForegroundColor Yellow
npm install

# 2. Setup Backend (Server)
Write-Host "`n📁 Setting up Backend (server)..." -ForegroundColor Yellow
if (Test-Path "server") {
    Push-Location server
    
    Write-Host "📦 Installing backend dependencies..."
    npm install
    
    # Ensure essential directories exist
    $essentialDirs = @("uploads", "assets", "assets/emails")
    foreach ($dir in $essentialDirs) {
        if (!(Test-Path $dir)) {
            Write-Host "📁 Creating missing directory: $dir..."
            New-Item -ItemType Directory -Path $dir | Out-Null
        }
    }
    
    if (!(Test-Path ".env")) {
        Write-Host "⚙️ Creating .env from .env.example..."
        Copy-Item ".env.example" ".env"
    }
    else {
        Write-Host "ℹ️ .env already exists, skipping creation."
    }
    
    Write-Host "🗄️ Initializing Database (Prisma)..."
    npx prisma generate
    npx prisma db push --accept-data-loss
    
    Write-Host "🌱 Seeding Database..."
    npm run prisma:seed # Assuming prisma:seed or similar. Let's check package.json seed script.
    # From package.json: "prisma": { "seed": "ts-node prisma/seed-full.ts" }
    # So we can run: npx prisma db seed
    npx prisma db seed
    
    Pop-Location
}
else {
    Write-Host "❌ Error: 'server' directory not found." -ForegroundColor Red
}

# 3. Setup Frontend (App)
Write-Host "`n📁 Setting up Frontend (app)..." -ForegroundColor Yellow
if (Test-Path "app") {
    Push-Location app
    
    Write-Host "📦 Installing frontend dependencies..."
    npm install
    
    if (!(Test-Path ".env.local")) {
        Write-Host "⚙️ Creating .env.local from .env.example..."
        Copy-Item ".env.example" ".env.local"
    }
    else {
        Write-Host "ℹ️ .env.local already exists, skipping creation."
    }
    
    Pop-Location
}
else {
    Write-Host "❌ Error: 'app' directory not found." -ForegroundColor Red
}

Write-Host "`n✨ SocioSports Setup Complete! ✨" -ForegroundColor Green
Write-Host "--------------------------------------------------"
Write-Host "🚀 HOW TO START THE PLATFORM:" -ForegroundColor Cyan
Write-Host "1. In this terminal (or a new one), run: npm run dev" -ForegroundColor Yellow
Write-Host "   (This starts both backend and frontend simultaneously)"
Write-Host "`n🌐 ACCESS URLS:" -ForegroundColor Cyan
Write-Host "👉 Frontend / Website: http://localhost:5173"
Write-Host "👉 Admin Dashboard:  http://localhost:5173/admin"
Write-Host "`n🔐 ADMIN CREDENTIALS:" -ForegroundColor Cyan
Write-Host "📧 Email:    admin@sociosports.com"
Write-Host "🔑 Password: Admin@2026"
Write-Host "--------------------------------------------------"
Write-Host "`nHappy Coding! 🏅" -ForegroundColor Green
