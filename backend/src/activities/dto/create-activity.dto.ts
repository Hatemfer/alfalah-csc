import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateActivityDto {
  @ApiProperty({ example: 'Youth Arabic Language & Tajweed' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'youth-arabic-tajweed' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: 'Youth' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ example: 'Weekend educational classes for young learners.' })
  @IsString()
  @IsNotEmpty()
  shortDescription: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  fullDescription?: string;

  @ApiProperty({ example: 'Saturdays 10:00 - 12:30', required: false })
  @IsString()
  @IsOptional()
  scheduleInfo?: string;

  @ApiProperty({ example: 'Alfalah Centre, Main Classroom', required: false })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ default: true, required: false })
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;

  @ApiProperty({ default: 0, required: false })
  @IsInt()
  @IsOptional()
  displayOrder?: number;
}
