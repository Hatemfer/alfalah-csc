import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

import { AdminUser } from './auth/entities/admin-user.entity';
import { SiteSetting } from './site-settings/entities/site-setting.entity';
import { HomepageSection } from './homepage/entities/homepage-section.entity';
import { Activity } from './activities/entities/activity.entity';
import { Event } from './events/entities/event.entity';
import { Announcement } from './announcements/entities/announcement.entity';
import { PrayerSetting } from './prayer-times/entities/prayer-setting.entity';
import { PrayerTimeOverride } from './prayer-times/entities/prayer-time-override.entity';
import { MediaAsset } from './media/entities/media-asset.entity';
import { ContactMessage } from './contact/entities/contact-message.entity';
import { AuditLog } from './audit/entities/audit-log.entity';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME || 'alfalah_user',
  password: process.env.DB_PASSWORD || 'alfalah_dev_2026',
  database: process.env.DB_NAME || 'alfalah_db',
  synchronize: false,
  logging: process.env.DB_LOGGING === 'true',
  entities: [
    AdminUser,
    SiteSetting,
    HomepageSection,
    Activity,
    Event,
    Announcement,
    PrayerSetting,
    PrayerTimeOverride,
    MediaAsset,
    ContactMessage,
    AuditLog,
  ],
  migrations: [path.join(__dirname, 'migrations/*{.ts,.js}')],
  subscribers: [],
});
