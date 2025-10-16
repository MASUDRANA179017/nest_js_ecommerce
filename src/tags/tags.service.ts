import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Product } from 'src/entity/product.entity';
import { Tag } from 'src/entity/tag.entity';
import { Blog } from 'src/entity/blog.entity';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
  ) {}

  // Create a new tag
  async createTag(createTagDto: CreateTagDto): Promise<Tag> {
    const { name, slug, type } = createTagDto;

    // check for duplicate slug
    const existingTag = await this.tagRepository.findOne({ where: { slug } });
    if (existingTag) {
      throw new ConflictException(`Tag with slug "${slug}" already exists`);
    }

    const newTag = this.tagRepository.create(createTagDto);
    return await this.tagRepository.save(newTag);
  }

  // Get all tags
  async getAllTags(): Promise<Tag[]> {
    return this.tagRepository.find({
      relations: ['products', 'blogs'],
      order: { id: 'DESC' },
    });
  }

  // Get single tag by ID
  async getTagById(id: number): Promise<Tag> {
    const tag = await this.tagRepository.findOne({
      where: { id },
      relations: ['products', 'blogs'],
    });

    if (!tag) throw new NotFoundException(`Tag with ID ${id} not found`);
    return tag;
  }

  // Update tag
  async updateTag(id: number, updateTagDto: UpdateTagDto): Promise<Tag> {
    const tag = await this.tagRepository.findOne({ where: { id } });
    if (!tag) throw new NotFoundException(`Tag with ID ${id} not found`);

    Object.assign(tag, updateTagDto);
    return this.tagRepository.save(tag);
  }

  // Delete tag
  async deleteTag(id: number): Promise<{ message: string }> {
    const tag = await this.tagRepository.findOne({ where: { id } });
    if (!tag) throw new NotFoundException(`Tag with ID ${id} not found`);

    await this.tagRepository.remove(tag);
    return { message: `Tag with ID ${id} deleted successfully` };
  }

  // Get tags by type (optional helper)
  async getTagsByType(type: 'post' | 'product'): Promise<Tag[]> {
    return this.tagRepository.find({ where: { type } });
  }
}
