import { Injectable, NotFoundException, BadRequestException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { MediaAsset } from './entities/media-asset.entity';
import { AuditService } from '../audit/audit.service';

const INITIAL_GALLERY_SEEDS = [
  {
    title: 'Youth Electronics & Circuit Workshop',
    category: 'stem',
    storagePath: '/images/real/youth-electronics-workbench.jpg',
    caption: 'Hands-on practical electronics at the Sakeena Hub: students building LED circuits, sensors, and microcontrollers.',
    displayOrder: 1,
  },
  {
    title: 'Youth STEM & Robotics Teamwork',
    category: 'stem',
    storagePath: '/images/real/youth-stem-workshop.jpg',
    caption: 'Empowering boys and girls with modern coding logic, engineering kits, and interactive mechanical design.',
    displayOrder: 2,
  },
  {
    title: 'Practical Electronic Wiring & LEDs',
    category: 'stem',
    storagePath: '/images/real/youth-circuit-led.jpg',
    caption: 'Young students mastering solderless breadboards, resistors, and circuit building in our Saturday morning club.',
    displayOrder: 3,
  },
  {
    title: 'Friday Congregational Jumu’ah Service',
    category: 'worship',
    storagePath: '/images/real/friday-khutbah-congregation.jpg',
    caption: 'Worshippers listening to the Friday Khutbah delivered in English and Arabic by resident Imams at 13:00.',
    displayOrder: 4,
  },
  {
    title: 'Daily Congregational Prayer in Main Hall',
    category: 'worship',
    storagePath: '/images/real/prayer-congregation.jpg',
    caption: 'Five daily prayers in congregation uniting brothers of all ages and backgrounds across Balsall Heath.',
    displayOrder: 5,
  },
  {
    title: 'Prayer Hall & Extensive Islamic Library',
    category: 'worship',
    storagePath: '/images/real/prayer-hall-library.jpg',
    caption: 'Peaceful prayer environment with classical Arabic texts, English Quran translations, and Hadith collections.',
    displayOrder: 6,
  },
  {
    title: 'Sakeena Community Learning Hub',
    category: 'sakeena',
    storagePath: '/images/real/sakeena-learning-hub.jpg',
    caption: 'The dedicated learning space for Quran recitation, Tajweed, STEM robotics, and after-school tuition.',
    displayOrder: 7,
  },
  {
    title: 'Sakeena Learning Hub Entrance Sign',
    category: 'sakeena',
    storagePath: '/images/real/sakeena-hub-entrance.jpg',
    caption: 'Welcoming entrance to our educational wing, equipped with multimedia whiteboards and modern desks.',
    displayOrder: 8,
  },
  {
    title: 'Secondary Hall & Dedicated Sisters Space',
    category: 'facilities',
    storagePath: '/images/real/secondary-hall-sisters.jpg',
    caption: 'Spacious secondary hall dedicated to sisters’ prayers, mother & toddler groups, and weekend Tajweed classes.',
    displayOrder: 9,
  },
  {
    title: 'Centre Building Exterior (89 Tindal St)',
    category: 'facilities',
    storagePath: '/images/real/mosque-exterior-main.jpg',
    caption: 'The historic building in Balsall Heath that the community is currently fundraising £600k to permanently purchase.',
    displayOrder: 10,
  },
  {
    title: 'Private Courtyard & Safe Parking',
    category: 'facilities',
    storagePath: '/images/real/parking-courtyard.jpg',
    caption: 'Secure on-site courtyard for elderly worshipper drop-offs, school visits, and weekend community gatherings.',
    displayOrder: 11,
  },
  {
    title: 'Community Marquee & Garden Space',
    category: 'community',
    storagePath: '/images/real/marquee-garden.jpg',
    caption: 'Covered outdoor marquee used for Eid hospitality teas, community lunches, and youth mentoring circles.',
    displayOrder: 12,
  },
  {
    title: 'Eid Gathering & Hospitality Sweets',
    category: 'community',
    storagePath: '/images/real/eid-gathering-sweets.jpg',
    caption: 'Sharing Eid joy, dates, and sweets following the congregational Eid Salah with families and children.',
    displayOrder: 13,
  },
  {
    title: 'Community Tea & Brotherly Hospitality',
    category: 'community',
    storagePath: '/images/real/eid-hospitality-tea.jpg',
    caption: 'Warm Somali and Arabic spiced tea served after Saturday Tafsir lectures and community meetings.',
    displayOrder: 14,
  },
  {
    title: 'Accredited First Aid & CPR Training Session',
    category: 'sakeena',
    storagePath: '/images/real/first-aid-training.jpg',
    caption: 'Hands-on life-saving CPR and automated AED defibrillator training workshop provided free of charge for community members with official certification.',
    displayOrder: 15,
  },
  {
    title: 'Certified Community Safeguarding Workshop',
    category: 'community',
    storagePath: '/images/real/first-aid-training-wide.jpg',
    caption: 'Comprehensive safeguarding certification session held in the main hall ensuring child safety and UK regulatory compliance for local volunteers and teachers.',
    displayOrder: 16,
  },
  {
    title: 'Volunteer Painting & Refurbishment Day',
    category: 'community',
    storagePath: '/images/real/volunteer-refurbishment.jpg',
    caption: 'Selfless community volunteers giving their weekends to paint, refurbish, and maintain the House of Allah.',
    displayOrder: 17,
  },
  {
    title: 'Tafsir with Sheikh Jamal Al-Jabarti Poster',
    category: 'worship',
    storagePath: '/images/real/poster-tafsir-sheikh-jamal.jpg',
    caption: 'Official announcement poster for our weekly Saturday post-Maghrib Quranic Tafsir lecture series.',
    displayOrder: 18,
  },
];

@Injectable()
export class MediaService implements OnModuleInit {
  private uploadDir: string;

  constructor(
    @InjectRepository(MediaAsset)
    private mediaRepo: Repository<MediaAsset>,
    private auditService: AuditService,
  ) {
    this.uploadDir = path.resolve(process.env.MEDIA_UPLOAD_DIR || './uploads');
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async onModuleInit() {
    await this.ensureSchemaUpgrades();
    await this.seedDefaultGalleryIfEmpty();
  }

  private async ensureSchemaUpgrades() {
    try {
      await this.mediaRepo.query(`
        ALTER TABLE media_assets 
          ADD COLUMN IF NOT EXISTS title VARCHAR(255) NULL,
          ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT 'community',
          ADD COLUMN IF NOT EXISTS is_gallery TINYINT(1) DEFAULT 0,
          ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 0
      `);
    } catch (e) {
      // Fallback for database engines that do not support IF NOT EXISTS in ALTER TABLE
      const cols = [
        { name: 'title', def: 'VARCHAR(255) NULL' },
        { name: 'category', def: "VARCHAR(50) DEFAULT 'community'" },
        { name: 'is_gallery', def: 'TINYINT(1) DEFAULT 0' },
        { name: 'display_order', def: 'INT DEFAULT 0' },
      ];
      for (const col of cols) {
        try {
          await this.mediaRepo.query(`ALTER TABLE media_assets ADD COLUMN ${col.name} ${col.def}`);
        } catch (_) {}
      }
    }
  }

  private async seedDefaultGalleryIfEmpty() {
    try {
      const count = await this.mediaRepo.count({ where: { isGallery: true } });
      if (count === 0) {
        for (const item of INITIAL_GALLERY_SEEDS) {
          const filename = path.basename(item.storagePath);
          const asset = this.mediaRepo.create({
            filename,
            originalName: `${item.title}.jpg`,
            mimeType: 'image/jpeg',
            sizeBytes: 250000,
            storagePath: item.storagePath,
            title: item.title,
            category: item.category,
            altText: item.title,
            caption: item.caption,
            isGallery: true,
            displayOrder: item.displayOrder,
          });
          await this.mediaRepo.save(asset);
        }
      }
    } catch (err) {
      console.warn('Could not seed initial gallery items:', err);
    }
  }

  async getAllMedia(filter?: { isGallery?: boolean; category?: string }): Promise<MediaAsset[]> {
    const query = this.mediaRepo.createQueryBuilder('m');
    if (filter?.isGallery !== undefined) {
      query.andWhere('m.is_gallery = :isGallery', { isGallery: filter.isGallery });
    }
    if (filter?.category && filter.category !== 'all') {
      query.andWhere('m.category = :category', { category: filter.category });
    }
    return query.orderBy('m.display_order', 'ASC').addOrderBy('m.created_at', 'DESC').getMany();
  }

  async getGalleryMedia(): Promise<MediaAsset[]> {
    return this.mediaRepo.find({
      where: { isGallery: true },
      order: { displayOrder: 'ASC', createdAt: 'DESC' },
    });
  }

  async saveMediaRecord(
    file: Express.Multer.File,
    meta: {
      title?: string;
      category?: string;
      altText?: string;
      caption?: string;
      isGallery?: boolean;
    },
    adminId?: string,
    adminEmail?: string,
  ): Promise<MediaAsset> {
    const isImage = file.mimetype.startsWith('image/');
    const isGallery = meta.isGallery === true || meta.isGallery === ('true' as any);

    const asset = this.mediaRepo.create({
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      sizeBytes: file.size,
      storagePath: `/uploads/${file.filename}`,
      title: meta.title || file.originalname.replace(/\.[^/.]+$/, ''),
      category: meta.category || (isImage ? 'community' : 'document'),
      altText: meta.altText || meta.title || file.originalname,
      caption: meta.caption || '',
      isGallery: isImage ? isGallery : false,
      displayOrder: 0,
    });
    const saved = await this.mediaRepo.save(asset);

    await this.auditService.log({
      adminId,
      adminEmail,
      action: 'UPLOAD_MEDIA',
      entityType: 'MEDIA',
      entityId: saved.id,
      details: {
        filename: saved.filename,
        mimeType: saved.mimeType,
        isGallery: saved.isGallery,
        category: saved.category,
      },
    });

    return saved;
  }

  async updateMedia(
    id: string,
    dto: {
      title?: string;
      category?: string;
      caption?: string;
      altText?: string;
      isGallery?: boolean;
      displayOrder?: number;
    },
    adminId?: string,
    adminEmail?: string,
  ): Promise<MediaAsset> {
    const asset = await this.mediaRepo.findOne({ where: { id } });
    if (!asset) {
      throw new NotFoundException(`Media asset ${id} not found`);
    }

    if (dto.title !== undefined) asset.title = dto.title;
    if (dto.category !== undefined) asset.category = dto.category;
    if (dto.caption !== undefined) asset.caption = dto.caption;
    if (dto.altText !== undefined) asset.altText = dto.altText;
    if (dto.isGallery !== undefined) asset.isGallery = dto.isGallery;
    if (dto.displayOrder !== undefined) asset.displayOrder = dto.displayOrder;

    const saved = await this.mediaRepo.save(asset);

    await this.auditService.log({
      adminId,
      adminEmail,
      action: 'UPDATE_MEDIA',
      entityType: 'MEDIA',
      entityId: id,
      details: dto,
    });

    return saved;
  }

  async deleteMedia(
    id: string,
    adminId?: string,
    adminEmail?: string,
  ): Promise<{ message: string }> {
    const asset = await this.mediaRepo.findOne({ where: { id } });
    if (!asset) {
      throw new NotFoundException(`Media asset ${id} not found`);
    }

    // Only delete physical file if it's in the uploads folder, not static seed assets
    if (asset.storagePath.startsWith('/uploads/')) {
      const filePath = path.join(this.uploadDir, asset.filename);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (err) {
          console.warn(`Could not delete file ${filePath}:`, err);
        }
      }
    }

    await this.mediaRepo.remove(asset);

    await this.auditService.log({
      adminId,
      adminEmail,
      action: 'DELETE_MEDIA',
      entityType: 'MEDIA',
      entityId: id,
      details: { filename: asset.filename },
    });

    return { message: 'Media removed successfully' };
  }

  async deleteMediaByPath(storagePath: string): Promise<boolean> {
    if (!storagePath || !storagePath.startsWith('/uploads/')) {
      return false;
    }
    const filename = path.basename(storagePath);
    const filePath = path.join(this.uploadDir, filename);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.warn(`Could not delete file ${filePath}:`, err);
      }
    }

    const asset = await this.mediaRepo.findOne({ where: { filename } });
    if (asset) {
      await this.mediaRepo.remove(asset);
    }
    return true;
  }
}

