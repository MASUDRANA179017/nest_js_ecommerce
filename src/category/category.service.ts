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

    async getAllCategories(): Promise<Category[]> {
        return this.categoryRepository.find();
    }

    async getCategoryById(id: number): Promise<Category> {
        const category = await this.categoryRepository.findOne({ where: { id } });
        if (!category) {
            throw new Error(`Category with id ${id} not found`);
        }
        return category;
    }

    async update(id: number, updateCategoryDto: CreateCategoryDto): Promise<Category> {
        await this.categoryRepository.update(id, updateCategoryDto);
        const updatedCategory = await this.categoryRepository.findOne({ where: { id } });
        if (!updatedCategory) {
            throw new Error(`Category with id ${id} not found`);
        }
        return updatedCategory;
    }

    async delete(id: number): Promise<void> {
        const result = await this.categoryRepository.delete(id);
        if (result.affected === 0) {
            throw new Error(`Category with id ${id} not found`);
        }
    }
}
