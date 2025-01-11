import { ConflictException, Inject, Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogEntity } from './entities/blog.entity';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { CreateBlogDto } from './dto/blog.dto';
import { generateSlug } from 'src/common/utils/slug.util';
import { BlogStatus } from './enum/blog-status.enum';
import { Request } from 'express';
import { ConflictMessage, PublicMessage } from 'src/common/enums/message.enums';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import {
  paginationGenerator,
  paginationResolver,
} from 'src/common/utils/pagination.util';

@Injectable({ scope: Scope.REQUEST })
export class BlogService {
  constructor(
    @InjectRepository(BlogEntity)
    private readonly blogRepository: Repository<BlogEntity>,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  async create(blogDto: CreateBlogDto) {
    if (blogDto.slug && blogDto.slug !== '') {
      const newSlug = generateSlug(blogDto.slug, false);
      const blog = await this.blogRepository.findOneBy({ slug: newSlug });
      if (blog) throw new ConflictException(ConflictMessage.BlogSlug);
      blogDto.slug = newSlug;
    } else {
      blogDto.slug = generateSlug(blogDto.title, true);
    }

    const { title, description, content, slug, time_for_study } = blogDto;
    const blog = this.blogRepository.create({
      title,
      description,
      content,
      slug,
      time_for_study,
      status: BlogStatus.Draft,
      authorId: this.request.user.id,
    });
    await this.blogRepository.save(blog);

    return {
      message: PublicMessage.BlogCreated,
      data: blog,
    };
  }

  getMyBlogs() {
    const { id } = this.request.user;
    return this.blogRepository.find({
      where: { authorId: id },
      order: { id: 'DESC' },
    });
  }

  async blogList(paginationDto: PaginationDto) {
    const { skip, limit: take, page } = paginationResolver(paginationDto);
    const [blogs, count] = await this.blogRepository.findAndCount({
      where: {},
      order: { id: 'DESC' },
      skip,
      take,
    });

    return {
      data: blogs,
      pagination: paginationGenerator(count, page, take),
    };
  }
}
