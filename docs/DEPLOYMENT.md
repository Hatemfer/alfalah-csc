# ALFALAH COMMUNITY SUPPORT CENTRE — VPS / OVH DEPLOYMENT GUIDE

## 1. Production Architecture Overview
- **Server Type**: Standard Ubuntu 22.04 / 24.04 LTS VPS (OVH, Hetzner, or private Linux VPS).
- **Reverse Proxy**: Nginx with Let's Encrypt automated SSL certificate renewal (`certbot`).
- **Process Manager**: PM2 or Docker Compose.
- **Database**: Local or managed MySQL 8.0+ / MariaDB 10.6+ bound to localhost.

---

## 2. Nginx Reverse Proxy Configuration
```nginx
# /etc/nginx/sites-available/alfalahcsc.com
server {
    listen 80;
    server_name alfalahcsc.com www.alfalahcsc.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name alfalahcsc.com www.alfalahcsc.com;

    ssl_certificate /etc/letsencrypt/live/alfalahcsc.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/alfalahcsc.com/privkey.pem;

    # Frontend (Next.js)
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend API
    location /api/v1/ {
        proxy_pass http://127.0.0.1:4000/api/v1/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static Uploads
    location /uploads/ {
        alias /var/www/alfalah/backend/uploads/;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
}
```

---

## 3. Deployment Steps
1. Clone repository to `/var/www/alfalah`
2. Create dedicated service user `alfalah`
3. Configure `/var/www/alfalah/.env` with production secrets
4. Install dependencies: `npm ci`
5. Run migrations: `npm run db:migrate`
6. Build applications: `npm run build`
7. Start processes using PM2:
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```
