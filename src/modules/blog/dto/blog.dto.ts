import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateBlogDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(10, 150)
  title: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty()
  @IsNumberString()
  time_for_study: number;

  @ApiPropertyOptional()
  image?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(10, 300)
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(100)
  content: string;

  @ApiPropertyOptional({ type: String, isArray: true })
  // @IsArray()
  categories: string[] | string;
}

export class FilterBlogDto {
  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  search?: string;
}
