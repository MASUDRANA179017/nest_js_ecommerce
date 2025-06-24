import { User } from './../users/user.schema';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/entity/product.entity';
import { In, Not, Repository } from 'typeorm';
import { CreateProductDto } from './dto/crate-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Store } from 'src/entity/store.entity';
import { Category } from 'src/entity/category.entity';
import { NotFoundError } from 'rxjs';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Store)
        private storeRepository: Repository<Store>,
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
    ) { }

    async createProduct(createProductDto: CreateProductDto, userId: number): Promise<Product> {
        const { storeId, name, categoryId, ...productData } = createProductDto;
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new Error(`User with ID ${userId} not found`);
        }
        const store = await this.storeRepository.findOne({ where: { id: storeId, owner: { id: userId } }, relations: ['owner'] });
        if (!store) {
            throw new Error(`Store with ID ${storeId} not found or you do not have permission to access it`);
        }

        
        // Check for duplicate product name
        const existingProduct = await this.productRepository.findOne({ where: { name } });
        if (existingProduct) {
            throw new Error(`Product with name "${name}" already exists.`);
        }

        const category = await this.categoryRepository.findOne({ where: { id: categoryId } });
        if (!category) {
            throw new NotFoundException(`Category with ID ${categoryId} not found`);
        }

        const product = this.productRepository.create(
            {
                ...productData,
                vendor: user,
                store,
                category,
            }
        );

        return this.productRepository.save(product);
    }

    async getAllProducts(): Promise<Product[]> {
        return this.productRepository.find({ relations: ['vendor', 'store', 'category', 'reviews'] });
    }

    async getProductById(id: string, userId: number): Promise<Product> {
        const product = await this.productRepository.findOne({ where: { id: Number(id) }, relations: ['vendor', 'store', 'category', 'reviews'] });
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!product) {
            throw new Error(`Product with ID ${id} not found or you do not have permission to access it`);
        }
        if (!user) {
            throw new Error(`User with ID ${userId} not found`);
        }
        // Ensure vendor and store relations are loaded
        const productWithRelations = await this.productRepository.findOne({
            where: { id: product.id },
            relations: ['vendor', 'store'],
        });

        if (!productWithRelations) {
            throw new Error(`You are not authorized to access this product or it does not exist`);
        }

        // Optionally, check if store and vendor are defined
        if (!productWithRelations.vendor) {
            throw new Error(`Vendor for product with ID ${id} is undefined`);
        }
        if (!productWithRelations.store) {
            throw new Error(`Store for product with ID ${id} is undefined`);
        }


        return productWithRelations;
    }


    async updateProduct(id: string, updateProductDto: UpdateProductDto, userId: number): Promise<Product> {

        const product = await this.productRepository.findOne({ where: { id: Number(id) }, relations: ['store', 'vendor', 'category', 'reviews'] });

        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
        if (product?.vendor.id !== userId) {
            throw new Error(`You are not authorized to update this product`);
        }

        if(updateProductDto.storeId){
            const store = await this.storeRepository.findOne({ where: { id: updateProductDto.storeId, owner: { id: userId } }, relations: ['owner'] });
            if (!store) {
                throw new ForbiddenException(`Store with ID ${updateProductDto.storeId} not found or you do not have permission to access it`);
            }
            product.store = store;
        }

        if (updateProductDto.categoryId) {
            const category = await this.categoryRepository.findOne({ where: { id: updateProductDto.categoryId } });
            if (!category) {
                throw new NotFoundException(`Category with ID ${updateProductDto.categoryId} not found`);
            }
            product.category = category;
        }

        Object.assign(product, updateProductDto);
        const updatedProduct = await this.productRepository.save(product);
        return updatedProduct;
    }

    async deleteProduct(id: string, userId: number): Promise<void> {
        const product = await this.productRepository.findOne({ where: { id: Number(id) } });
        if (product?.vendor.id !== userId) {
            throw new Error(`You are not authorized to update this product`);
        }
        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
        await this.productRepository.delete(id);
    }



}
