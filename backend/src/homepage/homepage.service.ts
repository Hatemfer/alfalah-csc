import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HomepageSection } from './entities/homepage-section.entity';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class HomepageService {
  constructor(
    @InjectRepository(HomepageSection)
    private sectionRepo: Repository<HomepageSection>,
    private auditService: AuditService,
  ) {}

  async getPublicSections(): Promise<HomepageSection[]> {
    return this.sectionRepo.find({
      where: { isVisible: true },
      order: { displayOrder: 'ASC' },
    });
  }

  async getAllSectionsAdmin(): Promise<HomepageSection[]> {
    return this.sectionRepo.find({
      order: { displayOrder: 'ASC' },
    });
  }

  async updateSection(
    id: string,
    data: Partial<HomepageSection>,
    adminId?: string,
    adminEmail?: string,
  ): Promise<HomepageSection> {
    const section = await this.sectionRepo.findOne({ where: { id } });
    if (!section) {
      throw new NotFoundException(`Section with id ${id} not found`);
    }

    Object.assign(section, data);
    const updated = await this.sectionRepo.save(section);

    await this.auditService.log({
      adminId,
      adminEmail,
      action: 'UPDATE_HOMEPAGE_SECTION',
      entityType: 'HOMEPAGE_SECTION',
      entityId: id,
      details: { sectionKey: section.sectionKey, changes: data },
    });

    return updated;
  }
}
