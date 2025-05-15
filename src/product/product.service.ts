import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/entity/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/crate-product.dto';

@Injectable()
export class ProductService {
    constructor (
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
    ) {}

    async createProduct(createProductDto: CreateProductDto): Promise<Product> {
        const product = this.productRepository.create(createProductDto);
        return this.productRepository.save(product);
    }

    async getAllProducts(): Promise<Product[]> {
        return this.productRepository.find();
    }

    async getProductById(id: string): Promise<Product> {
        const product = await this.productRepository.findOne({ where: { id: Number(id) } });
        if (!product) {
            throw new Error(`Product with ID ${id} not found`);
        }
        return product;
    }

    async updateProduct(id: string, updateProductDto: CreateProductDto): Promise<Product> {
        await this.productRepository.update(id, updateProductDto);
        return this.getProductById(id);
    }
    async deleteProduct(id: string): Promise<void> {
        await this.productRepository.delete(id);
    }



}
