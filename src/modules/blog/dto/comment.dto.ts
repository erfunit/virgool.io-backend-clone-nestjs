import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, Length } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty()
  @Length(5)
  text: string;

  @ApiPropertyOptional()
  @IsNumber()
  parentId?: number;
}
