#!/usr/bin/env bash
set -euo pipefail

HOST="41.231.122.48"
PASS="C9[gd]F30l6wLI"

echo "========================================================"
echo "🚀 Syncing Real Activities to Database on VPS ($HOST)..."
echo "========================================================"

expect -c '
set timeout 120
spawn scp -o StrictHostKeyChecking=no backend/scripts/sync-real-activities.js root@41.231.122.48:/var/www/alfalah/sync-real-activities.js
expect "*password:*"
send -- "C9\[gd\]F30l6wLI\r"
expect eof
'

expect -c '
set timeout 120
spawn ssh -o StrictHostKeyChecking=no root@41.231.122.48 "docker cp /var/www/alfalah/sync-real-activities.js alfalah-backend:/app/sync-real-activities.js && docker exec alfalah-backend node /app/sync-real-activities.js"
expect "*password:*"
send -- "C9\[gd\]F30l6wLI\r"
expect eof
'

echo "========================================================"
echo "✅ Activities Synced! Testing API..."
echo "========================================================"
curl -s https://alfalahcsc.com/api/v1/activities | grep -o '"title":"[^"]*"' || true
