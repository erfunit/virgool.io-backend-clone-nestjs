import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';
import { Gender } from '../enum/gender.enum';

export class ProfileDto {
  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  @IsOptional()
  nick_name?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @Length(10, 200)
  @IsOptional()
  bio?: string;

  @ApiPropertyOptional({ format: 'binary' })
  profile_image?: string;

  @ApiPropertyOptional({ format: 'binary' })
  bg_image?: string;

  @ApiPropertyOptional({ enum: Gender })
  @IsEnum(Gender)
  @IsOptional()
  gender: Gender;

  @ApiPropertyOptional({ example: '2000-01-01T10:14:05.274Z' })
  @IsDate()
  @IsOptional()
  birthday: Date;

  @ApiPropertyOptional()
  @IsUrl()
  @IsOptional()
  linkedin_profile: string;

  @ApiPropertyOptional()
  @IsUrl()
  @IsOptional()
  x_profile: string;
}

export class ChangeEmailDto {
  @ApiProperty()
  @IsEmail()
  email: string;
}

export class ChangePhoneDto {
  @ApiProperty()
  @IsMobilePhone('fa-IR')
  phone: string;
}
