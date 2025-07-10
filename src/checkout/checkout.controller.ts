import { CheckoutService } from './checkout.service';
import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/jwt-auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';

@ApiTags('order')
@Controller('checkout')
export class CheckoutController {
    constructor(private readonly checkoutService: CheckoutService) { }

    @Post('create')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new coupon' })
    @ApiResponse({ status: 201, description: 'Coupon created successfully.' })
    @ApiResponse({ status: 400, description: 'Bad request.' })
    @ApiResponse({ status: 401, description: 'Unauthorized. rana' })
    @ApiResponse({ status: 403, description: 'You are not the store owner' })
    @ApiResponse({ status: 404, description: 'Store, Product or Category not found.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })

    async createOrder(@Body() createOrderDto: CreateOrderDto, @Request() req: any) {
        return this.checkoutService.createOrder(createOrderDto, req.user.id);
    }


    @Get('all-order')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Get all coupon code" })
    @ApiResponse({ status: 201, description: "All Coupon code get successfully" })
    @ApiResponse({ status: 400, description: "Bad Request" })
    async getCoupon() {
        return this.checkoutService.getAllOrders();
    }
}
