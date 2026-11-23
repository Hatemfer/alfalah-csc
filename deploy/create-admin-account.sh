#!/usr/bin/env bash
set -euo pipefail

EMAIL="${1:-admin@alfalahcsc.com}"
PASSWORD="${2:-AlfalahAdmin2026!}"
NAME="${3:-Admin Alfalah}"

echo "========================================================"
echo "Creating/Updating admin account on VPS: $EMAIL"
echo "========================================================"

expect -c '
set timeout 60
spawn scp -o StrictHostKeyChecking=no backend/scripts/create-admin.js root@41.231.122.48:/var/www/alfalah/create-admin.js
expect "*password:*"
send -- "C9\[gd\]F30l6wLI\r"
expect eof
'

expect -c '
set timeout 60
set email [lindex $argv 0]
set password [lindex $argv 1]
set name [lindex $argv 2]
spawn ssh -o StrictHostKeyChecking=no root@41.231.122.48 "docker cp /var/www/alfalah/create-admin.js alfalah-backend:/app/create-admin.js && docker exec alfalah-backend node /app/create-admin.js \"$email\" \"$password\" \"$name\""
expect "*password:*"
send -- "C9\[gd\]F30l6wLI\r"
expect eof
' "$EMAIL" "$PASSWORD" "$NAME"

echo "========================================================"
echo "✅ Admin account ready: $EMAIL"
echo "========================================================"
