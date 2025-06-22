import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from 'src/entity/review.entity';
import { User } from 'src/entity/user.entity';
import { Product } from 'src/entity/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Review, User, Product])],
  controllers: [ReviewController],
  providers: [ReviewService]
})
export class ReviewModule {}
