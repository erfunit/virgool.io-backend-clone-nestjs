import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { RequiredAuth } from 'src/common/decorators/auth.decorator';
import { CommentsService } from '../service/comments.service';
import { SwaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import { CreateCommentDto } from '../dto/comment.dto';

@Controller('blog-comments')
@ApiTags('Comments')
@RequiredAuth()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get('toggle-accespt/blog/:blogId/comment/:commentId')
  toggleAccept(
    @Param('blogId', ParseIntPipe) blogId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
  ) {
    return this.commentsService.toggleAccept(blogId, commentId);
  }

  @Post()
  @ApiConsumes(SwaggerConsumes.Json, SwaggerConsumes.UrlEncoded)
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.create(createCommentDto);
  }
}
