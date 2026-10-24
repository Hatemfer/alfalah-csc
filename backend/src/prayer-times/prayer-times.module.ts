import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrayerSetting } from './entities/prayer-setting.entity';
import { PrayerTimeOverride } from './entities/prayer-time-override.entity';
import { PrayerTimesService } from './prayer-times.service';
import { PrayerTimesController } from './prayer-times.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PrayerSetting, PrayerTimeOverride])],
  providers: [PrayerTimesService],
  controllers: [PrayerTimesController],
  exports: [PrayerTimesService],
})
export class PrayerTimesModule {}
