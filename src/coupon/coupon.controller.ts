import { CouponService } from './coupon.service';
import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/jwt-auth.guard';
import { CreateCouponDto } from './dto/create-coupon.dto';

@ApiTags('coupon')
@Controller('coupon')
export class CouponController {
    constructor(private readonly CouponService: CouponService) {}

    @Post('create')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new coupon' })
    @ApiResponse({ status: 201, description: 'Coupon created successfully.' })
    @ApiResponse({ status: 400, description: 'Bad request.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 403, description: 'You are not the store owner' })
    @ApiResponse({ status: 404, description: 'Store, Product or Category not found.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })

    async createCoupon(@Body() createCouponDto : CreateCouponDto, @Request() req:any) {
        return this.CouponService.create(createCouponDto, req.user.id);
    }

}
