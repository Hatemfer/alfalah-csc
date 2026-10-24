import { IsNotEmpty, IsNumber, IsString, IsOptional, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePrayerSettingsDto {
  @ApiProperty({ example: 52.4578 })
  @IsNumber()
  @IsNotEmpty()
  latitude: number;

  @ApiProperty({ example: -1.8904 })
  @IsNumber()
  @IsNotEmpty()
  longitude: number;

  @ApiProperty({ example: 'Europe/London' })
  @IsString()
  @IsNotEmpty()
  timezone: string;

  @ApiProperty({ example: 'BirminghamUnified' })
  @IsString()
  @IsNotEmpty()
  calculationMethod: string;

  @ApiProperty({ example: 18.0 })
  @IsNumber()
  @Min(10)
  @Max(22)
  fajrAngle: number;

  @ApiProperty({ example: 18.0 })
  @IsNumber()
  @Min(10)
  @Max(22)
  ishaAngle: number;

  @ApiProperty({ example: 'HANAFI' })
  @IsString()
  asrJuristic: string;

  @ApiProperty({ example: 20 })
  @IsInt()
  @Min(0)
  fajrIqamahOffsetMins: number;

  @ApiProperty({ example: 15 })
  @IsInt()
  @Min(0)
  dhuhrIqamahOffsetMins: number;

  @ApiProperty({ example: 15 })
  @IsInt()
  @Min(0)
  asrIqamahOffsetMins: number;

  @ApiProperty({ example: 10 })
  @IsInt()
  @Min(0)
  maghribIqamahOffsetMins: number;

  @ApiProperty({ example: 15 })
  @IsInt()
  @Min(0)
  ishaIqamahOffsetMins: number;
}

export class CreatePrayerOverrideDto {
  @ApiProperty({ example: '2026-10-24' })
  @IsString()
  @IsNotEmpty()
  date: string; // YYYY-MM-DD

  @ApiProperty({ example: '05:45', required: false })
  @IsString()
  @IsOptional()
  fajrAdhan?: string;

  @ApiProperty({ example: '06:15', required: false })
  @IsString()
  @IsOptional()
  fajrIqamah?: string;

  @ApiProperty({ example: '07:48', required: false })
  @IsString()
  @IsOptional()
  sunrise?: string;

  @ApiProperty({ example: '12:55', required: false })
  @IsString()
  @IsOptional()
  dhuhrAdhan?: string;

  @ApiProperty({ example: '13:15', required: false })
  @IsString()
  @IsOptional()
  dhuhrIqamah?: string;

  @ApiProperty({ example: '15:45', required: false })
  @IsString()
  @IsOptional()
  asrAdhan?: string;

  @ApiProperty({ example: '16:00', required: false })
  @IsString()
  @IsOptional()
  asrIqamah?: string;

  @ApiProperty({ example: '17:58', required: false })
  @IsString()
  @IsOptional()
  maghribAdhan?: string;

  @ApiProperty({ example: '18:05', required: false })
  @IsString()
  @IsOptional()
  maghribIqamah?: string;

  @ApiProperty({ example: '19:20', required: false })
  @IsString()
  @IsOptional()
  ishaAdhan?: string;

  @ApiProperty({ example: '19:45', required: false })
  @IsString()
  @IsOptional()
  ishaIqamah?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}
