import { Inject, Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogEntity } from './entities/blog.entity';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { CreateBlogDto } from './dto/blog.dto';
import { generateSlug } from 'src/common/utils/slug.util';

@Injectable({ scope: Scope.REQUEST })
export class BlogService {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    @InjectRepository(BlogEntity)
    private readonly blogRepository: Repository<BlogEntity>,
  ) {}

  async create(blogDto: CreateBlogDto) {
    const slugData = blogDto.slug || blogDto.title;
    blogDto.slug = generateSlug(slugData);
    const { title, description, content, slug, time_for_study } = blogDto;
    return blogDto;
  }
}
