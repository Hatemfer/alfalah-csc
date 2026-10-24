import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { HomepageService } from './homepage.service';
import { HomepageSection } from './entities/homepage-section.entity';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AdminUser } from '../auth/entities/admin-user.entity';

@ApiTags('Homepage Sections')
@Controller()
export class HomepageController {
  constructor(private homepageService: HomepageService) {}

  @Get('homepage')
  @ApiOperation({ summary: 'Get all published homepage sections for public display' })
  async getPublicSections() {
    return this.homepageService.getPublicSections();
  }

  @Get('admin/homepage-sections')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CONTENT_EDITOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all homepage sections for CMS management' })
  async getAdminSections() {
    return this.homepageService.getAllSectionsAdmin();
  }

  @Put('admin/homepage-sections/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CONTENT_EDITOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a homepage section' })
  async updateSection(
    @Param('id') id: string,
    @Body() body: Partial<HomepageSection>,
    @CurrentUser() admin: AdminUser,
  ) {
    return this.homepageService.updateSection(id, body, admin.id, admin.email);
  }
}
