import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post(':userId')
  createBlog(
    @Param('userId') userId: number,
    @Body() createBlogDto: CreateBlogDto,
  ) {
    return this.blogService.createBlog(createBlogDto, userId, createBlogDto.tags ?? []);
  }

  @Get()
  getAllBlogs(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.blogService.getAllBlogs({ page: +page, limit: +limit });
  }

  @Get(':id')
  getBlogById(@Param('id') id: number) {
    return this.blogService.getBlogById(id);
  }

  @Patch(':id/:userId')
  updateBlog(
    @Param('id') id: number,
    @Param('userId') userId: number,
    @Body() updateBlogDto: UpdateBlogDto,
  ) {
    return this.blogService.updateBlog(id, updateBlogDto, userId);
  }

  @Delete(':id/:userId')
  deleteBlog(@Param('id') id: number, @Param('userId') userId: number) {
    return this.blogService.deleteBlog(id, userId);
  }
}
