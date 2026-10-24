# ALFALAH COMMUNITY SUPPORT CENTRE — DATABASE DESIGN & SCHEMA

## 1. Overview
The database layer uses TypeORM with MySQL/MariaDB (v8.0+ / v10.6+). Character encoding is strictly `utf8mb4` with `utf8mb4_unicode_ci` collation to natively support English and Arabic text.

---

## 2. Relational Domain Entities

### 2.1 Administrative & Security Entities
- **`admin_users`**:
  - `id`: UUID (Primary Key)
  - `email`: VARCHAR(255) UNIQUE NOT NULL
  - `password_hash`: VARCHAR(255) NOT NULL (Argon2id)
  - `full_name`: VARCHAR(255) NOT NULL
  - `role`: ENUM ('SUPER_ADMIN', 'ADMIN', 'CONTENT_EDITOR') DEFAULT 'ADMIN'
  - `is_active`: BOOLEAN DEFAULT TRUE
  - `last_login_at`: TIMESTAMP NULL
  - `created_at`, `updated_at`: TIMESTAMP

- **`audit_logs`**:
  - `id`: UUID (Primary Key)
  - `admin_id`: UUID (Foreign Key to admin_users, ON DELETE SET NULL)
  - `action`: VARCHAR(100) NOT NULL (e.g., 'CREATE_EVENT', 'UPDATE_SETTINGS', 'PUBLISH_ANNOUNCEMENT')
  - `entity_type`: VARCHAR(100) NOT NULL
  - `entity_id`: VARCHAR(100) NULL
  - `changes`: JSON NULL (records before/after diffs without sensitive values)
  - `ip_address`: VARCHAR(45) NULL
  - `created_at`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP

### 2.2 Content & CMS Entities
- **`site_settings`**:
  - Key-value configuration for organisation attributes (Name, Arabic Name, Charity Number, Address, Contact Email, Social Links, Maintenance Mode, Bank Details Display Flag).
  - All keys are strictly validated. Bank details default to hidden and unexposed.

- **`homepage_sections`**:
  - `id`: UUID (Primary Key)
  - `section_key`: VARCHAR(100) UNIQUE (e.g. 'hero', 'about_intro', 'prayer_highlight', 'activities_preview')
  - `title`: VARCHAR(255) NULL
  - `subtitle`: VARCHAR(255) NULL
  - `content`: TEXT NULL
  - `cta_text`: VARCHAR(100) NULL
  - `cta_url`: VARCHAR(255) NULL
  - `image_url`: VARCHAR(500) NULL
  - `is_visible`: BOOLEAN DEFAULT TRUE
  - `display_order`: INT DEFAULT 0
  - `custom_payload`: JSON NULL

- **`pages`**:
  - `id`: UUID (Primary Key)
  - `slug`: VARCHAR(120) UNIQUE NOT NULL
  - `title`: VARCHAR(255) NOT NULL
  - `meta_description`: VARCHAR(320) NULL
  - `content`: LONGTEXT NULL (Sanitized HTML / Markdown)
  - `is_published`: BOOLEAN DEFAULT FALSE
  - `published_at`: TIMESTAMP NULL
  - `updated_at`: TIMESTAMP

- **`activities`**:
  - `id`: UUID (Primary Key)
  - `title`: VARCHAR(255) NOT NULL
  - `slug`: VARCHAR(255) UNIQUE NOT NULL
  - `category`: VARCHAR(100) NOT NULL (e.g. 'Youth', 'Elderly', 'Education', 'Charity', 'Sisters')
  - `short_description`: VARCHAR(500) NOT NULL
  - `full_description`: TEXT NULL
  - `schedule_info`: VARCHAR(255) NULL (e.g. 'Every Saturday 10:00 - 12:00')
  - `location`: VARCHAR(255) DEFAULT 'Alfalah Centre, Main Hall'
  - `image_url`: VARCHAR(500) NULL
  - `is_published`: BOOLEAN DEFAULT TRUE
  - `display_order`: INT DEFAULT 0
  - `created_at`, `updated_at`: TIMESTAMP

