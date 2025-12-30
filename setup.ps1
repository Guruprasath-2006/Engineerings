# Aroma Luxe - Quick Start Script
# Run this script to set up the entire project

Write-Host "🌟 Welcome to Aroma Luxe Setup" -ForegroundColor Yellow
Write-Host "================================`n" -ForegroundColor Yellow

# Check if Node.js is installed
Write-Host "Checking prerequisites..." -ForegroundColor Cyan
if (Get-Command node -ErrorAction SilentlyContinue) {
    $nodeVersion = node --version
    Write-Host "✅ Node.js is installed: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Node.js is not installed. Please install from https://nodejs.org/" -ForegroundColor Red
    exit
}

# Backend Setup
Write-Host "`n📦 Setting up Backend..." -ForegroundColor Cyan
Set-Location -Path "backend"

Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
npm install

Write-Host "`nSeeding demo users..." -ForegroundColor Yellow
node seedUsers.js

Write-Host "`nSeeding sample perfume data..." -ForegroundColor Yellow
node seedData.js

Write-Host "✅ Backend setup complete!" -ForegroundColor Green

# Return to root directory
Set-Location -Path ".."

# Frontend Setup
Write-Host "`n📦 Setting up Frontend..." -ForegroundColor Cyan
Set-Location -Path "frontend"

Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
npm install

Write-Host "✅ Frontend setup complete!" -ForegroundColor Green

# Return to root directory
Set-Location -Path ".."

# Final Instructions
Write-Host "`n✨ Setup Complete!" -ForegroundColor Green
Write-Host "================================`n" -ForegroundColor Yellow

Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Start Backend Server (Terminal 1):" -ForegroundColor White
Write-Host "   cd backend" -ForegroundColor Gray
Write-Host "   npm start`n" -ForegroundColor Gray

Write-Host "2. Start Frontend Server (Terminal 2):" -ForegroundColor White
Write-Host "   cd frontend" -ForegroundColor Gray
Write-Host "   npm start`n" -ForegroundColor Gray

Write-Host "🔑 Demo Credentials:" -ForegroundColor Cyan
Write-Host "Admin: admin@aromaluxe.com / admin123" -ForegroundColor Gray
Write-Host "User:  user@aromaluxe.com / user123`n" -ForegroundColor Gray

Write-Host "🌐 URLs:" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Gray
Write-Host "Backend:  http://localhost:5000`n" -ForegroundColor Gray

Write-Host "Happy coding! 🚀✨" -ForegroundColor Yellow
