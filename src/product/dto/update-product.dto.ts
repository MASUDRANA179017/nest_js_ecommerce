import { ApiProperty } from "@nestjs/swagger"
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl } from "class-validator"

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
        description: "Thumbnail image URL",
        example: "http://localhost:8000/uploads/products/file-1761926804589-16322692.jpg",
      })
      @IsString()
      @IsNotEmpty()
      productThumbnail: string;
    
      @ApiProperty({
        description: "Array of product gallery image URLs",
        example: [
          "http://localhost:8000/uploads/products/gallery1.jpg",
          "http://localhost:8000/uploads/products/gallery2.jpg",
        ],
        isArray: true,
        type: String,
      })
      @IsArray()
      @ArrayNotEmpty()
      @IsString({ each: true })
      productGallery: string[];

    
}