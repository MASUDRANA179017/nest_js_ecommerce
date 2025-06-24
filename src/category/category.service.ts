import { Category } from 'src/entity/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
    ) { }
    async create(CreateCategoryDto: CreateCategoryDto): Promise<Category> {
        const category = this.categoryRepository.create(CreateCategoryDto);
        return this.categoryRepository.save(category);

    }
}
