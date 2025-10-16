import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { Blog } from 'src/entity/blog.entity';
import { User } from 'src/entity/user.entity';
import { Tag } from 'src/entity/tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Blog, User, Tag])],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
