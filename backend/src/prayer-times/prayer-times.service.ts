import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Coordinates,
  CalculationMethod,
  CalculationParameters,
  PrayerTimes,
  Madhab,
  HighLatitudeRule,
  Qibla,
  Prayer,
} from 'adhan';
import { PrayerSetting } from './entities/prayer-setting.entity';
import { PrayerTimeOverride } from './entities/prayer-time-override.entity';
import { UpdatePrayerSettingsDto, CreatePrayerOverrideDto } from './dto/prayer-settings.dto';
import { AuditService } from '../audit/audit.service';

export interface DailyPrayerRecord {
  date: string; // YYYY-MM-DD
  fajr: { adhan: string; iqamah: string };
  sunrise: string;
  dhuhr: { adhan: string; iqamah: string };
  asr: { adhan: string; iqamah: string };
  maghrib: { adhan: string; iqamah: string };
  isha: { adhan: string; iqamah: string };
  isOverridden: boolean;
  notes?: string;
}

@Injectable()
export class PrayerTimesService {
  constructor(
    @InjectRepository(PrayerSetting)
    private settingsRepo: Repository<PrayerSetting>,
    @InjectRepository(PrayerTimeOverride)
    private overrideRepo: Repository<PrayerTimeOverride>,
    private auditService: AuditService,
  ) {}

  async getSettings(): Promise<PrayerSetting> {
    let settings = await this.settingsRepo.findOne({ where: {} });
    if (!settings) {
      settings = this.settingsRepo.create({
        latitude: 52.4578,
        longitude: -1.8904,
        timezone: 'Europe/London',
        calculationMethod: 'BirminghamUnified',
        fajrAngle: 18.0,
        ishaAngle: 18.0,
        asrJuristic: 'HANAFI',
        fajrIqamahOffsetMins: 20,
        dhuhrIqamahOffsetMins: 15,
        asrIqamahOffsetMins: 15,
        maghribIqamahOffsetMins: 10,
        ishaIqamahOffsetMins: 15,
      });
      await this.settingsRepo.save(settings);
    }
    return settings;
  }

