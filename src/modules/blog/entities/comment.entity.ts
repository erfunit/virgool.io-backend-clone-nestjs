import { BaseEntity } from 'src/common/abstracts/base.entity';
import { EntityName } from 'src/common/enums/entity.enum';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BlogEntity } from './blog.entity';
import { UserEntity } from 'src/modules/users/entities/user.entity';

@Entity(EntityName.BlogComment)
export class BlogCommentEntity extends BaseEntity {
  @Column()
  text: string;

  @Column({ default: true })
  accepted: boolean;

  @Column()
  blogId: number;

  @Column()
  userId: number;

  @Column()
  parentId: number;

  @ManyToOne(() => BlogEntity, (blog) => blog.comments, { onDelete: 'CASCADE' })
  blog: BlogEntity;

  @ManyToOne(() => UserEntity, (user) => user.blog_comments, {
    onDelete: 'CASCADE',
  })
  @ManyToOne(() => BlogCommentEntity, (comment) => comment.children, {
    onDelete: 'CASCADE',
  })
  parent: BlogCommentEntity;

  @OneToMany(() => BlogCommentEntity, (blog_comment) => blog_comment.parent)
  @JoinColumn({ name: 'parent' })
  children: BlogCommentEntity[];

  user: UserEntity;
}
