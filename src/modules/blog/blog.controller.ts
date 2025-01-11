import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { BlogService } from './blog.service';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { SwaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import { CreateBlogDto } from './dto/blog.dto';
import { Pagination } from 'src/common/decorators/pagination.decorator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { RequiredAuth } from 'src/common/decorators/auth.decorator';

@ApiTags('Blogs')
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post('/')
  @RequiredAuth()
  @ApiConsumes(
    SwaggerConsumes.UrlEncoded,
    SwaggerConsumes.Json,
    // SwaggerConsumes.MultipartData,
  )
  create(@Body() createBlogDto: CreateBlogDto) {
    return this.blogService.create(createBlogDto);
  }

  @Get('/')
  @Pagination()
  find(@Query() paginationDto: PaginationDto) {
    return this.blogService.blogList(paginationDto);
  }

  @Get('/my-blogs')
  @RequiredAuth()
  getMyBlogs() {
    return this.blogService.getMyBlogs();
  }
}
