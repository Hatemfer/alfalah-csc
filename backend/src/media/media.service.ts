import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { MediaAsset } from './entities/media-asset.entity';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class MediaService {
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

  async getAllMedia(): Promise<MediaAsset[]> {
    return this.mediaRepo.find({ order: { createdAt: 'DESC' } });
  }

  async saveMediaRecord(
    file: Express.Multer.File,
    altText?: string,
    caption?: string,
    adminId?: string,
    adminEmail?: string,
  ): Promise<MediaAsset> {
    const asset = this.mediaRepo.create({
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      sizeBytes: file.size,
      storagePath: `/uploads/${file.filename}`,
      altText: altText || file.originalname,
      caption,
    });
    const saved = await this.mediaRepo.save(asset);

    await this.auditService.log({
      adminId,
      adminEmail,
      action: 'UPLOAD_MEDIA',
      entityType: 'MEDIA',
      entityId: saved.id,
      details: { filename: saved.filename, mimeType: saved.mimeType },
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

    const filePath = path.join(this.uploadDir, asset.filename);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.warn(`Could not delete file ${filePath}:`, err);
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
}
