.PHONY: install dev build check lint test docker-build docker-up docker-down docker-logs

# Development
install:
	npm install

dev:
	npm run dev

build:
	npm run build

check:
	npm run check

lint:
	npm run lint

test:
	npm test

# Docker
docker-build:
	docker build -t strategy-platform-frontend .

docker-up:
	docker compose -f docker-compose.prod.yml up -d

docker-down:
	docker compose -f docker-compose.prod.yml down

docker-logs:
	docker compose -f docker-compose.prod.yml logs -f
