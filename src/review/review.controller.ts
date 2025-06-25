import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReviewService } from './review.service';
import { JwtAuthGuard } from 'src/jwt-auth.guard';
import { CreateReviewDto } from './dto/crate-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@ApiTags('review')
@Controller('review')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) { }

    @Post('create')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new review' })
    @ApiResponse({
        status: 201,
        description: 'Review created successfully',
    })
    @ApiResponse({
        status: 403,
        description: 'Forbidden',
    })
    @ApiResponse({
        status: 404,
        description: 'Product or User not found',
    })
    @ApiResponse({
        status: 400,
        description: 'Bad Request',
    })
    async createReview(@Body() createReviewDto: CreateReviewDto, @Request() req: any) {
        return this.reviewService.createReview(createReviewDto, req.user.id);
    }


    @Get('get-by-product/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get reviews by product ID' })
    @ApiResponse({
        status: 200,
        description: 'Reviews retrieved successfully',
    })
    @ApiResponse({
        status: 404,
        description: 'Product not found',
    })
    async getReviewsByProductId(@Param('id') id: string) {
        const productId = parseInt(id);
        return this.reviewService.getReviewsByProductId(productId);
    }


    @Put('update/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update an existing review' })
    @ApiResponse({
        status: 200,
        description: 'Review updated successfully',
    })
    @ApiResponse({
        status: 403,
        description: 'Forbidden',
    })
    @ApiResponse({
        status: 404,
        description: 'Review not found',
    })
    @ApiResponse({
        status: 400,
        description: 'Bad Request',
    })
    async updateReview(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto, @Request() req: any) {
        const reviewId = parseInt(id);
        return this.reviewService.updateReview(reviewId, updateReviewDto, req.user.id);
    }

    @Delete('delete/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete a review' })
    @ApiResponse({
        status: 200,
        description: 'Review deleted successfully',
    })
    @ApiResponse({
        status: 403,
        description: 'Forbidden',
    })
    @ApiResponse({
        status: 404,
        description: 'Review not found',
    })
    async deleteReview(@Param('id') id: string, @Request() req: any) {
        const reviewId = parseInt(id);
        return this.reviewService.deleteReview(reviewId, req.user.id);
    }


}
