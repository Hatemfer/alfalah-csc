import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AdminUser } from '../auth/entities/admin-user.entity';

@ApiTags('Announcements & Notices')
@Controller()
export class AnnouncementsController {
  constructor(private announcementsService: AnnouncementsService) {}

  @Get('announcements')
  @ApiOperation({ summary: 'Get current published announcements for public website' })
  async getPublicAnnouncements() {
    return this.announcementsService.getPublicAnnouncements();
  }

  @Get('admin/announcements')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CONTENT_EDITOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all announcements for CMS management' })
  async getAdminAnnouncements() {
    return this.announcementsService.getAllAnnouncementsAdmin();
  }

  @Post('admin/announcements')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CONTENT_EDITOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new announcement' })
  async createAnnouncement(
    @Body() dto: CreateAnnouncementDto,
    @CurrentUser() admin: AdminUser,
  ) {
    return this.announcementsService.createAnnouncement(
      dto,
      admin.id,
      admin.email,
    );
  }

  @Put('admin/announcements/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CONTENT_EDITOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an existing announcement' })
  async updateAnnouncement(
    @Param('id') id: string,
    @Body() dto: Partial<CreateAnnouncementDto>,
    @CurrentUser() admin: AdminUser,
  ) {
    return this.announcementsService.updateAnnouncement(
      id,
      dto,
      admin.id,
      admin.email,
    );
  }

  @Delete('admin/announcements/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an announcement' })
  async deleteAnnouncement(
    @Param('id') id: string,
    @CurrentUser() admin: AdminUser,
  ) {
    return this.announcementsService.deleteAnnouncement(
      id,
      admin.id,
      admin.email,
    );
  }
}
