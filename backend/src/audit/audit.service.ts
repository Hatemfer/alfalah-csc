import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private auditRepo: Repository<AuditLog>,
  ) {}

  async log(entry: {
    adminId?: string;
    adminEmail?: string;
    action: string;
    entityType: string;
    entityId?: string;
    details?: Record<string, any>;
    ipAddress?: string;
  }) {
    try {
      const logItem = this.auditRepo.create(entry);
      await this.auditRepo.save(logItem);
    } catch (e) {
      console.error('Audit logging failed silently:', e);
    }
  }

  async findAll(limit = 100) {
    return this.auditRepo.find({
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}
