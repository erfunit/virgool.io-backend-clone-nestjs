import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { BlogStatus } from '../enum/blog-status.enum';

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

export class UpdateBlogDto extends PartialType(CreateBlogDto) {}

export class FilterBlogDto {
  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  search?: string;
}

export class ChangeStatusDto {
  @ApiProperty({ enum: BlogStatus })
  @IsEnum(BlogStatus)
  status: BlogStatus;
}
