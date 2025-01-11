import { BaseEntity } from 'src/common/abstracts/base.entity';
import { EntityName } from 'src/common/enums/entity.enum';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';
import { BlogStatus } from '../enum/blog-status.enum';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { BlogLikeEntity } from './like.entity';
import { BlogBookmarkEntity } from './bookmark.entity';
import { BlogCommentEntity } from './comment.entity';

@Entity(EntityName.Blog)
export class BlogEntity extends BaseEntity {
  @Column()
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  time_for_study: string;

  @Column()
  description: string;

  @Column()
  content: string;

  @Column({ nullable: true })
  image: string;

  @Column({ enum: BlogStatus, default: BlogStatus.Draft })
  status: BlogStatus;

  @Column()
  authorId: number;

  @ManyToOne(() => UserEntity, (user) => user.blogs, { onDelete: 'CASCADE' })
  author: UserEntity;

  @ManyToOne(() => BlogLikeEntity, (blog_like) => blog_like.blog)
  blog_likes: BlogLikeEntity[];

  @ManyToOne(() => BlogBookmarkEntity, (blog_bookmarks) => blog_bookmarks.blog)
  blog_bookmarks: BlogBookmarkEntity[];

  @OneToMany(() => BlogCommentEntity, (comment) => comment.blog)
  comments: BlogCommentEntity[];

  @UpdateDateColumn()
  updated_at: Date;
}
