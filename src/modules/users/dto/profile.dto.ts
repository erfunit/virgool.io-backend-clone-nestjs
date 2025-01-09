import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Gender } from '../enum/gender.enum';

export class ProfileDto {
  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  nick_name: string;

  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @Length(10, 200)
  bio: string;

  @ApiPropertyOptional({ format: 'binary' })
  profile_image: string;

  @ApiPropertyOptional({ format: 'binary' })
  bg_image: string;

  @ApiPropertyOptional({ enum: Gender })
  gender: Gender;

  @ApiPropertyOptional({ example: '2000-01-01T10:14:05.274Z' })
  birthday: Date;

  @ApiPropertyOptional()
  linkedin_profile: string;

  @ApiPropertyOptional()
  x_profile: string;
}
