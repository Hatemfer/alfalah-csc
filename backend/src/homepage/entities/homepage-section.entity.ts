import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
} from 'typeorm';

@Entity('homepage_sections')
export class HomepageSection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'section_key', unique: true, length: 100 })
  sectionKey: string;

  @Column({ length: 255, nullable: true })
  title: string;

  @Column({ length: 255, nullable: true })
  subtitle: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ name: 'cta_text', length: 100, nullable: true })
  ctaText: string;

  @Column({ name: 'cta_url', length: 255, nullable: true })
  ctaUrl: string;

  @Column({ name: 'image_url', length: 500, nullable: true })
  imageUrl: string;

  @Column({ name: 'is_visible', default: true })
  isVisible: boolean;

  @Column({ name: 'display_order', default: 0 })
  displayOrder: number;

  @Column({ name: 'custom_payload', type: 'json', nullable: true })
  customPayload: Record<string, any> | null;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
