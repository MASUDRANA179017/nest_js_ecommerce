import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/crate-review.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from 'src/entity/review.entity';
import { User } from 'src/entity/user.entity';
import { Product } from 'src/entity/product.entity';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewService {
    constructor(
        @InjectRepository(Review)
        private reviewRepository: Repository<Review>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
    ) { }
    async createReview(createReviewDto: CreateReviewDto, userId: number): Promise<Review> {
        const { productId, ...reviewData } = createReviewDto;
        
        const user = await this.userRepository.findOne({ where: { id: userId } });
        const product = await this.productRepository.findOne({ where: { id: productId } });

        if (!user) {
            throw new Error(`User with ID ${userId} not found`);
        }
        if (!product) {
            throw new Error(`Product with ID ${productId} not found`);
        }

        const review = this.reviewRepository.create({
            ...reviewData,
            user,
            product,
            createdAt: new Date(),
        });

        return this.reviewRepository.save(review);
    }

    async updateReview(reviewId: number, updateReviewDto: UpdateReviewDto, userId: number) {
        const review = await this.reviewRepository.findOne({ where: { id: reviewId }, relations: ['user'] });
        if (!review) {
            throw new Error('Review not found');
        }
        if (review.user.id !== userId) {
            throw new Error('You do not have permission to update this review');
        }
        Object.assign(review, updateReviewDto);
        return this.reviewRepository.save(review);
    }

    async getReviewsByProductId(productId: number) {
        const product = await this.productRepository.findOne({ where: { id: productId }, relations: ['reviews', 'reviews.user'] });
        if (!product) {
            throw new Error('Product not found');
        }
        return product.reviews;
    }
    async deleteReview(reviewId: number, userId: number) {
        const review = await this.reviewRepository.findOne({ where: { id: reviewId }, relations: ['user'] });
        if (!review) {
            throw new Error('Review not found');
        }
        if (review.user.id !== userId) {
            throw new Error('You do not have permission to delete this review');
        }
        return this.reviewRepository.remove(review);
    }



}
