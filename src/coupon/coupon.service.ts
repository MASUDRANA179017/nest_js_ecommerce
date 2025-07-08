import { CreateCouponDto } from './dto/create-coupon.dto';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/entity/category.entity';
import { Coupon } from 'src/entity/coupon.entity';
import { Product } from 'src/entity/product.entity';
import { Store } from 'src/entity/store.entity';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { UpdateCouponDto } from './dto/update-coupon.dto';

@Injectable()
export class CouponService {
    constructor(
        @InjectRepository(Coupon)
        private couponRepository: Repository<Coupon>,

        @InjectRepository(Store)
        private storeRepository: Repository<Store>,

        @InjectRepository(Product)
        private productRepository: Repository<Product>,

        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,

        @InjectRepository(User)
        private userRepository: Repository<User>
    ) { }

    async create(createCouponDto: CreateCouponDto, userId: number): Promise<Coupon> {
        const { code, discountType, discountValue, scope, storeId, productId, categoryId, expiresAt } = createCouponDto
        const store = await this.storeRepository.findOne({ where: { id: storeId, owner: { id: userId } } })

        if (!store) {
            throw new ForbiddenException("Store not found or You are not the owner")
        }

        const existingCoupon = await this.couponRepository.findOne({ where: { code } })

        if (existingCoupon) {
            throw new ForbiddenException("Coupon already exists")
        }

        if (scope === "PRODUCT" && productId) {
            const product = await this.productRepository.findOne({ where: { id: productId, store: { id: storeId } } })
            if (!product) {
                throw new BadRequestException("Product not found or does not belong to this store")
            }
        } else if (scope === "CATEGORY" && categoryId) {
            const category = await this.categoryRepository.findOne({ where: { id: categoryId } })
            if (!category) {
                throw new BadRequestException("Category not found")
            }

        } else if (scope === "FLAT") {
            if (productId || categoryId) {
                throw new BadRequestException("FLAT coupons do not require productId or CategoryId remove it")
            }
        } else {
            throw new BadRequestException("Invalid scope or missing required field")
        }

        if (discountType === "PERCENTAGE" && (discountValue < 0 || discountValue > 100)) {
            throw new BadRequestException("Percentage discount must be between 1 and 100")
        } else if (discountType === "FIXED" && discountValue <= 0) {
            throw new BadRequestException("Fixed discount must be greater then 0")
        }

        const coupon = this.couponRepository.create({
            code,
            discountType,
            discountValue,
            scope,
            store,
            productId,
            categoryId,
            expiresAt: expiresAt ? new Date(expiresAt) : "",
            createdAt: new Date()
        }) as Partial<Coupon>;

        return this.couponRepository.save(coupon);

    }

    async getAllCoupons(): Promise<Coupon[]> {
        return this.couponRepository.find({ relations: ['store'] });
    }


    async updateCoupon(id: number, updateCouponDto: UpdateCouponDto, userId: number): Promise<Coupon> {
        const { code, discountType, discountValue, scope, storeId, productId, categoryId, expiresAt } = updateCouponDto
        const store = await this.storeRepository.findOne({ where: { id: storeId, owner: { id: userId } } })

        if (!store) {
            throw new ForbiddenException("Store not found or You are not the owner")
        }

        const existingCoupon = await this.couponRepository.findOne({ where: { code } })

        if (existingCoupon) {
            throw new ForbiddenException("Coupon already exists")
        }

        const coupon = await this.couponRepository.findOne({ where: { id: Number(id) }, relations: ['store'] });
        if (!coupon) {
            throw new NotFoundException(`Coupons ${id} not found`)
        }

        if (scope === "PRODUCT" && productId) {
            const product = await this.productRepository.findOne({ where: { id: productId, store: { id: storeId } } })
            if (!product) {
                throw new BadRequestException("Product not found or does not belong to this store")
            }
        } else if (scope === "CATEGORY" && categoryId) {
            const category = await this.categoryRepository.findOne({ where: { id: categoryId } })
            if (!category) {
                throw new BadRequestException("Category not found")
            }

        } else if (scope === "FLAT") {
            if (productId || categoryId) {
                throw new BadRequestException("FLAT coupons do not require productId or CategoryId remove it")
            }
        } else {
            throw new BadRequestException("Invalid scope or missing required field")
        }

        if (discountType === "PERCENTAGE" && (discountValue < 0 || discountValue > 100)) {
            throw new BadRequestException("Percentage discount must be between 1 and 100")
        } else if (discountType === "FIXED" && discountValue <= 0) {
            throw new BadRequestException("Fixed discount must be greater then 0")
        }

        // Assign other updatable fields
        Object.assign(coupon, updateCouponDto);

        return this.couponRepository.save(coupon);

    }



    async deleteCoupon(id: string, userId: number): Promise<void> {
        const coupon = await this.couponRepository.findOne({ where: { id: Number(id) }, relations: ['store'] });
        const store = await this.storeRepository.findOne({ where: { id: coupon?.store.id }, relations: ['owner'] })
        const user = await this.userRepository.findOneBy({ id: userId });

        //  console.log(store?.owner.id===user?.id);


        if (store?.owner.id !== user?.id) {
            throw new ForbiddenException('you are not owner to delete this coupon')

        }
        if (!coupon) {
            throw new NotFoundException(`Coupon not found`);
        }
        await this.couponRepository.delete(id);
    }

}
