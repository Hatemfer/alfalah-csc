import { Entity, PrimaryColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity('site_settings')
export class SiteSetting {
  @PrimaryColumn({ length: 100 })
  key: string;

  @Column({ type: 'text' })
  value: string;

  @Column({ length: 255, nullable: true })
  description: string;

  @Column({ name: 'is_public', default: true })
  isPublic: boolean;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
