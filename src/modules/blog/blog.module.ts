import { Module } from '@nestjs/common';
import { BlogService } from './service/blog.service';
import { BlogController } from './controller/blog.controller';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogEntity } from './entities/blog.entity';
import { BlogLikeEntity } from './entities/like.entity';
import { BlogCommentEntity } from './entities/comment.entity';
import { BlogBookmarkEntity } from './entities/bookmark.entity';
import { BlogCategoryEntity } from './entities/blog-category.entity';
import { CategoryService } from '../category/category.service';
import { CategoryEntity } from '../category/entities/category.entity';
import { CommentsController } from './controller/comments.controller';
import { CommentsService } from './service/comments.service';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      BlogEntity,
      BlogLikeEntity,
      BlogCommentEntity,
      BlogBookmarkEntity,
      BlogCategoryEntity,
      CategoryEntity,
    ]),
  ],
  controllers: [BlogController, CommentsController],
  providers: [BlogService, CategoryService, CommentsService],
})
export class BlogModule {}
