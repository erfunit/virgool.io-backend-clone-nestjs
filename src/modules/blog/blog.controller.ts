import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { BlogService } from './blog.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { SwaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import { CreateBlogDto } from './dto/blog.dto';

@Controller('blog')
@ApiTags('Blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post('/')
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard)
  @ApiConsumes(SwaggerConsumes.Json, SwaggerConsumes.MultipartData)
  create(@Body() createBlogDto: CreateBlogDto) {
    return this.blogService.create(createBlogDto);
  }
}
