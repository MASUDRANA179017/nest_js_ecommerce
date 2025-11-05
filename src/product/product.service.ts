import { ImageService } from './../image/image.service';
import { User } from 'src/entity/user.entity';
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
        private readonly imageService: ImageService,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Store)
        private storeRepository: Repository<Store>,
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
    ) { }

    async createProduct(createProductDto: CreateProductDto, userId: number): Promise<Product> {
        const { storeId, categoryId, ...productData } = createProductDto;
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new Error(`User with ID ${userId} not found`);
        }
        const store = await this.storeRepository.findOne({ where: { id: storeId }, relations: ['owner'] });
        if (!store) {
            throw new NotFoundException(`Store with ID ${storeId} not found`);
        }

        // Allow admin or store owner
        if (store.owner.role === 'admin' || store.owner.id !== userId) {
            throw new ForbiddenException(`You do not have permission to use this store`);
        }

        // Check for duplicate product name
        const existingProduct = await this.productRepository.findOne({ where: { name: productData.name } });
        if (existingProduct) {
            throw new Error(`Product with name "${productData.name}" already exists.`);
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

        // all products
        return this.productRepository.find({
            relations: ['vendor', 'store', 'category', 'reviews'],
        });

    }

    async getProductById(id: string): Promise<Product> {
        const product = await this.productRepository.findOne({ where: { id: Number(id) }, relations: ['vendor', 'store', 'category', 'reviews'] });
        // const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!product) {
            throw new Error(`Product with ID ${id} not found or you do not have permission to access it`);
        }
        // if (!user) {
        //     throw new Error(`User with ID ${userId} not found`);
        // }
        // Ensure vendor and store relations are loaded
        const productWithRelations = await this.productRepository.findOne({
            where: { id: product.id },
            relations: ['vendor', 'store', 'category', 'reviews'],
        });

        if (!productWithRelations) {
            throw new Error(`Product with ID ${id} not found or you do not have permission to access it`);
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
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }

        const product = await this.productRepository.findOne({ where: { id: Number(id) }, relations: ['store', 'vendor', 'category', 'reviews'] });

        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }

        // if (userId !== product.vendor.id ) {
        //     throw new ForbiddenException(`You are not authorized to update this product`);
        // }

        // Check for duplicate product name if name is being updated
        if (updateProductDto.name && product.name !== updateProductDto.name) {
            const existingProduct = await this.productRepository.findOne({ where: { name: updateProductDto.name } });
            if (existingProduct && existingProduct.id !== product.id) {
                throw new ForbiddenException(`Product with name "${updateProductDto.name}" already exists.`);
            }
        }

        // Assign other updatable fields
        Object.assign(product, updateProductDto);

        return this.productRepository.save(product);
    }

    async deleteProduct(id: string, userId: number): Promise<void> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }
        const product = await this.productRepository.findOne({
            where: { id: Number(id) },
            relations: ["vendor"],
        });

        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
        // Delete thumbnail
        if (product.productThumbnail) {
            await this.imageService.deleteImage(product.productThumbnail, 'products');
        }

        // Delete gallery images
        if (product.productGallery?.length) {
            for (const img of product.productGallery) {
                await this.imageService.deleteImage(img, 'products');
            }
        }


        // Ensure vendor exists before checking ownership
        if (user.id !== userId || product.vendor.role !== "admin") {
            throw new ForbiddenException(`You are not authorized to delete this product`);
        }

        await this.productRepository.delete(id);
    }



    async vendorProduct(userId: number): Promise<Product[]> {
        const user = await this.userRepository.findOneBy({ id: userId })

        if (user?.role === "admin") {
            // Admin sees all products
            return this.productRepository.find({
                relations: ['vendor', 'store', 'category', 'reviews'],
            });
        }
        if (user?.role === "vendor") {
            // Vendor sees only their own products
            // console.log("this.productRepository");

            return this.productRepository.find({
                where: { vendor: {id: userId} },
                relations: ['vendor', 'store', 'category', 'reviews'],
            });
        }
        return [];
    }



}
