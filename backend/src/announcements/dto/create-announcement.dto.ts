import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAnnouncementDto {
  @ApiProperty({ example: 'Eid Al-Fitr Prayer Times & Guidelines' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Prayer will be held in three shifts: 7:30am, 8:45am, 10:00am.' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ example: 'Eid Notice', required: false })
  @IsString()
  @IsOptional()
  badgeText?: string;

  @ApiProperty({ default: false, required: false })
  @IsBoolean()
  @IsOptional()
  isPinned?: boolean;

  @ApiProperty({ default: true, required: false })
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  expiresAt?: string;
}
