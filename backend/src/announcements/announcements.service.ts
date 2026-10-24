import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Announcement } from './entities/announcement.entity';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectRepository(Announcement)
    private announcementRepo: Repository<Announcement>,
    private auditService: AuditService,
  ) {}

  async getPublicAnnouncements(): Promise<Announcement[]> {
    const now = new Date();
    return this.announcementRepo
      .createQueryBuilder('a')
      .where('a.isPublished = :isPublished', { isPublished: true })
      .andWhere('(a.expiresAt IS NULL OR a.expiresAt >= :now)', { now })
      .orderBy('a.isPinned', 'DESC')
      .addOrderBy('a.publishedAt', 'DESC')
      .getMany();
  }

  async getAllAnnouncementsAdmin(): Promise<Announcement[]> {
    return this.announcementRepo.find({
      order: { isPinned: 'DESC', createdAt: 'DESC' },
    });
  }

  async createAnnouncement(
    dto: CreateAnnouncementDto,
    adminId?: string,
    adminEmail?: string,
  ): Promise<Announcement> {
    const announcement = this.announcementRepo.create({
      ...dto,
      expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
    });
    const saved = await this.announcementRepo.save(announcement);

    await this.auditService.log({
      adminId,
      adminEmail,
      action: 'CREATE_ANNOUNCEMENT',
      entityType: 'ANNOUNCEMENT',
      entityId: saved.id,
      details: { title: saved.title },
    });

    return saved;
  }

  async updateAnnouncement(
    id: string,
    dto: Partial<CreateAnnouncementDto>,
    adminId?: string,
    adminEmail?: string,
  ): Promise<Announcement> {
    const announcement = await this.announcementRepo.findOne({ where: { id } });
    if (!announcement) {
      throw new NotFoundException(`Announcement with id ${id} not found`);
    }

    const payload: any = { ...dto };
    if (dto.expiresAt !== undefined) {
      payload.expiresAt = dto.expiresAt ? new Date(dto.expiresAt) : null;
    }

    Object.assign(announcement, payload);
    const updated = await this.announcementRepo.save(announcement);

    await this.auditService.log({
      adminId,
      adminEmail,
      action: 'UPDATE_ANNOUNCEMENT',
      entityType: 'ANNOUNCEMENT',
      entityId: id,
      details: { title: updated.title, changes: dto },
    });

    return updated;
  }

  async deleteAnnouncement(
    id: string,
    adminId?: string,
    adminEmail?: string,
  ): Promise<{ message: string }> {
    const announcement = await this.announcementRepo.findOne({ where: { id } });
    if (!announcement) {
      throw new NotFoundException(`Announcement with id ${id} not found`);
    }

    await this.announcementRepo.remove(announcement);

    await this.auditService.log({
      adminId,
      adminEmail,
      action: 'DELETE_ANNOUNCEMENT',
      entityType: 'ANNOUNCEMENT',
      entityId: id,
      details: { title: announcement.title },
    });

    return { message: 'Announcement deleted successfully' };
  }
}
