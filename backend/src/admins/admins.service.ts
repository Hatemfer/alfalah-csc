import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { AdminUser } from '../auth/entities/admin-user.entity';
import { UserRole } from '../common/enums/user-role.enum';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(AdminUser)
    private adminRepo: Repository<AdminUser>,
    private auditService: AuditService,
  ) {}

  async getAllAdmins(): Promise<Omit<AdminUser, 'passwordHash'>[]> {
    return this.adminRepo.find({
      order: { createdAt: 'ASC' },
    });
  }

  async createAdmin(
    dto: { email: string; fullName: string; role: UserRole; password: string },
    currentAdminId: string,
    currentAdminEmail: string,
  ): Promise<Omit<AdminUser, 'passwordHash'>> {
    const existing = await this.adminRepo.findOne({
      where: { email: dto.email.toLowerCase().trim() },
    });
    if (existing) {
      throw new ConflictException(`Administrator with email ${dto.email} already exists`);
    }

    const passwordHash = await argon2.hash(dto.password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 3,
      parallelism: 1,
    });

    const user = this.adminRepo.create({
      email: dto.email.toLowerCase().trim(),
      fullName: dto.fullName,
      role: dto.role,
      passwordHash,
      isActive: true,
    });
    const saved = await this.adminRepo.save(user);

    await this.auditService.log({
      adminId: currentAdminId,
      adminEmail: currentAdminEmail,
      action: 'CREATE_ADMIN',
      entityType: 'ADMIN_USER',
      entityId: saved.id,
      details: { email: saved.email, role: saved.role },
    });

    const { passwordHash: _, ...result } = saved;
    return result as any;
  }

  async toggleActive(
    id: string,
    isActive: boolean,
    currentAdminId: string,
    currentAdminEmail: string,
  ): Promise<AdminUser> {
    if (id === currentAdminId) {
      throw new BadRequestException('Cannot deactivate your own account');
    }

    const user = await this.adminRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    user.isActive = isActive;
    const saved = await this.adminRepo.save(user);

    await this.auditService.log({
      adminId: currentAdminId,
      adminEmail: currentAdminEmail,
      action: isActive ? 'ACTIVATE_ADMIN' : 'DEACTIVATE_ADMIN',
      entityType: 'ADMIN_USER',
      entityId: id,
    });

    return saved;
  }
}
