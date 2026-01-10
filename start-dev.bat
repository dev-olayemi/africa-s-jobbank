@echo off
echo Starting JOBFOLIO Africa Development Servers...
echo.

REM Start backend in new window
start "Backend Server" cmd /k "cd backend && bun run dev"

REM Wait 3 seconds for backend to start
timeout /t 3 /nobreak > nul

REM Start frontend in new window
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ✅ Both servers are starting!
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:8080
echo.
echo Press any key to stop all servers...
pause > nul

REM Kill all node processes (stops both servers)
taskkill /F /IM node.exe /T > nul 2>&1
echo.
echo ✅ All servers stopped!
