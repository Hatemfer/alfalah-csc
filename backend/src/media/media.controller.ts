import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { MediaService } from './media.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AdminUser } from '../auth/entities/admin-user.entity';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/pdf',
];

@ApiTags('Media Management')
@Controller('admin/media')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CONTENT_EDITOR)
@ApiBearerAuth()
export class MediaController {
  constructor(private mediaService: MediaService) {}

  @Get()
  @ApiOperation({ summary: 'List all uploaded media assets' })
  async getMedia() {
    return this.mediaService.getAllMedia();
  }

  @Post('upload')
  @ApiOperation({ summary: 'Upload an image or document (max 10MB)' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: process.env.MEDIA_UPLOAD_DIR || './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = `${Date.now()}-${uuidv4()}${extname(file.originalname).toLowerCase()}`;
          cb(null, uniqueSuffix);
        },
      }),
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
      fileFilter: (req, file, cb) => {
        if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
          return cb(
            new BadRequestException(
              `Invalid file type. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`,
            ),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('altText') altText: string,
    @Body('caption') caption: string,
    @CurrentUser() admin: AdminUser,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    return this.mediaService.saveMediaRecord(
      file,
      altText,
      caption,
      admin.id,
      admin.email,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a media asset' })
  async deleteMedia(
    @Param('id') id: string,
    @CurrentUser() admin: AdminUser,
  ) {
    return this.mediaService.deleteMedia(id, admin.id, admin.email);
  }
}
