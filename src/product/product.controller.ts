import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ProductService } from "./product.service";
import { JwtAuthGuard } from "src/jwt-auth.guard";
import { CreateProductDto } from "./dto/crate-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";


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
  @ApiResponse({
    status: 403,
    description: "Forbidden",
  })
  @ApiResponse({
    status: 404,
    description: "Store or Category not found",
  })
  @ApiResponse({
    status: 400,
    description: "Bad Request",
  })
  async createProduct(@Body() createProductDto: CreateProductDto, @Request() req: any) {
    return this.productService.createProduct(createProductDto, req.user.id);
  }

  @Get("getAll")
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  @ApiOperation({ summary: "Get all products" })
  @ApiResponse({
    status: 200,
    description: "Products retrieved successfully",
  })
  @ApiResponse({
    status: 403,
    description: "Products not found",
  })
  async getAllProducts(@Request() req: any) {
    return this.productService.getAllProducts(req.user);
  }


  @Get("getById/:id")
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  @ApiOperation({ summary: "Get product by ID" })
  @ApiResponse({
    status: 200,
    description: "Product details",
  })
  @ApiResponse({
    status: 404,
    description: "Product not found",
  })
  async getProductById(@Param("id") id: string, @Request() req: any) {
    return this.productService.getProductById(id);

  }


  @Put("update/:id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update product by ID" })
  @ApiResponse({
    status: 200,
    description: "Product updated successfully",
  })
  @ApiResponse({
    status: 400,
    description: "Bad Request",
  })
  @ApiResponse({
    status: 404,
    description: "Product not found",
  })
  @ApiResponse({
    status: 500,
    description: "amar api jamela ache update product service a"
  })
  async updateProduct(@Param("id") id: string, @Body() updateProductDto: UpdateProductDto, @Request() req: any) {

    return this.productService.updateProduct(id, updateProductDto, req.user.id);
  }


  @Delete("delete/:id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete product by ID" })
  @ApiResponse({
    status: 200,
    description: "Product deleted successfully",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden",
  })
  @ApiResponse({
    status: 404,
    description: "Product not found",
  })
  @ApiResponse({
    status: 500,
    description: "Internal Server Error",
  })
  async deleteProduct(@Param("id") id: string, @Request() req: any) {
    return this.productService.deleteProduct(id, req.user.id);
  }

}

