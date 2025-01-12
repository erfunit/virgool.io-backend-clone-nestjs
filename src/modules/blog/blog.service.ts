import { ConflictException, Inject, Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogEntity } from './entities/blog.entity';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { CreateBlogDto, FilterBlogDto } from './dto/blog.dto';
import { generateSlug } from 'src/common/utils/slug.util';
import { BlogStatus } from './enum/blog-status.enum';
import { Request } from 'express';
import { ConflictMessage, PublicMessage } from 'src/common/enums/message.enums';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import {
  paginationGenerator,
  paginationResolver,
} from 'src/common/utils/pagination.util';
import { BlogCategoryEntity } from './entities/blog-category.entity';
import { CategoryService } from '../category/category.service';
import { isArray, isString } from 'class-validator';
import { EntityName } from 'src/common/enums/entity.enum';

@Injectable({ scope: Scope.REQUEST })
export class BlogService {
  constructor(
    @InjectRepository(BlogEntity)
    private readonly blogRepository: Repository<BlogEntity>,
    @InjectRepository(BlogCategoryEntity)
    private readonly blogCategoryRepository: Repository<BlogCategoryEntity>,
    private readonly categoryService: CategoryService,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  async create(blogDto: CreateBlogDto) {
    if (!isArray(blogDto.categories) && isString(blogDto.categories)) {
      blogDto.categories = blogDto.categories.split(',');
    } else {
      blogDto.categories = [];
    }

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

    for (const categoryTitle of blogDto.categories) {
      let category = await this.categoryService.findOneByTitle(categoryTitle);
      if (!category)
        category = await this.categoryService
          .create({
            title: categoryTitle,
          })
          .then((data) => data.data);
      await this.blogCategoryRepository.insert({
        blogId: blog.id,
        categoryId: category.id,
      });
    }

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

  async blogList(paginationDto: PaginationDto, filterDto: FilterBlogDto) {
    let { category, search } = filterDto;
    let where = '';
    if (category) {
      category = category.toLowerCase();
      if (where.length > 0) where += ' AND ';
      where += 'category.title = LOWER(:category)';
    }
    if (search) {
      if (where.length > 0) where += ' AND ';
      search = `%${search}%`;
      where +=
        'CONCAT(blog.title, blog.description, blog.content) ILIKE :search';
    }

    const { skip, limit: take, page } = paginationResolver(paginationDto);
    const query = this.blogRepository
      .createQueryBuilder(EntityName.Blog)
      .leftJoin('blog.categories', 'categories')
      .leftJoin('categories.category', 'category')
      .addSelect(['categories.id', 'category.title'])
      .where(where, { category, search })
      .orderBy('blog.id', 'DESC')
      .skip(skip)
      .take(take);

    const [blogs, count] = await query.getManyAndCount();

    return {
      data: blogs,
      pagination: paginationGenerator(count, page, take),
    };
  }
}
