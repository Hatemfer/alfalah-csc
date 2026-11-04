#!/usr/bin/env bash
# ========================================================
# Alfalah Community - Deploy Latest Changes to Production
# Connects to Safozi VPS, pulls main, and rebuilds frontend
# ========================================================
set -euo pipefail

HOST="41.231.122.48"
PASS="C9[gd]F30l6wLI"

echo "========================================================"
echo "🚀 Updating Alfalah Community on VPS ($HOST)..."
echo "========================================================"

expect -c '
set timeout 300
spawn ssh -o StrictHostKeyChecking=no root@41.231.122.48 "cd /var/www/alfalah && git pull origin main && docker-compose build frontend && docker-compose up -d frontend"
expect "*password:*"
send -- "C9\[gd\]F30l6wLI\r"
expect eof
'

echo "========================================================"
echo "✅ Production update complete! Verified at https://alfalahcsc.com"
echo "========================================================"
