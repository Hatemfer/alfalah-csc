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
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AdminUser } from '../auth/entities/admin-user.entity';

@ApiTags('Events & Courses')
@Controller()
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Get('events')
  @ApiOperation({ summary: 'List upcoming published events' })
  async getUpcomingEvents(@Query('category') category?: string) {
    return this.eventsService.getUpcomingEvents(category);
  }

  @Get('events/past')
  @ApiOperation({ summary: 'List past published events' })
  async getPastEvents(@Query('limit') limit?: string) {
    const parsedLimit = limit ? parseInt(limit, 10) : 10;
    return this.eventsService.getPastEvents(parsedLimit);
  }

  @Get('events/:slug')
  @ApiOperation({ summary: 'Get details of a single published event by slug' })
  async getEventBySlug(@Param('slug') slug: string) {
    return this.eventsService.getEventBySlug(slug);
  }

  @Get('admin/events')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CONTENT_EDITOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all events for CMS management' })
  async getAdminEvents() {
    return this.eventsService.getAllEventsAdmin();
  }

  @Post('admin/events')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CONTENT_EDITOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new event' })
  async createEvent(
    @Body() dto: CreateEventDto,
    @CurrentUser() admin: AdminUser,
  ) {
    return this.eventsService.createEvent(dto, admin.id, admin.email);
  }

  @Put('admin/events/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CONTENT_EDITOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an existing event' })
  async updateEvent(
    @Param('id') id: string,
    @Body() dto: Partial<CreateEventDto>,
    @CurrentUser() admin: AdminUser,
  ) {
    return this.eventsService.updateEvent(id, dto, admin.id, admin.email);
  }

  @Delete('admin/events/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an event' })
  async deleteEvent(
    @Param('id') id: string,
    @CurrentUser() admin: AdminUser,
  ) {
    return this.eventsService.deleteEvent(id, admin.id, admin.email);
  }
}
