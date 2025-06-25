import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/jwt-auth.guard';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryService } from './category.service';

@ApiTags('category')
@Controller('/category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) { }
    @Post('/create')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new category' })
    @ApiResponse({
        status: 201,
        description: 'Category created successfully',
    })
    @ApiResponse({
        status: 403,
        description: 'Forbidden',
    })
    @ApiResponse({
        status: 400,
        description: 'Bad Request',
    })
    @ApiResponse({
        status: 201,
        description: 'Category created successfully',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    async create(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoryService.create(createCategoryDto);
    }


    @Get('/all')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all categories' })
    @ApiResponse({
        status: 200,
        description: 'List of all categories',
    })
    @ApiResponse({
        status: 403,
        description: 'Forbidden',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    async getAll() {
        return this.categoryService.getAllCategories();
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get a category by ID' })
    @ApiResponse({
        status: 200,
        description: 'Category found',
    })
    @ApiResponse({
        status: 403,
        description: 'Forbidden',
    })
    @ApiResponse({
        status: 404,
        description: 'Category not found',
    })
    async getById(@Param('id') id: string) {
        const categoryId = parseInt(id);
        return this.categoryService.getAllCategories().then(categories => {
            const category = categories.find(cat => cat.id === categoryId);
            if (!category) {
                throw new Error(`Category with ID ${categoryId} not found`);
            }
            return category;
        });
    }



    @Put('update/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update an existing category' })
    @ApiResponse({
        status: 200,
        description: 'Category updated successfully',
    })
    @ApiResponse({
        status: 403,
        description: 'Forbidden',
    })
    @ApiResponse({
        status: 404,
        description: 'Category not found',
    })
    async update(@Param('id') id: string, @Body() updateCategoryDto: CreateCategoryDto) {
        const categoryId = parseInt(id);
        return this.categoryService.update(categoryId, updateCategoryDto);
    }

    @Delete('delete/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete a category' })

    @ApiResponse({
        status: 200,
        description: 'Category deleted successfully',
    })
    @ApiResponse({
        status: 403,
        description: 'Forbidden',
    })
    @ApiResponse({
        status: 404,
        description: 'Category not found',
    })
    async delete(@Param('id') id: string) {
        const categoryId = parseInt(id);
        return this.categoryService.delete(categoryId);
    }

}
