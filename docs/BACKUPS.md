# ALFALAH COMMUNITY SUPPORT CENTRE — BACKUP & DISASTER RECOVERY

## 1. Backup Strategy
Production deployments require automated daily backups with a 30-day retention policy:
1. **Database**: MySQL dump encrypted with GPG.
2. **Media Assets**: Compressed archive of `backend/uploads`.

## 2. Automated Daily Backup Script (`backup.sh`)
```bash
#!/bin/bash
set -euo pipefail
BACKUP_DIR="/var/backups/alfalah"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
mkdir -p "$BACKUP_DIR"

# 1. Database dump
mysqldump -u alfalah_user -p"$DB_PASSWORD" alfalah_db | gzip > "$BACKUP_DIR/db_$TIMESTAMP.sql.gz"

# 2. Media files backup
tar -czf "$BACKUP_DIR/media_$TIMESTAMP.tar.gz" -C /var/www/alfalah/backend uploads

# 3. Retention: purge older than 30 days
find "$BACKUP_DIR" -type f -mtime +30 -delete
```

## 3. Restoration Procedure
To restore from backup:
```bash
# Unpack database
gunzip < /var/backups/alfalah/db_TIMESTAMP.sql.gz | mysql -u alfalah_user -p alfalah_db

# Restore uploads
tar -xzf /var/backups/alfalah/media_TIMESTAMP.tar.gz -C /var/www/alfalah/backend
```
