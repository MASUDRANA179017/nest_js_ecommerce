import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ProductService } from "./product.service";
import { JwtAuthGuard } from "src/jwt-auth.guard";
import { CreateProductDto } from "./dto/crate-product.dto";


@ApiTags("product")
@Controller("product")
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post("create")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a new product" })
  @ApiResponse({
    status: 201,
    description: "Product created successfully",
  })
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productService.createProduct(createProductDto);
  }

  @Get("getAll")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all products" })
  @ApiResponse({
    status: 200,
    description: "Products retrieved successfully",
  })
  @ApiResponse({
    status: 403,
    description: "Products not found",
  })
  async getAllProducts() {
    return this.productService.getAllProducts();
  }


  @Get("getById/:id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get product by ID" })
  @ApiResponse({
    status: 200,
    description: "Product details",
  })
  @ApiResponse({
    status: 404,
    description: "Product not found",
  })
  async getProductById(@Param("id") id: string) {
    return this.productService.getProductById(id);

  }

  @Post("update/:id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update product by ID" })
  @ApiResponse({
    status: 200,
    description: "Product updated successfully",
  })
  async updateProduct(@Param("id") id: string, @Body() updateProductDto: CreateProductDto) {
    return this.productService.updateProduct(id, updateProductDto);
  }


  @Post("delete/:id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete product by ID" })
  @ApiResponse({
    status: 200,
    description: "Product deleted successfully",
  })
  async deleteProduct(@Param("id") id: string) {
    return this.productService.deleteProduct(id);
  }

}

