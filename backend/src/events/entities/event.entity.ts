import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ unique: true, length: 255 })
  slug: string;

  @Column({ length: 100 })
  category: string;

  @Column({ length: 500 })
  summary: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'start_time', type: 'datetime' })
  startTime: Date;

  @Column({ name: 'end_time', type: 'datetime' })
  endTime: Date;

  @Column({ length: 50, default: 'Europe/London' })
  timezone: string;

  @Column({ length: 255, default: 'Alfalah Community Support Centre' })
  venue: string;

  @Column({ name: 'registration_url', length: 500, nullable: true })
  registrationUrl: string;

  @Column({ name: 'is_recurring', default: false })
  isRecurring: boolean;

  @Column({ name: 'recurrence_rule', length: 255, nullable: true })
  recurrenceRule: string;

  @Column({ name: 'is_featured', default: false })
  isFeatured: boolean;

  @Column({ name: 'is_published', default: true })
  isPublished: boolean;

  @Column({ name: 'image_url', length: 500, nullable: true })
  imageUrl: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
