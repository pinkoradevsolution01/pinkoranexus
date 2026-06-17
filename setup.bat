@echo off
REM Pinkora Multi-Tenant SaaS Dashboard Setup Script for Windows

echo Setting up Pinkora Multi-Tenant SaaS Dashboard...
echo.

REM Setup backend
echo Setting up backend...
cd backend
copy .env.example .env
call npm install
cd ..

echo.
REM Setup frontend
echo Setting up frontend...
cd frontend
copy .env.example .env
call npm install
cd ..

echo.
echo Setup complete!
echo.
echo To start development:
echo 1. Backend: cd backend ^&^& npm run dev
echo 2. Frontend: cd frontend ^&^& npm start
echo.
echo Low-storage option: use a managed PostgreSQL free tier and run only the Node.js apps locally.
echo.
pause
