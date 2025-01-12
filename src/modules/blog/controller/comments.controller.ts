import { Body, Controller, Post } from '@nestjs/common';
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

  @Post()
  @ApiConsumes(SwaggerConsumes.Json, SwaggerConsumes.UrlEncoded)
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.create(createCommentDto);
  }
}
