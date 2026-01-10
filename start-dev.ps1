# JOBFOLIO Africa - Development Startup Script
# This script starts both backend and frontend servers

Write-Host "🚀 Starting JOBFOLIO Africa Development Environment..." -ForegroundColor Cyan
Write-Host ""

# Check if backend is already running
$backendRunning = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object {$_.Path -like "*backend*"}

if ($backendRunning) {
    Write-Host "✅ Backend server is already running" -ForegroundColor Green
} else {
    Write-Host "📦 Starting Backend Server..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; Write-Host '🔧 Backend Server' -ForegroundColor Cyan; bun run dev"
    Start-Sleep -Seconds 3
}

# Check if frontend is already running
$frontendRunning = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object {$_.CommandLine -like "*vite*"}

if ($frontendRunning) {
    Write-Host "✅ Frontend server is already running" -ForegroundColor Green
} else {
    Write-Host "🎨 Starting Frontend Server..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host '🎨 Frontend Server' -ForegroundColor Cyan; bun run dev"
    Start-Sleep -Seconds 3
}

Write-Host ""
Write-Host "✅ Development environment started!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Backend API: http://localhost:5000" -ForegroundColor Cyan
Write-Host "📍 Frontend App: http://localhost:8080" -ForegroundColor Cyan
Write-Host "📍 Test Dashboard: Open auth-test-dashboard.html in browser" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C in each terminal to stop the servers" -ForegroundColor Yellow
