import { CouponService } from './coupon.service';
import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/jwt-auth.guard';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';

@ApiTags('coupon')
@Controller('coupon')
export class CouponController {
    constructor(private readonly couponService: CouponService) { }

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

    async createCoupon(@Body() createCouponDto: CreateCouponDto, @Request() req: any) {
        return this.couponService.create(createCouponDto, req.user.id);
    }

    @Get('all-coupon')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Get all coupon code" })
    @ApiResponse({ status: 201, description: "All Coupon code get successfully" })
    @ApiResponse({ status: 400, description: "Bad Request" })
    async getCoupon() {
        return this.couponService.getAllCoupons();
    }


    @Put('update-coupon/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({summary: "Update Coupon by ID"})
    @ApiResponse({status:200, description:"Coupon Update successfully"})
    @ApiResponse({status:401, description:"Unauthorized"})
    @ApiResponse({status: 500, description:"Internal serve error "})
    async updateCoupon(@Param("id") id: string, @Body() updateCouponDto: UpdateCouponDto, @Request() req: any){
        return this.couponService.updateCoupon(+id, updateCouponDto, req.user.id)
    }

    @Delete("delete/:id")
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Delete Coupon by ID" })
    @ApiResponse({
        status: 200,
        description: "Coupon deleted successfully",
    })
    async deleteCoupon(@Param("id") id: string, @Request() req: any) {
        return this.couponService.deleteCoupon(id, req.user.id);
    }
}
