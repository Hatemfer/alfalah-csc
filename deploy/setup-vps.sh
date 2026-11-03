#!/usr/bin/env bash
# ========================================================
# ALFALAH COMMUNITY SUPPORT CENTRE - COMPLETE VPS SETUP
# Ubuntu 22.04 LTS Automated Provisioning & Deployment
# ========================================================
set -euo pipefail

DOMAIN="alfalahcsc.com"
APP_DIR="/var/www/alfalah"
REPO_URL="https://github.com/Hatemfer/alfalah-csc.git"

echo "========================================================"
echo "🕌 ALFALAH COMMUNITY SUPPORT CENTRE - PRODUCTION SETUP"
echo "========================================================"

# 1. Swap creation (2GB swap to guarantee smooth Docker builds)
if [ ! -f /swapfile ]; then
    echo "⚙️  Configuring 2GB Swap space..."
    (fallocate -l 2G /swapfile || dd if=/dev/zero of=/swapfile bs=1M count=2048) 2>/dev/null || true
    if [ -f /swapfile ]; then
        chmod 600 /swapfile
        mkswap /swapfile 2>/dev/null || true
        swapon /swapfile 2>/dev/null || true
        echo '/swapfile none swap sw 0 0' >> /etc/fstab
        echo "✅ Swap configured."
    fi
else
    echo "ℹ️  Swap already exists."
fi

# 2. System updates & essential packages
echo "📦 Updating system packages..."
rm -f /etc/apt/sources.list.d/*virtuozzo* /etc/apt/sources.list.d/*ctpreset* /etc/apt/sources.list.d/*ct-preset* 2>/dev/null || true
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    git \
    nginx \
    certbot \
    python3-certbot-nginx \
    ufw \
    net-tools \
    dnsutils

# 3. Install official Docker Engine & Docker Compose plugin
if ! command -v docker &> /dev/null; then
    echo "🐳 Installing Docker Engine..."
    install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    chmod a+r /etc/apt/keyrings/docker.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
    apt-get update -y
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    systemctl enable docker
    systemctl start docker
    echo "✅ Docker installed."
else
    echo "ℹ️  Docker is already installed."
fi

# 4. Clone or pull repository
echo "📥 Checking application directory..."
mkdir -p /var/www
if [ ! -d "$APP_DIR/.git" ]; then
    echo "🚀 Cloning repository from GitHub..."
    git clone "$REPO_URL" "$APP_DIR"
else
    echo "🔄 Pulling latest changes from GitHub..."
    cd "$APP_DIR"
    git fetch origin main
    git reset --hard origin/main
fi

cd "$APP_DIR"

# 5. Production .env setup
if [ ! -f .env ]; then
    echo "🔐 Creating production .env file..."
    cp deploy/.env.production.example .env
    
    # Generate secure random keys
    DB_PASS=$(openssl rand -hex 16)
    DB_ROOT_PASS=$(openssl rand -hex 16)
    JWT_SEC=$(openssl rand -base64 36 | tr -dc 'a-zA-Z0-9')
    COOKIE_SEC=$(openssl rand -base64 36 | tr -dc 'a-zA-Z0-9')
    
    sed -i "s/CHANGE_ME_STRONG_DB_PASSWORD_2026/$DB_PASS/" .env
    sed -i "s/CHANGE_ME_STRONG_ROOT_PASSWORD_2026/$DB_ROOT_PASS/" .env
    sed -i "s/GENERATE_64_CHAR_RANDOM_SECRET_KEY_HERE/$JWT_SEC/" .env
    sed -i "s/GENERATE_64_CHAR_RANDOM_COOKIE_SECRET_HERE/$COOKIE_SEC/" .env
    echo "✅ Production .env generated with unique secrets."
fi

# 6. Build and launch Docker containers
echo "🚀 Building and starting Docker containers..."
docker compose build --pull
docker compose up -d

# 7. Configure Nginx Reverse Proxy
echo "🌐 Configuring Nginx reverse proxy..."
cp deploy/nginx/alfalah.conf /etc/nginx/sites-available/alfalah
ln -sf /etc/nginx/sites-available/alfalah /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

nginx -t
systemctl reload nginx
echo "✅ Nginx reverse proxy active on port 80."

# 8. Firewall Configuration
echo "🛡️  Configuring UFW Firewall (SSH, HTTP, HTTPS)..."
ufw allow OpenSSH || ufw allow 22/tcp
ufw allow 'Nginx Full' || (ufw allow 80/tcp && ufw allow 443/tcp)
echo "y" | ufw enable || true

# 9. SSL Certificate with Let's Encrypt
echo "🔒 Checking domain DNS for SSL certificate..."
CURRENT_IP=$(curl -s https://api.ipify.org || hostname -I | awk '{print $1}')
RESOLVED_IP=$(dig +short "$DOMAIN" | tail -n1 || true)

echo "Server IP:   $CURRENT_IP"
echo "Resolved IP: $RESOLVED_IP"

if [ "$CURRENT_IP" = "$RESOLVED_IP" ]; then
    echo "🎉 DNS matches! Requesting Let's Encrypt SSL certificate..."
    certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --non-interactive --agree-tos -m admin@"$DOMAIN" --redirect || true
    echo "✅ SSL certificate active! Website live at https://$DOMAIN"
else
    echo "⚠️  DNS for $DOMAIN does not point to $CURRENT_IP yet."
    echo "   Once client updates DNS, run:"
    echo "   sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN --agree-tos -m admin@$DOMAIN --redirect"
fi

echo ""
echo "========================================================"
echo "🎉 ALFALAH COMMUNITY SUPPORT CENTRE DEPLOYMENT COMPLETE!"
echo "========================================================"
