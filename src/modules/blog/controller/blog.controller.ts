import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { BlogService } from '../service/blog.service';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { SwaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import {
  ChangeStatusDto,
  CreateBlogDto,
  FilterBlogDto,
  UpdateBlogDto,
} from '../dto/blog.dto';
import { Pagination } from 'src/common/decorators/pagination.decorator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { RequiredAuth } from 'src/common/decorators/auth.decorator';
import { FilterBlog } from '../decorator/filter-blog.decorator';

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
  @FilterBlog()
  find(
    @Query() paginationDto: PaginationDto,
    @Query() filterDto: FilterBlogDto,
  ) {
    return this.blogService.blogList(paginationDto, filterDto);
  }

  @Get('/my-blogs')
  @RequiredAuth()
  getMyBlogs() {
    return this.blogService.getMyBlogs();
  }

  @Get(':slug')
  @RequiredAuth(true)
  findOne(@Param('slug') slug: string) {
    return this.blogService.findOne(slug);
  }

  @Get('like/:id')
  @RequiredAuth()
  toggleLike(@Param('id', ParseIntPipe) id: number) {
    return this.blogService.toggleLike(id);
  }

  @Get('bookmark/:id')
  @RequiredAuth()
  toggleBookmark(@Param('id', ParseIntPipe) id: number) {
    return this.blogService.toggleBookmark(id);
  }

  @Put(':id')
  @RequiredAuth()
  @ApiConsumes(
    SwaggerConsumes.UrlEncoded,
    SwaggerConsumes.Json,
    // SwaggerConsumes.MultipartData,
  )
  updateBlog(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBlogDto: UpdateBlogDto,
  ) {
    return this.blogService.update(id, updateBlogDto);
  }

  @Patch('status/:blogId')
  @RequiredAuth()
  @ApiConsumes(
    SwaggerConsumes.UrlEncoded,
    SwaggerConsumes.Json,
    // SwaggerConsumes.MultipartData,
  )
  updateStatus(
    @Param('blogId', ParseIntPipe) blogId: number,
    @Body() changeStatusDto: ChangeStatusDto,
  ) {
    return this.blogService.changeStatus(blogId, changeStatusDto);
  }

  @Delete(':id')
  @RequiredAuth()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.blogService.remove(id);
  }
}
