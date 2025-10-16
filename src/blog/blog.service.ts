import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from 'src/entity/blog.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { User } from 'src/entity/user.entity';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createBlog(createBlogDto: CreateBlogDto, userId: number, tagId?: number | number[]): Promise<Blog> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException(`User with ID ${userId} not found`);

    const tagIds = Array.isArray(tagId) ? tagId : tagId ? [tagId] : [];
    const blog = this.blogRepository.create({
      ...createBlogDto,
      user,
      tags: tagIds.map(id => ({ id })),
    });

    return this.blogRepository.save(blog);
  }

  async getAllBlogs(paging: { page?: number; limit?: number }): Promise<Blog[]> {
    const page = paging?.page ?? 1;
    const limit = paging?.limit ?? 10;
    const take = limit;
    const skip = (page - 1) * limit;

    return this.blogRepository.find({
      relations: ['user', 'tags'],
      order: { id: 'DESC' },
      take,
      skip,
    });
  }

  async getBlogById(id: number) {
    const blog = await this.blogRepository.findOne({
      where: { id },
      relations: ['user', 'tags'],
    });
    if (!blog) throw new NotFoundException(`Blog with ID ${id} not found`);
    return blog;
  }

  async updateBlog(id: number, dto: UpdateBlogDto, userId: number) {
    const blog = await this.blogRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!blog) throw new NotFoundException('Blog not found');
    if (blog.user.id !== userId)
      throw new Error('You do not have permission to update this blog');

    Object.assign(blog, dto);
    return this.blogRepository.save(blog);
  }

  async deleteBlog(id: number, userId: number) {
    const blog = await this.blogRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!blog) throw new NotFoundException('Blog not found');
    if (blog.user.id !== userId)
      throw new Error('You do not have permission to delete this blog');

    return this.blogRepository.remove(blog);
  }
}
