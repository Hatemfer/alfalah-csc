import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('activities')
export class Activity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ unique: true, length: 255 })
  slug: string;

  @Column({ length: 100 })
  category: string;

  @Column({ name: 'short_description', length: 500 })
  shortDescription: string;

  @Column({ name: 'full_description', type: 'text', nullable: true })
  fullDescription: string;

  @Column({ name: 'schedule_info', length: 255, nullable: true })
  scheduleInfo: string;

  @Column({ length: 255, default: 'Alfalah Community Support Centre' })
  location: string;

  @Column({ name: 'image_url', length: 500, nullable: true })
  imageUrl: string;

  @Column({ name: 'is_published', default: true })
  isPublished: boolean;

  @Column({ name: 'display_order', default: 0 })
  displayOrder: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
