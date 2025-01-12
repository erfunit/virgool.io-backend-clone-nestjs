import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RequiredAuth } from 'src/common/decorators/auth.decorator';
import { CommentsService } from '../service/comments.service';

@Controller('comments')
@ApiTags('Comments')
@RequiredAuth()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}
}
