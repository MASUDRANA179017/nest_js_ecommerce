import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class UpdateProductDto {
    @ApiProperty({
        description: "The name of the product",
        example: "Laptop",
    })
    @IsString()
    @IsOptional()
    name?: string


    @ApiProperty({
        description: "The description of the product",
        example: "A high-performance laptop",
    })
    @IsString()
    @IsOptional()
    description?: string


    @ApiProperty({
        description: "product price",
        example: 999,
    })
    @IsNumber()
    @IsOptional()
    price?: number

    @ApiProperty({
        description: "product stock",
        example: 100,
    })
    @IsNumber()
    @IsOptional()
    stock?: number

    @ApiProperty({
        description: "Usr ID of the vendor",
        example: 1,
    })
    @IsNotEmpty()
    @IsNumber()
    storeId: number;

    @ApiProperty({
        description: "Category ID of the product",
        example: 1,
    })
    @IsNotEmpty()
    @IsNumber()
    categoryId: number;
}