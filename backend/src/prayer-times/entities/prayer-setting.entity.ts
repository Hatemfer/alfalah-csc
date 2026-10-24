import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity('prayer_settings')
export class PrayerSetting {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 9, scale: 6, default: 52.4578 })
  latitude: number;

  @Column({ type: 'decimal', precision: 9, scale: 6, default: -1.8904 })
  longitude: number;

  @Column({ length: 50, default: 'Europe/London' })
  timezone: string;

  @Column({ name: 'calculation_method', length: 50, default: 'BirminghamUnified' })
  calculationMethod: string;

  @Column({ name: 'fajr_angle', type: 'decimal', precision: 4, scale: 2, default: 18.0 })
  fajrAngle: number;

  @Column({ name: 'isha_angle', type: 'decimal', precision: 4, scale: 2, default: 18.0 })
  ishaAngle: number;

  @Column({ name: 'asr_juristic', length: 20, default: 'HANAFI' })
  asrJuristic: string;

  @Column({ name: 'fajr_iqamah_offset_mins', default: 20 })
  fajrIqamahOffsetMins: number;

  @Column({ name: 'dhuhr_iqamah_offset_mins', default: 15 })
  dhuhrIqamahOffsetMins: number;

  @Column({ name: 'asr_iqamah_offset_mins', default: 15 })
  asrIqamahOffsetMins: number;

  @Column({ name: 'maghrib_iqamah_offset_mins', default: 10 })
  maghribIqamahOffsetMins: number;

  @Column({ name: 'isha_iqamah_offset_mins', default: 15 })
  ishaIqamahOffsetMins: number;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
