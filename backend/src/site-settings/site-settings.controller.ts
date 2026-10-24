import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SiteSettingsService } from './site-settings.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AdminUser } from '../auth/entities/admin-user.entity';

@ApiTags('Site Settings')
@Controller()
export class SiteSettingsController {
  constructor(private siteSettingsService: SiteSettingsService) {}

  @Get('site-settings')
  @ApiOperation({ summary: 'Get public site settings and organisation metadata' })
  async getPublicSettings() {
    return this.siteSettingsService.getPublicSettings();
  }

  @Get('admin/site-settings')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all site settings including internal configs (Admin only)' })
  async getAdminSettings() {
    return this.siteSettingsService.getAllSettingsAdmin();
  }

  @Put('admin/site-settings')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a site setting value (Admin only)' })
  async updateSetting(
    @Body() body: { key: string; value: string },
    @CurrentUser() admin: AdminUser,
  ) {
    return this.siteSettingsService.updateSetting(
      body.key,
      body.value,
      admin.id,
      admin.email,
    );
  }
}
