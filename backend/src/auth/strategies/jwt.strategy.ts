import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminUser } from '../entities/admin-user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(AdminUser)
    private adminRepo: Repository<AdminUser>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) => {
          if (request && request.cookies) {
            return request.cookies['alfalah_session'];
          }
          return null;
        },
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'alfalah_dev_jwt_secret_must_be_changed_in_prod_2026_xyz',
    });
  }

  async validate(payload: { sub: string; email: string; role: string }) {
    const user = await this.adminRepo.findOne({
      where: { id: payload.sub, isActive: true },
    });
    if (!user) {
      throw new UnauthorizedException('Session expired or account is inactive');
    }
    return user;
  }
}
