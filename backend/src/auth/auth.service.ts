import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { AdminUser } from './entities/admin-user.entity';
import { LoginDto, ChangePasswordDto } from './dto/login.dto';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AdminUser)
    private adminRepo: Repository<AdminUser>,
    private jwtService: JwtService,
    private auditService: AuditService,
  ) {}

  async login(loginDto: LoginDto, ipAddress?: string) {
    const user = await this.adminRepo
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.email = :email', { email: loginDto.email.toLowerCase().trim() })
      .getOne();

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await argon2.verify(user.passwordHash, loginDto.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    user.lastLoginAt = new Date();
    await this.adminRepo.save(user);

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const token = this.jwtService.sign(payload);

    await this.auditService.log({
      adminId: user.id,
      adminEmail: user.email,
      action: 'ADMIN_LOGIN',
      entityType: 'AUTH',
      ipAddress,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    };
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.adminRepo
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.id = :id', { id: userId })
      .getOne();

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isMatch = await argon2.verify(user.passwordHash, dto.currentPassword);
    if (!isMatch) {
      throw new BadRequestException('Current password does not match');
    }

    user.passwordHash = await argon2.hash(dto.newPassword, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 3,
      parallelism: 1,
    });

    await this.adminRepo.save(user);

    await this.auditService.log({
      adminId: user.id,
      adminEmail: user.email,
      action: 'CHANGE_PASSWORD',
      entityType: 'AUTH',
    });

    return { message: 'Password updated successfully' };
  }
}
