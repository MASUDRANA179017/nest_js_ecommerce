import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class UpdateCouponDto {
    @ApiProperty({
        description: 'The name of the coupon',
        example: 'SUMMER2025',
    })
    @IsString()
    @IsNotEmpty()
    code: string;

    @ApiProperty({
        description: 'The discount type of the coupon',
        example: 'PERCENTAGE',
        enum: ['FIXED', 'PERCENTAGE'],
    })
    @IsEnum(['FIXED', 'PERCENTAGE'])
    discountType: 'FIXED' | 'PERCENTAGE';

    @ApiProperty({
        description: 'The discount value of the coupon',
        example: 20.00,
    })
    @IsNumber()
    @Min(0)
    discountValue: number;

    @ApiProperty({
        description: 'The scope of the coupon',
        example: 'PRODUCT',
        enum: ['PRODUCT', 'CATEGORY', 'FLAT'],
    })
    scope: 'PRODUCT' | 'CATEGORY' | 'FLAT';

    @ApiProperty({
        description: 'The ID of the store the coupon belongs to',
        example: 1,
    })
    @IsInt()
    @IsNotEmpty()
    storeId: number;

    @ApiProperty({
        description: 'The ID of the product the coupon applies to, if applicable',
        example: 1,
        required: false,
    })
    @IsInt()
    @IsNotEmpty()
    productId?: number;

    @ApiProperty({
        description: 'The ID of the category the coupon applies to, if applicable',
        example: 1,
        required: false,
    })
    @IsInt()
    @IsOptional()
    categoryId?: number;

    @ApiProperty({
        description: 'The expiration date of the coupon (ISO format)',
        example: '2023-12-31T23:59:59Z',
        required: false,
    })
    expiresAt?: string;

    @ApiProperty({
        description: 'The user ID of the store owner',
        example: 1,
    })
    userId: number;
}