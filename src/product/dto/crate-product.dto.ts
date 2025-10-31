import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, Min, IsArray, ArrayNotEmpty } from "class-validator";

export class CreateProductDto {
  @ApiProperty({
    description: "The name of the product",
    example: "Laptop",
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: "The description of the product",
    example: "A high-performance laptop",
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: "Product price",
    example: 999,
  })
  @IsNotEmpty()
  @Min(0)
  price: number;

  @ApiProperty({
    description: "Product stock",
    example: 100,
  })
  @IsNotEmpty()
  @Min(0)
  stock: number;

  @ApiProperty({
    description: "Store ID of the vendor",
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
