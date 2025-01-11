import { BaseEntity } from 'src/common/abstracts/base.entity';
import { EntityName } from 'src/common/enums/entity.enum';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  UpdateDateColumn,
} from 'typeorm';
import { OTPEntity } from './otp.entity';
import { ProfileEntity } from './profile.entity';
import { BlogEntity } from 'src/modules/blog/entities/blog.entity';
import { BlogLikeEntity } from 'src/modules/blog/entities/like.entity';
import { BlogBookmarkEntity } from 'src/modules/blog/entities/bookmark.entity';
import { BlogCommentEntity } from 'src/modules/blog/entities/comment.entity';

@Entity(EntityName.User)
export class UserEntity extends BaseEntity {
  @Column({ unique: true })
  username: string;

  @Column({ unique: true, nullable: true })
  phone: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  otpId: number;

  @OneToOne(() => OTPEntity, (otp) => otp.user, {
    nullable: true,
  })
  @JoinColumn()
  otp: OTPEntity;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ nullable: true })
  profileId?: number;

  @OneToOne(() => ProfileEntity, (profile) => profile.user, { nullable: true })
  @JoinColumn({ name: 'profileId' })
  profile?: ProfileEntity;

  @OneToMany(() => BlogEntity, (blog) => blog.author)
  blogs: BlogEntity[];

  @OneToMany(() => BlogLikeEntity, (blog_like) => blog_like.user)
  blog_likes: BlogLikeEntity[];

  @OneToMany(() => BlogBookmarkEntity, (blog_bookmarks) => blog_bookmarks.user)
  blog_bookmarks: BlogBookmarkEntity[];

  @OneToMany(() => BlogCommentEntity, (blog_comments) => blog_comments.user)
  blog_comments: BlogCommentEntity[];

  @Column({ nullable: true })
  new_email: string;
  @Column({ nullable: true })
  new_phone: string;

  @Column({ nullable: true, default: false })
  email_verified: boolean;
  @Column({ nullable: true, default: false })
  phone_verified: boolean;
}
