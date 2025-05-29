import { Body, Controller, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StoreService } from './store.service';
import { JwtAuthGuard } from 'src/jwt-auth.guard';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@ApiTags('store')
@Controller('store')
export class StoreController {
    constructor( private readonly storeService: StoreService ) {}


    @Post('create')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new store' })
    @ApiResponse({
        status: 201,
        description: 'Store created successfully',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    async createStore(@Body() createStoreDto: CreateStoreDto, @Request() req: any ) { 
        return this.storeService.create( createStoreDto, req.user.id );
    }


    @Get("getAll")
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all stores' })
    @ApiResponse({
        status: 200,
        description: 'Returns an array of stores',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    async getAllStores(@Request() req: any) {
        return this.storeService.getAll();
    }


    @Get('getSingleStore/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get store by ID' })
    @ApiResponse({
        status: 200,
        description: 'Returns the store with the specified ID',
    })
    @ApiResponse({
        status: 404,
        description: 'Store not found',
    })
    async getStoreById(@Param('id') id: string){
        return this.storeService.getStoreById(+id);
    }


    @Put('updateStore/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update store by ID' })
    @ApiResponse({
        status: 200,
        description: 'Store updated successfully',
    })
    @ApiResponse({
        status: 404,
        description: 'Store not found',
    })
    async updateStore(@Param('id') id: string, @Body() updateStoreDto: UpdateStoreDto, @Request() req: any) {
        return this.storeService.updateStore(+id, updateStoreDto, req.user.id);
    }



}
