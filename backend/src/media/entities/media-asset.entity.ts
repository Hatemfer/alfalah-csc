import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('media_assets')
export class MediaAsset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  filename: string;

  @Column({ name: 'original_name', length: 255 })
  originalName: string;

  @Column({ name: 'mime_type', length: 100 })
  mimeType: string;

  @Column({ name: 'size_bytes', type: 'bigint' })
  sizeBytes: number;

  @Column({ name: 'storage_path', length: 500 })
  storagePath: string;

  @Column({ length: 255, nullable: true })
  title: string;

  @Column({ length: 50, default: 'community' })
  category: string;

  @Column({ name: 'is_gallery', default: false })
  isGallery: boolean;

  @Column({ name: 'display_order', default: 0 })
  displayOrder: number;

  @Column({ name: 'alt_text', length: 255, nullable: true })
  altText: string;

  @Column({ length: 500, nullable: true })
  caption: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

