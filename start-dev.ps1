# Start both frontend and backend in separate terminals
Write-Host "Starting Nada Al-Hareer development servers..." -ForegroundColor Cyan

# Start backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\server'; npm run dev"

# Wait 2 seconds for backend to start
Start-Sleep -Seconds 2

# Start frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; npm run dev"

Write-Host ""
Write-Host "Servers starting:" -ForegroundColor Green
Write-Host "  Backend  -> http://localhost:5000" -ForegroundColor Yellow
Write-Host "  Frontend -> http://localhost:3000" -ForegroundColor Yellow
Write-Host ""
Write-Host "To seed the database, run: cd server && npm run seed" -ForegroundColor Cyan