- **`events`**:
  - `id`: UUID (Primary Key)
  - `title`: VARCHAR(255) NOT NULL
  - `slug`: VARCHAR(255) UNIQUE NOT NULL
  - `category`: VARCHAR(100) NOT NULL
  - `summary`: VARCHAR(500) NOT NULL
  - `description`: TEXT NULL
  - `start_time`: TIMESTAMP NOT NULL
  - `end_time`: TIMESTAMP NOT NULL
  - `timezone`: VARCHAR(50) DEFAULT 'Europe/London'
  - `venue`: VARCHAR(255) DEFAULT 'Alfalah Community Support Centre'
  - `registration_url`: VARCHAR(500) NULL
  - `is_recurring`: BOOLEAN DEFAULT FALSE
  - `recurrence_rule`: VARCHAR(255) NULL
  - `is_featured`: BOOLEAN DEFAULT FALSE
  - `is_published`: BOOLEAN DEFAULT TRUE
  - `image_url`: VARCHAR(500) NULL

- **`announcements`**:
  - `id`: UUID (Primary Key)
  - `title`: VARCHAR(255) NOT NULL
  - `content`: TEXT NOT NULL
  - `badge_text`: VARCHAR(50) NULL (e.g., 'Important', 'Notice', 'Eid')
  - `is_pinned`: BOOLEAN DEFAULT FALSE
  - `is_published`: BOOLEAN DEFAULT TRUE
  - `published_at`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  - `expires_at`: TIMESTAMP NULL

### 2.3 Prayer & Astronomical Entities
- **`prayer_settings`**:
  - `id`: UUID (Primary Key)
  - `latitude`: DECIMAL(9, 6) DEFAULT 52.457800
  - `longitude`: DECIMAL(9, 6) DEFAULT -1.890400
  - `timezone`: VARCHAR(50) DEFAULT 'Europe/London'
  - `calculation_method`: VARCHAR(50) DEFAULT 'BirminghamUnified'
  - `fajr_angle`: DECIMAL(4, 2) DEFAULT 18.00
  - `isha_angle`: DECIMAL(4, 2) DEFAULT 18.00
  - `asr_juristic`: ENUM ('STANDARD', 'HANAFI') DEFAULT 'HANAFI'
  - `fajr_iqamah_offset_mins`: INT DEFAULT 20
  - `dhuhr_iqamah_offset_mins`: INT DEFAULT 15
  - `asr_iqamah_offset_mins`: INT DEFAULT 15
  - `maghrib_iqamah_offset_mins`: INT DEFAULT 10
  - `isha_iqamah_offset_mins`: INT DEFAULT 15

- **`prayer_time_overrides`**:
  - `id`: UUID (Primary Key)
  - `date`: DATE UNIQUE NOT NULL (YYYY-MM-DD)
  - `fajr_adhan`: TIME NULL
  - `fajr_iqamah`: TIME NULL
  - `sunrise`: TIME NULL
  - `dhuhr_adhan`: TIME NULL
  - `dhuhr_iqamah`: TIME NULL
  - `asr_adhan`: TIME NULL
  - `asr_iqamah`: TIME NULL
  - `maghrib_adhan`: TIME NULL
  - `maghrib_iqamah`: TIME NULL
  - `isha_adhan`: TIME NULL
  - `isha_iqamah`: TIME NULL
  - `notes`: VARCHAR(255) NULL

### 2.4 Media & Community Inquiries
- **`media_assets`**:
  - `id`: UUID (Primary Key)
  - `filename`: VARCHAR(255) NOT NULL
  - `original_name`: VARCHAR(255) NOT NULL
  - `mime_type`: VARCHAR(100) NOT NULL
  - `size_bytes`: BIGINT NOT NULL
  - `storage_path`: VARCHAR(500) NOT NULL
  - `alt_text`: VARCHAR(255) NULL
  - `caption`: VARCHAR(500) NULL
  - `created_at`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP

- **`contact_messages`**:
  - `id`: UUID (Primary Key)
  - `name`: VARCHAR(150) NOT NULL
  - `email`: VARCHAR(255) NOT NULL
  - `subject`: VARCHAR(255) NOT NULL
  - `message`: TEXT NOT NULL
  - `ip_address`: VARCHAR(45) NULL
  - `is_read`: BOOLEAN DEFAULT FALSE
  - `created_at`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
