#!/usr/bin/env bash
# ========================================================
# ALFALAH COMMUNITY SUPPORT CENTRE - VPS DEPLOYMENT SCRIPT
# ========================================================
set -euo pipefail

echo "========================================================"
echo "🚀 Starting Alfalah Community Deployment..."
echo "========================================================"

# 1. Check for .env file
if [ ! -f .env ]; then
    echo "⚠️  No .env file found!"
    if [ -f deploy/.env.production.example ]; then
        echo "📋 Creating .env from deploy/.env.production.example..."
        cp deploy/.env.production.example .env
        echo "❗ IMPORTANT: Edit .env and set your DOMAIN and SECRETS before continuing:"
        echo "   nano .env"
        exit 1
    else
        echo "❌ Error: deploy/.env.production.example not found."
        exit 1
    fi
fi

# 2. Build and start containers
echo "📦 Building production containers..."
docker compose build

echo "🔄 Starting services..."
docker compose up -d

# 3. Wait for database health check
echo "⏳ Waiting for MySQL database to become healthy..."
while [ "$(docker inspect -f '{{.State.Health.Status}}' alfalah-db 2>/dev/null)" != "healthy" ]; do
    sleep 2
    printf "."
done
echo " Ready!"

# 4. Run database migrations
echo "🗄️ Running TypeORM database migrations..."
docker compose exec backend node ./node_modules/typeorm/cli.js migration:run -d dist/data-source.js || true

# 5. Check if initial seed is required
echo "🌱 Ensuring default site settings and admin exist..."
docker compose exec backend node dist/seeds/seed.js || true

# 6. Show status
echo ""
echo "========================================================"
echo "✅ Deployment complete! Container status:"
echo "========================================================"
docker compose ps

echo ""
echo "Next step: Configure Nginx reverse proxy & SSL with your domain."
echo "See deploy/nginx/alfalah.conf for reference."
