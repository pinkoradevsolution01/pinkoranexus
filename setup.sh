#!/bin/bash

echo "Setting up Pinkora Multi-Tenant SaaS Dashboard..."

# Create databases and run migrations
echo "Creating PostgreSQL database..."
createdb saas_platform

echo "Running migrations..."
psql -U postgres -d saas_platform -f database/migrations/001_initial_schema.sql

echo "Seeding initial data..."
psql -U postgres -d saas_platform -f database/seeds/001_initial_data.sql

# Setup backend
echo "Setting up backend..."
cd backend
cp .env.example .env
npm install
cd ..

# Setup frontend
echo "Setting up frontend..."
cd frontend
cp .env.example .env
npm install
cd ..

echo "Setup complete!"
echo ""
echo "To start development:"
echo "1. Backend: cd backend && npm run dev"
echo "2. Frontend: cd frontend && npm start"
echo ""
echo "Low-storage option: use a managed PostgreSQL free tier and run only the Node.js apps locally."
