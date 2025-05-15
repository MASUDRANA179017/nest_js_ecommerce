import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString, Min, min } from "class-validator"

export class CreateProductDto {
    @ApiProperty({
        description: "The name of the product",
        example: "Laptop",
    })
    @IsString()
    @IsNotEmpty()
    name: string

    @ApiProperty({
        description: "The description of the product",
        example: "A high-performance laptop",
    })
    @IsString()
    @IsNotEmpty()
    description: string

    @ApiProperty({
        description: "product price",
        example: 999,
    })
    @IsNotEmpty()
    @Min(0)
    price: number

    @ApiProperty({
        description: "product stock",
        example: 100,
    })
    @IsNotEmpty()
    @Min(0)
    stock: number

}