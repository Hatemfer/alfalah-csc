import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty({ example: 'Annual Community Interfaith Open Day' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'annual-interfaith-open-day-2026' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: 'Community' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ example: 'Welcoming neighbours and friends across Birmingham.' })
  @IsString()
  @IsNotEmpty()
  summary: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '2026-11-15T14:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  startTime: string;

  @ApiProperty({ example: '2026-11-15T17:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  endTime: string;

  @ApiProperty({ default: 'Europe/London', required: false })
  @IsString()
  @IsOptional()
  timezone?: string;

  @ApiProperty({ default: 'Alfalah Community Support Centre', required: false })
  @IsString()
  @IsOptional()
  venue?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  registrationUrl?: string;

  @ApiProperty({ default: false, required: false })
  @IsBoolean()
  @IsOptional()
  isRecurring?: boolean;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  recurrenceRule?: string;

  @ApiProperty({ default: false, required: false })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @ApiProperty({ default: true, required: false })
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  imageUrl?: string;
}
