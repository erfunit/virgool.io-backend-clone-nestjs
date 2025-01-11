import { BaseEntity } from 'src/common/abstracts/base.entity';
import { EntityName } from 'src/common/enums/entity.enum';
import { Entity } from 'typeorm';

@Entity(EntityName.BlogCategory)
export class BlogCategoryEntity extends BaseEntity {}
