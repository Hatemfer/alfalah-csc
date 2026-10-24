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
import { PrayerTimesService } from './prayer-times.service';
import {
  UpdatePrayerSettingsDto,
  CreatePrayerOverrideDto,
} from './dto/prayer-settings.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AdminUser } from '../auth/entities/admin-user.entity';

@ApiTags('Prayer Times & Qibla')
@Controller()
export class PrayerTimesController {
  constructor(private prayerService: PrayerTimesService) {}

  @Get('prayer-times/today')
  @ApiOperation({ summary: 'Get today\'s prayer timetable and next prayer countdown for Birmingham' })
  async getTodayTimes() {
    return this.prayerService.getTodayTimes();
  }

  @Get('prayer-times/monthly')
  @ApiOperation({ summary: 'Get monthly prayer timetable' })
  async getMonthlyTimes(
    @Query('year') year?: string,
    @Query('month') month?: string,
  ) {
    const now = new Date();
    const targetYear = year ? parseInt(year, 10) : now.getFullYear();
    const targetMonth = month ? parseInt(month, 10) : now.getMonth() + 1;
    return this.prayerService.getMonthlyTimes(targetYear, targetMonth);
  }

  @Get('prayer-times/qibla')
  @ApiOperation({ summary: 'Get calculated Qibla compass bearing from Birmingham' })
  async getQibla() {
    return this.prayerService.getQiblaDirection();
  }

  @Get('admin/prayer-settings')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get prayer calculation configuration' })
  async getSettings() {
    return this.prayerService.getSettings();
  }

  @Put('admin/prayer-settings')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update prayer calculation parameters' })
  async updateSettings(
    @Body() dto: UpdatePrayerSettingsDto,
    @CurrentUser() admin: AdminUser,
  ) {
    return this.prayerService.updateSettings(dto, admin.id, admin.email);
  }

  @Get('admin/prayer-overrides')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all manual timetable overrides' })
  async getOverrides() {
    return this.prayerService.getOverrides();
  }

  @Post('admin/prayer-overrides')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add or update official mosque timetable override for a date' })
  async createOverride(
    @Body() dto: CreatePrayerOverrideDto,
    @CurrentUser() admin: AdminUser,
  ) {
    return this.prayerService.createOrUpdateOverride(dto, admin.id, admin.email);
  }

  @Delete('admin/prayer-overrides/:date')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a prayer time override by date' })
  async deleteOverride(
    @Param('date') date: string,
    @CurrentUser() admin: AdminUser,
  ) {
    return this.prayerService.deleteOverride(date, admin.id, admin.email);
  }
}
