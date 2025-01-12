import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { Repository } from 'typeorm';
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

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const { title, priority } = createCategoryDto;
    if (await this.existanceCheckByTitle(title.trim().toLowerCase()))
      throw new ConflictException(ConflictMessage.CategoryExists);

    const category = this.categoryRepository.create({ title, priority });
    await this.categoryRepository.save(category);
    return {
      message: PublicMessage.CategoryCreated,
      data: category,
    };
  }

  

  async findAll(paginationDto: PaginationDto) {
    console.log(paginationDto);
    const { page, limit, skip } = paginationResolver(paginationDto);
    const [categories, count] = await this.categoryRepository.findAndCount({
      skip,
      take: limit,
      where: {},
    });

    return {
      data: categories,
      pagination: paginationGenerator(count, page, limit),
    };
  }

  findOne(id: number) {
    const category = this.categoryRepository.findOneBy({ id });
    if (!category)
      throw new NotFoundException(NotFoundMessage.CategoryNotFound);
    return category;
  }

  findOneByTitle(title: string) {
    return this.categoryRepository.findOneBy({ title });
  }

  async existanceCheckByTitle(title: string) {
    const category = await this.categoryRepository.findOneBy({ title });
    return Boolean(category);
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id);
    const { title, priority } = updateCategoryDto;
    if (title) category.title = title;
    if (priority) category.priority = priority;
    await this.categoryRepository.save(category);
    return {
      message: PublicMessage.CategoryUpdate,
      data: category,
    };
  }

  async remove(id: number) {
    const category = await this.findOne(id);
    await this.categoryRepository.delete({ id: category.id });
    return {
      message: PublicMessage.CategoryDeleted,
      data: category,
    };
  }
}
