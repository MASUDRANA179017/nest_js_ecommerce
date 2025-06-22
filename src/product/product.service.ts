import { User } from './../users/user.schema';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/entity/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/crate-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Store } from 'src/entity/store.entity';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private ProductRepository: Repository<Product>,
        @InjectRepository(User)
        private UserRepository: Repository<User>,
        @InjectRepository(Store)
        private StoreRepository: Repository<Store>,
    ) { }

    async createProduct(createProductDto: CreateProductDto, userId: number): Promise<Product> {
        const { storeId, name, ...productData } = createProductDto;
        const user = await this.UserRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new Error(`User with ID ${userId} not found`);
        }
        const store = await this.StoreRepository.findOne({ where: { id: storeId, owner: { id: userId } }, relations: ['owner'] });
        if (!store) {
            throw new Error(`Store with ID ${storeId} not found or you do not have permission to access it`);
        }

        // Check for duplicate product name
        const existingProduct = await this.ProductRepository.findOne({ where: { name } });
        if (existingProduct) {
            throw new Error(`Product with name "${name}" already exists.`);
        }

        const product = this.ProductRepository.create(
            {
                name,
                ...productData,
                vendor: user,
                store: store
            }
        );

        return this.ProductRepository.save(product);
    }

    async getAllProducts(): Promise<Product[]> {
        return this.ProductRepository.find({ relations: ['vendor', 'store'] });
    }

    async getProductById(id: string, userId: number): Promise<Product> {
        const product = await this.ProductRepository.findOne({ where: { id: Number(id) } });
        const user = await this.UserRepository.findOne({ where: { id: userId } });
        if (!product) {
            throw new Error(`Product with ID ${id} not found or you do not have permission to access it`);
        }
        if (!user) {
            throw new Error(`User with ID ${userId} not found`);
        }
        // Ensure vendor and store relations are loaded
        const productWithRelations = await this.ProductRepository.findOne({
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

        const { storeId, ...updateData } = updateProductDto;

        // console.log('updateProduct called with:', { id, updateProductDto, userId });

        const user = await this.UserRepository.findOne({ where: { id: userId } });
        if (!user) {
            console.error('User not found:', userId);
            throw new Error("user not found -c");
        }

        const product = await this.ProductRepository.findOne({ where: { id: Number(id) }, relations: ['store', 'vendor'] });

        if (!product) {
            console.error('Product not found:', id);
            throw new Error(`Product with ID ${id} not found`);
        }

        // Optionally update store if storeId is provided
        if (storeId) {
            const store = await this.StoreRepository.findOne({ where: { id: storeId, owner: { id: userId } }, relations: ['owner'] });
            if (!store) {
                console.error('Store not found or not owned by user:', storeId);
                throw new Error(`Store with ID ${storeId} not found or you do not have permission to access it`);
            }
            product.store = store;
        }

        // object assign with Product repository to save this product data 
        Object.assign(product, updateData);

        await this.ProductRepository.save(product);
        return this.getProductById(id , userId);
    }

    async deleteProduct(id: string): Promise<void> {
        const product = await this.ProductRepository.findOne({ where: { id: Number(id) } });
        if (!product) {
            throw new Error(`Product with ID ${id} not found`);
        }
        await this.ProductRepository.delete(id);
    }



}
