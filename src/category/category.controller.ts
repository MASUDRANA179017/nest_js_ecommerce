import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
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


}
