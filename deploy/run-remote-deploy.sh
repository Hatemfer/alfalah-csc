#!/usr/bin/env bash
# ========================================================
# Alfalah Community - One-Click Remote Deployment Runner
# Connects to Safozi VPS and executes setup-vps.sh
# ========================================================
set -euo pipefail

HOST="41.231.122.48"
PASS="C9[gd]F30l6wLI"

echo "========================================================"
echo "📡 Checking connectivity to VPS $HOST (Port 22)..."
echo "========================================================"

if ! nc -z -w 3 "$HOST" 22 2>/dev/null; then
    echo "⏳ Port 22 is not yet reachable on $HOST."
    echo "   The VPS container is still pending activation/startup on Safozi."
    echo "   Run this script again once the container has booted!"
    exit 1
fi

echo "🚀 VPS is UP! Starting automated deployment over SSH..."

expect -c '
set timeout 1800
spawn scp -o StrictHostKeyChecking=no deploy/setup-vps.sh root@41.231.122.48:/root/setup-vps.sh
expect "*password:*"
send -- "C9\[gd\]F30l6wLI\r"
expect eof

spawn ssh -o StrictHostKeyChecking=no root@41.231.122.48 "chmod +x /root/setup-vps.sh && /bin/bash /root/setup-vps.sh"
expect "*password:*"
send -- "C9\[gd\]F30l6wLI\r"
expect eof
'

echo "========================================================"
echo "🎉 Remote setup script finished!"
echo "========================================================"
