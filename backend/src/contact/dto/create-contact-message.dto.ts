import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateContactMessageDto {
  @ApiProperty({ example: 'Abdullah Khan' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'abdullah@example.com' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Inquiry regarding weekend community activities' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  subject: string;

  @ApiProperty({ example: 'As-salamu alaykum, could you provide more details about the youth programme schedule?' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  message: string;
}
