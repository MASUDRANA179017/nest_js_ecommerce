import { Module } from '@nestjs/common';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Product } from 'src/entity/product.entity';
import { Tag } from 'src/entity/tag.entity';
import { Blog } from 'src/entity/blog.entity';


@Module({
  imports: [TypeOrmModule.forFeature([User, Product, Tag, Blog])],
  controllers: [TagsController],
  providers: [TagsService]
})
export class TagsModule {}
