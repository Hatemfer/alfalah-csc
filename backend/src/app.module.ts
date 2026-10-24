import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
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

import { AuditModule } from './audit/audit.module';
import { AuthModule } from './auth/auth.module';
import { AdminsModule } from './admins/admins.module';
import { SiteSettingsModule } from './site-settings/site-settings.module';
import { HomepageModule } from './homepage/homepage.module';
import { ActivitiesModule } from './activities/activities.module';
import { EventsModule } from './events/events.module';
import { AnnouncementsModule } from './announcements/announcements.module';
import { PrayerTimesModule } from './prayer-times/prayer-times.module';
import { ContactModule } from './contact/contact.module';
import { MediaModule } from './media/media.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve(__dirname, '../.env'),
    }),
    TypeOrmModule.forRoot({
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
    }),
    AuditModule,
    AuthModule,
    AdminsModule,
    SiteSettingsModule,
    HomepageModule,
    ActivitiesModule,
    EventsModule,
    AnnouncementsModule,
    PrayerTimesModule,
    ContactModule,
    MediaModule,
  ],
})
export class AppModule {}
