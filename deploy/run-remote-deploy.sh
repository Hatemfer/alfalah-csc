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

expect -c "
set timeout 1800
spawn ssh -o StrictHostKeyChecking=no root@$HOST \"curl -fsSL https://raw.githubusercontent.com/Hatemfer/alfalah-csc/main/deploy/setup-vps.sh | bash\"
expect {
    \"*password:*\" {
        send \"$PASS\r\"
        exp_continue
    }
    eof
}
"

echo "========================================================"
echo "🎉 Remote setup script finished!"
echo "========================================================"
