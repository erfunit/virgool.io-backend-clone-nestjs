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
}
