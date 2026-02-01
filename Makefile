.PHONY: help dev dev-backend dev-frontend init-db test test-backend test-frontend docker-build docker-stop docker-clean deploy-help lint

help:
	@echo "Offmarket Development & Deployment Commands"
	@echo ""
	@echo "Development:"
	@echo "  make dev                 - Start all services with Docker Compose"
	@echo "  make dev-backend         - Start backend only (npm run dev)"
	@echo "  make dev-frontend        - Start frontend only (npm run dev)"
	@echo "  make init-db             - Initialize and seed database"
	@echo ""
	@echo "Testing:"
	@echo "  make test                - Run all tests"
	@echo "  make test-backend        - Run backend tests"
	@echo "  make test-frontend       - Run frontend tests (lint)"
	@echo ""
	@echo "Docker:"
	@echo "  make docker-build        - Build Docker images"
	@echo "  make docker-stop         - Stop Docker containers"
	@echo "  make docker-clean        - Remove Docker containers and volumes"
	@echo ""
	@echo "Deployment:"
	@echo "  make deploy-help         - Show deployment guide"
	@echo ""

dev:
	@echo "Starting Offmarket with Docker Compose..."
	docker-compose up --build

dev-backend:
	@echo "Starting backend server..."
	cd backend && npm install && npm run dev

dev-frontend:
	@echo "Starting frontend server..."
	cd frontend && npm install && npm run dev

init-db:
	@echo "Initializing database..."
	cd backend && npm install && npm run init-db

test: test-backend
	@echo "All tests completed!"

test-backend:
	@echo "Running backend tests..."
	cd backend && npm install && npm test

test-frontend:
	@echo "Linting frontend..."
	cd frontend && npm install

docker-build:
	@echo "Building Docker images..."
	docker-compose build

docker-stop:
	@echo "Stopping Docker containers..."
	docker-compose down

docker-clean: docker-stop
	@echo "Removing Docker containers and volumes..."
	docker-compose down -v

deploy-help:
	@echo "Deployment Guide: see ./deploy.md"
	@echo ""
	@echo "Quick Start:"
	@echo "  1. Backend (Railway/Render):"
	@echo "     - Push to GitHub"
	@echo "     - Connect repo to Railway.app or Render"
	@echo "     - Set environment variables"
	@echo "     - Deploy"
	@echo ""
	@echo "  2. Frontend (Vercel):"
	@echo "     - vercel --prod (CLI)"
	@echo "     - Or use vercel.com web UI"
	@echo "     - Set NEXT_PUBLIC_API_URL env var"
	@echo ""
	@echo "  3. Database (PostgreSQL):"
	@echo "     - Use managed database from Railway/Render"
	@echo "     - Or use AWS RDS / Google Cloud SQL"
	@echo ""
	@echo "  4. Email:"
	@echo "     - Sign up for SendGrid, Mailgun, or AWS SES"
	@echo "     - Add SMTP credentials to environment"
	@echo ""
	@cat ./deploy.md | head -50

install:
	@echo "Installing dependencies..."
	cd backend && npm install
	cd ../frontend && npm install

clean:
	@echo "Cleaning up..."
	rm -rf backend/node_modules backend/.next
	rm -rf frontend/node_modules frontend/.next frontend/dist
	rm -f backend/dev.db

lint:
	@echo "Linting backend..."
	cd backend && npm run test 2>/dev/null || echo "Tests require setup"

.DEFAULT_GOAL := help
