import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminsService } from './admins.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AdminUser } from '../auth/entities/admin-user.entity';

@ApiTags('Admin User Management')
@Controller('admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN)
@ApiBearerAuth()
export class AdminsController {
  constructor(private adminsService: AdminsService) {}

  @Get()
  @ApiOperation({ summary: 'List all administrative accounts (Super Admin only)' })
  async getAdmins() {
    return this.adminsService.getAllAdmins();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new administrator account (Super Admin only)' })
  async createAdmin(
    @Body()
    body: {
      email: string;
      fullName: string;
      role: UserRole;
      password: string;
    },
    @CurrentUser() admin: AdminUser,
  ) {
    return this.adminsService.createAdmin(body, admin.id, admin.email);
  }

  @Put(':id/active')
  @ApiOperation({ summary: 'Toggle administrator active status' })
  async toggleActive(
    @Param('id') id: string,
    @Body('isActive') isActive: boolean,
    @CurrentUser() admin: AdminUser,
  ) {
    return this.adminsService.toggleActive(id, isActive, admin.id, admin.email);
  }
}
