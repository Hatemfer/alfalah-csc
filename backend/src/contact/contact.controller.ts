import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { ContactService } from './contact.service';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@ApiTags('Contact & Community Inquiries')
@Controller()
export class ContactController {
  constructor(private contactService: ContactService) {}

  @Post('contact')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Submit a message through the public contact form' })
  async submitContact(
    @Body() dto: CreateContactMessageDto,
    @Req() req: Request,
  ) {
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;
    return this.contactService.submitMessage(dto, ip);
  }

  @Get('admin/contact-messages')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all community inquiries for administration' })
  async getAdminMessages() {
    return this.contactService.getAllMessagesAdmin();
  }

  @Put('admin/contact-messages/:id/read')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle read status of a message' })
  async markRead(
    @Param('id') id: string,
    @Body('isRead') isRead: boolean,
  ) {
    return this.contactService.markAsRead(id, isRead);
  }
}
