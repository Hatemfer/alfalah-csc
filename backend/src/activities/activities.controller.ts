import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AdminUser } from '../auth/entities/admin-user.entity';

@ApiTags('Activities & Community Services')
@Controller()
export class ActivitiesController {
  constructor(private activitiesService: ActivitiesService) {}

  @Get('activities')
  @ApiOperation({ summary: 'List all published community activities & programmes' })
  async getPublicActivities(@Query('category') category?: string) {
    return this.activitiesService.getPublicActivities(category);
  }

  @Get('activities/:slug')
  @ApiOperation({ summary: 'Get details of a single published activity by slug' })
  async getPublicActivity(@Param('slug') slug: string) {
    return this.activitiesService.getPublicActivityBySlug(slug);
  }

  @Get('admin/activities')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CONTENT_EDITOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all activities for CMS management' })
  async getAdminActivities() {
    return this.activitiesService.getAllActivitiesAdmin();
  }

  @Post('admin/activities')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CONTENT_EDITOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new community activity' })
  async createActivity(
    @Body() dto: CreateActivityDto,
    @CurrentUser() admin: AdminUser,
  ) {
    return this.activitiesService.createActivity(dto, admin.id, admin.email);
  }

  @Put('admin/activities/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CONTENT_EDITOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an existing activity' })
  async updateActivity(
    @Param('id') id: string,
    @Body() dto: Partial<CreateActivityDto>,
    @CurrentUser() admin: AdminUser,
  ) {
    return this.activitiesService.updateActivity(id, dto, admin.id, admin.email);
  }

  @Delete('admin/activities/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an activity' })
  async deleteActivity(
    @Param('id') id: string,
    @CurrentUser() admin: AdminUser,
  ) {
    return this.activitiesService.deleteActivity(id, admin.id, admin.email);
  }
}
