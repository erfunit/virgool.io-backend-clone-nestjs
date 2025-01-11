import { BaseEntity } from 'src/common/abstracts/base.entity';
import { EntityName } from 'src/common/enums/entity.enum';
import { Column, Entity, ManyToOne, UpdateDateColumn } from 'typeorm';
import { BlogStatus } from '../enum/blog-status.enum';
import { UserEntity } from 'src/modules/users/entities/user.entity';

@Entity(EntityName.Blog)
export class BlogEntity extends BaseEntity {
  @Column()
  title: string;

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

  @ManyToOne(() => UserEntity, user.blogs, { onDelete: 'CASCADE' })
  author: UserEntity;

  @UpdateDateColumn()
  updated_at: Date;
}