  private formatTime(date: Date, timezone: string): string {
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: timezone,
    });
  }

  private addMinutes(timeStr: string, minutes: number): string {
    const [h, m] = timeStr.split(':').map(Number);
    const date = new Date(2000, 0, 1, h, m + minutes);
    return `${String(date.getHours()).padStart(2, '0')}:${String(
      date.getMinutes(),
    ).padStart(2, '0')}`;
  }

  async calculateForDate(
    date: Date,
    settings: PrayerSetting,
  ): Promise<DailyPrayerRecord> {
    const dateStr = date.toISOString().split('T')[0];

    // Check for admin override first
    const override = await this.overrideRepo.findOne({ where: { date: dateStr } });

    // Astronomical calculation with adhan
    const coordinates = new Coordinates(
      Number(settings.latitude),
      Number(settings.longitude),
    );

    let params: CalculationParameters;
    if (settings.calculationMethod === 'MoonsightingCommittee') {
      params = CalculationMethod.MoonsightingCommittee();
    } else if (settings.calculationMethod === 'MuslimWorldLeague') {
      params = CalculationMethod.MuslimWorldLeague();
    } else {
      // Birmingham / UK Unified default
      params = new CalculationParameters(
        'Other',
        Number(settings.fajrAngle || 18.0),
        Number(settings.ishaAngle || 18.0),
      );
      params.highLatitudeRule = HighLatitudeRule.SeventhOfTheNight;
    }

    params.madhab =
      settings.asrJuristic === 'HANAFI' ? Madhab.Hanafi : Madhab.Shafi;

    const prayerTimes = new PrayerTimes(coordinates, date, params);

    const tz = settings.timezone || 'Europe/London';
    const computedFajr = this.formatTime(prayerTimes.fajr, tz);
    const computedSunrise = this.formatTime(prayerTimes.sunrise, tz);
    const computedDhuhr = this.formatTime(prayerTimes.dhuhr, tz);
    const computedAsr = this.formatTime(prayerTimes.asr, tz);
    const computedMaghrib = this.formatTime(prayerTimes.maghrib, tz);
    const computedIsha = this.formatTime(prayerTimes.isha, tz);

    return {
      date: dateStr,
      fajr: {
        adhan: override?.fajrAdhan || computedFajr,
        iqamah:
          override?.fajrIqamah ||
          this.addMinutes(computedFajr, settings.fajrIqamahOffsetMins),
      },
      sunrise: override?.sunrise || computedSunrise,
      dhuhr: {
        adhan: override?.dhuhrAdhan || computedDhuhr,
        iqamah:
          override?.dhuhrIqamah ||
          this.addMinutes(computedDhuhr, settings.dhuhrIqamahOffsetMins),
      },
      asr: {
        adhan: override?.asrAdhan || computedAsr,
        iqamah:
          override?.asrIqamah ||
          this.addMinutes(computedAsr, settings.asrIqamahOffsetMins),
      },
      maghrib: {
        adhan: override?.maghribAdhan || computedMaghrib,
        iqamah:
          override?.maghribIqamah ||
          this.addMinutes(computedMaghrib, settings.maghribIqamahOffsetMins),
      },
      isha: {
        adhan: override?.ishaAdhan || computedIsha,
        iqamah:
          override?.ishaIqamah ||
          this.addMinutes(computedIsha, settings.ishaIqamahOffsetMins),
      },
      isOverridden: !!override,
      notes: override?.notes,
    };
  }

  async getTodayTimes() {
    const settings = await this.getSettings();
    const now = new Date();
    const todayRecord = await this.calculateForDate(now, settings);

    // Calculate next prayer & countdown
    const coordinates = new Coordinates(
      Number(settings.latitude),
      Number(settings.longitude),
    );
    const params = new CalculationParameters(
      'Other',
      Number(settings.fajrAngle || 18.0),
      Number(settings.ishaAngle || 18.0),
    );
    params.madhab =
      settings.asrJuristic === 'HANAFI' ? Madhab.Hanafi : Madhab.Shafi;
    const pt = new PrayerTimes(coordinates, now, params);

    const currentPrayerEnum = pt.currentPrayer();
    const nextPrayerEnum = pt.nextPrayer();
    const nextPrayerTime = pt.timeForPrayer(nextPrayerEnum);

    const prayerNameMap: Record<string, string> = {
      [Prayer.None]: 'None',
      [Prayer.Fajr]: 'Fajr',
      [Prayer.Sunrise]: 'Sunrise',
      [Prayer.Dhuhr]: 'Dhuhr',
      [Prayer.Asr]: 'Asr',
      [Prayer.Maghrib]: 'Maghrib',
      [Prayer.Isha]: 'Isha',
    };

    return {
      ...todayRecord,
      currentPrayer: prayerNameMap[currentPrayerEnum] || 'Isha',
      nextPrayer: prayerNameMap[nextPrayerEnum] || 'Fajr',
      nextPrayerTime: nextPrayerTime ? this.formatTime(nextPrayerTime, settings.timezone) : null,
      timezone: settings.timezone,
      location: '89 Tindal Street, Balsall Heath, Birmingham',
      calculationMethod: settings.calculationMethod,
    };
  }

  async getMonthlyTimes(year: number, month: number): Promise<DailyPrayerRecord[]> {
    const settings = await this.getSettings();
    const daysInMonth = new Date(year, month, 0).getDate();
    const results: DailyPrayerRecord[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
      const record = await this.calculateForDate(d, settings);
      results.push(record);
    }

    return results;
  }

  async getQiblaDirection() {
    const settings = await this.getSettings();
    const coordinates = new Coordinates(
      Number(settings.latitude),
      Number(settings.longitude),
    );
    const qiblaBearing = Qibla(coordinates);

    return {
      bearingDegrees: Math.round(qiblaBearing * 10) / 10, // ~117.9° - 119.5°
      city: 'Birmingham, UK',
      coordinates: {
        latitude: Number(settings.latitude),
        longitude: Number(settings.longitude),
      },
      kaabaCoordinates: {
        latitude: 21.4225,
        longitude: 39.8262,
      },
      instructions: 'Align your device towards the indicated angle (clockwise from True North).',
    };
  }

  async updateSettings(
    dto: UpdatePrayerSettingsDto,
    adminId?: string,
    adminEmail?: string,
  ): Promise<PrayerSetting> {
    let settings = await this.settingsRepo.findOne({ where: {} });
    if (!settings) {
      settings = this.settingsRepo.create(dto);
    } else {
      Object.assign(settings, dto);
    }
    const saved = await this.settingsRepo.save(settings);

    await this.auditService.log({
      adminId,
      adminEmail,
      action: 'UPDATE_PRAYER_SETTINGS',
      entityType: 'PRAYER_SETTINGS',
      details: dto,
    });

    return saved;
  }

  async getOverrides(): Promise<PrayerTimeOverride[]> {
    return this.overrideRepo.find({ order: { date: 'ASC' } });
  }

  async createOrUpdateOverride(
    dto: CreatePrayerOverrideDto,
    adminId?: string,
    adminEmail?: string,
  ): Promise<PrayerTimeOverride> {
    let override = await this.overrideRepo.findOne({ where: { date: dto.date } });
    if (!override) {
      override = this.overrideRepo.create(dto);
    } else {
      Object.assign(override, dto);
    }
    const saved = await this.overrideRepo.save(override);

    await this.auditService.log({
      adminId,
      adminEmail,
      action: 'SAVE_PRAYER_OVERRIDE',
      entityType: 'PRAYER_OVERRIDE',
      entityId: dto.date,
      details: dto,
    });

    return saved;
  }

  async deleteOverride(
    date: string,
    adminId?: string,
    adminEmail?: string,
  ): Promise<{ message: string }> {
    const override = await this.overrideRepo.findOne({ where: { date } });
    if (!override) {
      throw new NotFoundException(`No override found for date ${date}`);
    }

    await this.overrideRepo.remove(override);

    await this.auditService.log({
      adminId,
      adminEmail,
      action: 'DELETE_PRAYER_OVERRIDE',
      entityType: 'PRAYER_OVERRIDE',
      entityId: date,
    });

    return { message: `Override for ${date} removed successfully` };
  }
}
