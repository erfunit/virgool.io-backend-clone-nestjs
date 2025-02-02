import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogEntity } from '../entities/blog.entity';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import {
  ChangeStatusDto,
  CreateBlogDto,
  FilterBlogDto,
  UpdateBlogDto,
} from '../dto/blog.dto';
import { generateSlug } from 'src/common/utils/slug.util';
import { BlogStatus } from '../enum/blog-status.enum';
import { Request } from 'express';
import {
  ConflictMessage,
  NotFoundMessage,
  PublicMessage,
} from 'src/common/enums/message.enums';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import {
  paginationGenerator,
  paginationResolver,
} from 'src/common/utils/pagination.util';
import { BlogCategoryEntity } from '../entities/blog-category.entity';
import { CategoryService } from '../../category/category.service';
import { isArray, isString } from 'class-validator';
import { EntityName } from 'src/common/enums/entity.enum';
import { BlogLikeEntity } from '../entities/like.entity';
import { BlogBookmarkEntity } from '../entities/bookmark.entity';

@Injectable({ scope: Scope.REQUEST })
export class BlogService {
  constructor(
    @InjectRepository(BlogEntity)
    private readonly blogRepository: Repository<BlogEntity>,
    @InjectRepository(BlogCategoryEntity)
    private readonly blogCategoryRepository: Repository<BlogCategoryEntity>,
    @InjectRepository(BlogLikeEntity)
    private readonly blogLikeRepository: Repository<BlogLikeEntity>,
    @InjectRepository(BlogBookmarkEntity)
    private readonly blogBookmarkRepository: Repository<BlogBookmarkEntity>,
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
      .leftJoin('blog.author', 'author')
      .leftJoin('author.profile', 'profile')
      .leftJoin('blog.blog_likes', 'blog_likes')
      .leftJoin('blog.categories', 'categories')
      .leftJoin('categories.category', 'category')
      .loadRelationCountAndMap('blog.like_count', 'blog.blog_likes')
      .loadRelationCountAndMap('blog.bookmark_count', 'blog.blog_bookmarks')
      .addSelect([
        'categories.id',
        'category.title',
        'author.username',
        'author.id',
        'profile.nick_name',
      ])
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

  async findOneById(id: number) {
    const blog = await this.blogRepository.findOneBy({ id });
    if (!blog) throw new NotFoundException(NotFoundMessage.BlogNotFound);
    return blog;
  }

  async findOne(slug: string) {
    const user = this.request.user;

    const pureBlog = await this.blogRepository.findOneBy({ slug });
    if (!pureBlog) throw new NotFoundException(NotFoundMessage.BlogNotFound);

    const blog = await this.blogRepository
      .createQueryBuilder('blog')
      .leftJoinAndSelect('blog.comments', 'comments')
      .leftJoinAndSelect('comments.user', 'commentUser')
      .leftJoinAndSelect('commentUser.profile', 'commentUserProfile')
      .leftJoinAndSelect('blog.author', 'author')
      .leftJoinAndSelect('author.profile', 'profile')
      .leftJoinAndSelect('blog.categories', 'categories')
      .leftJoinAndSelect('categories.category', 'category')
      .loadRelationCountAndMap('blog.like_count', 'blog.blog_likes')
      .loadRelationCountAndMap('blog.bookmark_count', 'blog.blog_bookmarks')
      .loadRelationCountAndMap(
        'blog.comments_count',
        'blog.comments',
        'comment',
        (qb) => qb.where('comment.accepted = :accepted', { accepted: true }),
      )
      .where('blog.slug = :slug', { slug })
      .andWhere(
        user
          ? '(blog.status = :publishedStatus OR (blog.status = :draftedStatus AND blog.authorId = :userId))'
          : 'blog.status = :publishedStatus',
        {
          publishedStatus: BlogStatus.Published,
          draftedStatus: BlogStatus.Draft,
          userId: user?.id,
        },
      )
      .andWhere(
        user && user.id === pureBlog.authorId
          ? '1=1'
          : 'comments.accepted = :accepted',
        { accepted: true },
      )
      .select([
        'blog.id',
        'blog.title',
        'blog.slug',
        'blog.time_for_study',
        'blog.description',
        'blog.content',
        'blog.status',
        'categories.id',
        'category.title',
        'author.username',
        'author.id',
        'profile.nick_name',
        'comments.text',
        'comments.id',
        'comments.parentId',
        'comments.accepted',
        'commentUser.username',
        'commentUserProfile.nick_name',
        'commentUserProfile.profile_image',
      ])
      .getOne();

    if (!blog) {
      throw new NotFoundException(NotFoundMessage.BlogNotFound);
    }

    return blog;
  }

  async toggleLike(blogId: number) {
    const { id: userId } = this.request.user;
    await this.findOneById(blogId);
    const isLiked = await this.blogLikeRepository.findOneBy({ userId, blogId });
    let message = PublicMessage.BlogLiked;
    if (isLiked) {
      await this.blogLikeRepository.delete({ blogId, userId });
      message = PublicMessage.BlogDisliked;
    } else {
      await this.blogLikeRepository.insert({ blogId, userId });
    }

    return { message };
  }

  async toggleBookmark(blogId: number) {
    const { id: userId } = this.request.user;
    await this.findOneById(blogId);
    const isBookmarked = await this.blogBookmarkRepository.findOneBy({
      userId,
      blogId,
    });
    let message = PublicMessage.BlogBookmarked;
    if (isBookmarked) {
      await this.blogBookmarkRepository.delete({ blogId, userId });
      message = PublicMessage.BlogBookmarkedRemoved;
    } else {
      await this.blogBookmarkRepository.insert({ blogId, userId });
    }

    return { message };
  }

  async update(id: number, blogDto: UpdateBlogDto) {
    const blog = await this.findOneById(id);

    const { title, description, content, slug, time_for_study, categories } =
      blogDto;

    if (blog.authorId !== this.request.user.id)
      throw new NotFoundException(NotFoundMessage.BlogNotFound);

    // Update slug if provided or generate from title
    if (slug && slug !== blog.slug) {
      const newSlug = generateSlug(slug, false);
      const existingBlog = await this.blogRepository.findOneBy({
        slug: newSlug,
      });
      if (existingBlog && existingBlog.id !== id)
        throw new ConflictException(ConflictMessage.BlogSlug);
      blog.slug = newSlug;
    } else if (title && title !== blog.title) {
      blog.slug = generateSlug(title, true);
    }

    // Update blog fields
    if (title) blog.title = title;
    if (description) blog.description = description;
    if (content) blog.content = content;
    if (time_for_study) blog.time_for_study = time_for_study;

    await this.blogRepository.save(blog);

    // Update categories
    if (categories) {
      if (!isArray(categories) && isString(categories)) {
        blogDto.categories = categories.split(',');
      }

      // Clear existing categories
      await this.blogCategoryRepository.delete({ blogId: id });

      // Add new categories
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
    }

    return {
      message: PublicMessage.BlogUpdated,
      data: blog,
    };
  }

  async changeStatus(blogId: number, changeStatusDto: ChangeStatusDto) {
    const { id: authorId } = this.request.user;
    const blog = await this.blogRepository.findOneBy({
      id: blogId,
      authorId,
    });
    if (!blog) throw new NotFoundException(NotFoundMessage.BlogNotFound);

    const { status: newStatus } = changeStatusDto;

    blog.status = newStatus;
    await this.blogRepository.save(blog);
    return {
      message: `blog status changed to (${newStatus})`,
    };
  }

  async remove(id: number) {
    const { id: userId } = this.request.user;
    const blog = await this.findOneById(id);
    if (blog.authorId !== userId)
      throw new NotFoundException(NotFoundMessage.BlogNotFound);
    await this.blogRepository.delete({ id });
    return {
      message: PublicMessage.BlogRemoved,
      data: blog,
    };
  }
}
