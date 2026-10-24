import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1700000000000 implements MigrationInterface {
  name = 'InitialSchema1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. admin_users
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`admin_users\` (
        \`id\` VARCHAR(36) NOT NULL,
        \`email\` VARCHAR(255) NOT NULL,
        \`password_hash\` VARCHAR(255) NOT NULL,
        \`full_name\` VARCHAR(255) NOT NULL,
        \`role\` ENUM('SUPER_ADMIN', 'ADMIN', 'CONTENT_EDITOR') NOT NULL DEFAULT 'ADMIN',
        \`is_active\` TINYINT NOT NULL DEFAULT 1,
        \`last_login_at\` DATETIME NULL,
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        UNIQUE INDEX \`IDX_admin_users_email\` (\`email\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 2. site_settings
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`site_settings\` (
        \`key\` VARCHAR(100) NOT NULL,
        \`value\` TEXT NOT NULL,
        \`description\` VARCHAR(255) NULL,
        \`is_public\` TINYINT NOT NULL DEFAULT 1,
        \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`key\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 3. homepage_sections
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`homepage_sections\` (
        \`id\` VARCHAR(36) NOT NULL,
        \`section_key\` VARCHAR(100) NOT NULL,
        \`title\` VARCHAR(255) NULL,
        \`subtitle\` VARCHAR(255) NULL,
        \`content\` TEXT NULL,
        \`cta_text\` VARCHAR(100) NULL,
        \`cta_url\` VARCHAR(255) NULL,
        \`image_url\` VARCHAR(500) NULL,
        \`is_visible\` TINYINT NOT NULL DEFAULT 1,
        \`display_order\` INT NOT NULL DEFAULT 0,
        \`custom_payload\` JSON NULL,
        \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        UNIQUE INDEX \`IDX_homepage_sections_key\` (\`section_key\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 4. activities
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`activities\` (
        \`id\` VARCHAR(36) NOT NULL,
        \`title\` VARCHAR(255) NOT NULL,
        \`slug\` VARCHAR(255) NOT NULL,
        \`category\` VARCHAR(100) NOT NULL,
        \`short_description\` VARCHAR(500) NOT NULL,
        \`full_description\` TEXT NULL,
        \`schedule_info\` VARCHAR(255) NULL,
        \`location\` VARCHAR(255) NOT NULL DEFAULT 'Alfalah Community Support Centre',
        \`image_url\` VARCHAR(500) NULL,
        \`is_published\` TINYINT NOT NULL DEFAULT 1,
        \`display_order\` INT NOT NULL DEFAULT 0,
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        UNIQUE INDEX \`IDX_activities_slug\` (\`slug\`),
        INDEX \`IDX_activities_category\` (\`category\`),
        INDEX \`IDX_activities_is_published\` (\`is_published\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 5. events
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`events\` (
        \`id\` VARCHAR(36) NOT NULL,
        \`title\` VARCHAR(255) NOT NULL,
        \`slug\` VARCHAR(255) NOT NULL,
        \`category\` VARCHAR(100) NOT NULL,
        \`summary\` VARCHAR(500) NOT NULL,
        \`description\` TEXT NULL,
        \`start_time\` DATETIME NOT NULL,
        \`end_time\` DATETIME NOT NULL,
        \`timezone\` VARCHAR(50) NOT NULL DEFAULT 'Europe/London',
        \`venue\` VARCHAR(255) NOT NULL DEFAULT 'Alfalah Community Support Centre',
        \`registration_url\` VARCHAR(500) NULL,
        \`is_recurring\` TINYINT NOT NULL DEFAULT 0,
        \`recurrence_rule\` VARCHAR(255) NULL,
        \`is_featured\` TINYINT NOT NULL DEFAULT 0,
        \`is_published\` TINYINT NOT NULL DEFAULT 1,
        \`image_url\` VARCHAR(500) NULL,
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        UNIQUE INDEX \`IDX_events_slug\` (\`slug\`),
        INDEX \`IDX_events_start_time\` (\`start_time\`),
        INDEX \`IDX_events_is_published\` (\`is_published\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 6. announcements
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`announcements\` (
        \`id\` VARCHAR(36) NOT NULL,
        \`title\` VARCHAR(255) NOT NULL,
        \`content\` TEXT NOT NULL,
        \`badge_text\` VARCHAR(50) NULL,
        \`is_pinned\` TINYINT NOT NULL DEFAULT 0,
        \`is_published\` TINYINT NOT NULL DEFAULT 1,
        \`published_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`expires_at\` DATETIME NULL,
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        INDEX \`IDX_announcements_is_published\` (\`is_published\`),
        INDEX \`IDX_announcements_is_pinned\` (\`is_pinned\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 7. prayer_settings
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`prayer_settings\` (
        \`id\` VARCHAR(36) NOT NULL,
        \`latitude\` DECIMAL(9,6) NOT NULL DEFAULT 52.457800,
        \`longitude\` DECIMAL(9,6) NOT NULL DEFAULT -1.890400,
        \`timezone\` VARCHAR(50) NOT NULL DEFAULT 'Europe/London',
        \`calculation_method\` VARCHAR(50) NOT NULL DEFAULT 'BirminghamUnified',
        \`fajr_angle\` DECIMAL(4,2) NOT NULL DEFAULT 18.00,
        \`isha_angle\` DECIMAL(4,2) NOT NULL DEFAULT 18.00,
        \`asr_juristic\` VARCHAR(20) NOT NULL DEFAULT 'HANAFI',
        \`fajr_iqamah_offset_mins\` INT NOT NULL DEFAULT 20,
        \`dhuhr_iqamah_offset_mins\` INT NOT NULL DEFAULT 15,
        \`asr_iqamah_offset_mins\` INT NOT NULL DEFAULT 15,
        \`maghrib_iqamah_offset_mins\` INT NOT NULL DEFAULT 10,
        \`isha_iqamah_offset_mins\` INT NOT NULL DEFAULT 15,
        \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 8. prayer_time_overrides
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`prayer_time_overrides\` (
        \`id\` VARCHAR(36) NOT NULL,
        \`date\` DATE NOT NULL,
        \`fajr_adhan\` VARCHAR(10) NULL,
        \`fajr_iqamah\` VARCHAR(10) NULL,
        \`sunrise\` VARCHAR(10) NULL,
        \`dhuhr_adhan\` VARCHAR(10) NULL,
        \`dhuhr_iqamah\` VARCHAR(10) NULL,
        \`asr_adhan\` VARCHAR(10) NULL,
        \`asr_iqamah\` VARCHAR(10) NULL,
        \`maghrib_adhan\` VARCHAR(10) NULL,
        \`maghrib_iqamah\` VARCHAR(10) NULL,
        \`isha_adhan\` VARCHAR(10) NULL,
        \`isha_iqamah\` VARCHAR(10) NULL,
        \`notes\` VARCHAR(255) NULL,
        \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        UNIQUE INDEX \`IDX_prayer_overrides_date\` (\`date\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 9. media_assets
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`media_assets\` (
        \`id\` VARCHAR(36) NOT NULL,
        \`filename\` VARCHAR(255) NOT NULL,
        \`original_name\` VARCHAR(255) NOT NULL,
        \`mime_type\` VARCHAR(100) NOT NULL,
        \`size_bytes\` BIGINT NOT NULL,
        \`storage_path\` VARCHAR(500) NOT NULL,
        \`alt_text\` VARCHAR(255) NULL,
        \`caption\` VARCHAR(500) NULL,
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 10. contact_messages
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`contact_messages\` (
        \`id\` VARCHAR(36) NOT NULL,
        \`name\` VARCHAR(150) NOT NULL,
        \`email\` VARCHAR(255) NOT NULL,
        \`subject\` VARCHAR(255) NOT NULL,
        \`message\` TEXT NOT NULL,
        \`ip_address\` VARCHAR(45) NULL,
        \`is_read\` TINYINT NOT NULL DEFAULT 0,
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        INDEX \`IDX_contact_messages_is_read\` (\`is_read\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 11. audit_logs
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`audit_logs\` (
        \`id\` VARCHAR(36) NOT NULL,
        \`admin_id\` VARCHAR(36) NULL,
        \`admin_email\` VARCHAR(255) NULL,
        \`action\` VARCHAR(100) NOT NULL,
        \`entity_type\` VARCHAR(100) NOT NULL,
        \`entity_id\` VARCHAR(100) NULL,
        \`details\` JSON NULL,
        \`ip_address\` VARCHAR(45) NULL,
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        INDEX \`IDX_audit_logs_created_at\` (\`created_at\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS \`audit_logs\`;`);
    await queryRunner.query(`DROP TABLE IF EXISTS \`contact_messages\`;`);
    await queryRunner.query(`DROP TABLE IF EXISTS \`media_assets\`;`);
    await queryRunner.query(`DROP TABLE IF EXISTS \`prayer_time_overrides\`;`);
    await queryRunner.query(`DROP TABLE IF EXISTS \`prayer_settings\`;`);
    await queryRunner.query(`DROP TABLE IF EXISTS \`announcements\`;`);
    await queryRunner.query(`DROP TABLE IF EXISTS \`events\`;`);
    await queryRunner.query(`DROP TABLE IF EXISTS \`activities\`;`);
    await queryRunner.query(`DROP TABLE IF EXISTS \`homepage_sections\`;`);
    await queryRunner.query(`DROP TABLE IF EXISTS \`site_settings\`;`);
    await queryRunner.query(`DROP TABLE IF EXISTS \`admin_users\`;`);
  }
}
