import { BaseEntity } from 'src/common/abstracts/base.entity';
import { EntityName } from 'src/common/enums/entity.enum';
import { Entity } from 'typeorm';

@Entity(EntityName.Bookmark)
export class BookmarkEntity extends BaseEntity {}
