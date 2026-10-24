import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SiteSetting } from './entities/site-setting.entity';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class SiteSettingsService {
  constructor(
    @InjectRepository(SiteSetting)
    private settingsRepo: Repository<SiteSetting>,
    private auditService: AuditService,
  ) {}

  async getPublicSettings(): Promise<Record<string, string>> {
    const settings = await this.settingsRepo.find({ where: { isPublic: true } });
    const map: Record<string, string> = {};
    for (const s of settings) {
      // Extra security precaution: NEVER expose bank details even if misconfigured
      if (s.key.includes('bank') || s.key.includes('account') || s.key.includes('sort_code')) {
        continue;
      }
      map[s.key] = s.value;
    }
    return map;
  }

  async getAllSettingsAdmin(): Promise<SiteSetting[]> {
    return this.settingsRepo.find({ order: { key: 'ASC' } });
  }

  async updateSetting(key: string, value: string, adminId?: string, adminEmail?: string) {
    let setting = await this.settingsRepo.findOne({ where: { key } });
    if (!setting) {
      setting = this.settingsRepo.create({ key, value, isPublic: true });
    } else {
      setting.value = value;
    }
    const saved = await this.settingsRepo.save(setting);

    await this.auditService.log({
      adminId,
      adminEmail,
      action: 'UPDATE_SITE_SETTING',
      entityType: 'SITE_SETTING',
      entityId: key,
      details: { key, value },
    });

    return saved;
  }
}
