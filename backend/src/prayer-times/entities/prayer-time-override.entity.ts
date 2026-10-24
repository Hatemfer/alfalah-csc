import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity('prayer_time_overrides')
export class PrayerTimeOverride {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date', unique: true })
  date: string; // YYYY-MM-DD

  @Column({ name: 'fajr_adhan', length: 10, nullable: true })
  fajrAdhan: string;

  @Column({ name: 'fajr_iqamah', length: 10, nullable: true })
  fajrIqamah: string;

  @Column({ length: 10, nullable: true })
  sunrise: string;

  @Column({ name: 'dhuhr_adhan', length: 10, nullable: true })
  dhuhrAdhan: string;

  @Column({ name: 'dhuhr_iqamah', length: 10, nullable: true })
  dhuhrIqamah: string;

  @Column({ name: 'asr_adhan', length: 10, nullable: true })
  asrAdhan: string;

  @Column({ name: 'asr_iqamah', length: 10, nullable: true })
  asrIqamah: string;

  @Column({ name: 'maghrib_adhan', length: 10, nullable: true })
  maghribAdhan: string;

  @Column({ name: 'maghrib_iqamah', length: 10, nullable: true })
  maghribIqamah: string;

  @Column({ name: 'isha_adhan', length: 10, nullable: true })
  ishaAdhan: string;

  @Column({ name: 'isha_iqamah', length: 10, nullable: true })
  ishaIqamah: string;

  @Column({ length: 255, nullable: true })
  notes: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
