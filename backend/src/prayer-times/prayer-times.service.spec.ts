import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PrayerTimesService } from './prayer-times.service';
import { PrayerSetting } from './entities/prayer-setting.entity';
import { PrayerTimeOverride } from './entities/prayer-time-override.entity';
import { AuditService } from '../audit/audit.service';

describe('PrayerTimesService', () => {
  let service: PrayerTimesService;

  const mockSettings = {
    id: 'settings-1',
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
  };

  const mockSettingsRepo = {
    findOne: jest.fn().mockResolvedValue(mockSettings),
    save: jest.fn().mockResolvedValue(mockSettings),
    create: jest.fn().mockReturnValue(mockSettings),
  };

  const mockOverrideRepo = {
    findOne: jest.fn().mockResolvedValue(null),
    find: jest.fn().mockResolvedValue([]),
    save: jest.fn(),
    remove: jest.fn(),
  };

  const mockAuditService = {
    log: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrayerTimesService,
        {
          provide: getRepositoryToken(PrayerSetting),
          useValue: mockSettingsRepo,
        },
        {
          provide: getRepositoryToken(PrayerTimeOverride),
          useValue: mockOverrideRepo,
        },
        {
          provide: AuditService,
          useValue: mockAuditService,
        },
      ],
    }).compile();

    service = module.get<PrayerTimesService>(PrayerTimesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should calculate valid prayer times for today', async () => {
    const todayTimes = await service.getTodayTimes();
    expect(todayTimes).toBeDefined();
    expect(todayTimes.fajr.adhan).toMatch(/^\d{2}:\d{2}$/);
    expect(todayTimes.dhuhr.adhan).toMatch(/^\d{2}:\d{2}$/);
    expect(todayTimes.asr.adhan).toMatch(/^\d{2}:\d{2}$/);
    expect(todayTimes.maghrib.adhan).toMatch(/^\d{2}:\d{2}$/);
    expect(todayTimes.isha.adhan).toMatch(/^\d{2}:\d{2}$/);
  });

  it('should compute Qibla bearing within expected UK astronomical range', async () => {
    const qibla = await service.getQiblaDirection();
    expect(qibla.bearingDegrees).toBeGreaterThan(110);
    expect(qibla.bearingDegrees).toBeLessThan(125);
  });
});
