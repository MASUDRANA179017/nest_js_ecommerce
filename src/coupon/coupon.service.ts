import { CreateCouponDto } from './dto/create-coupon.dto';
import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/entity/category.entity';
import { Coupon } from 'src/entity/coupon.entity';
import { Product } from 'src/entity/product.entity';
import { Store } from 'src/entity/store.entity';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';

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
            const category = await this.categoryRepository.findOne({ where: { id: categoryId} })
            if (!category) {
                throw new BadRequestException("Category not found")
            }

        }else if (scope === "FLAT") {
            if (productId || categoryId) {
                throw new BadRequestException("FLAT coupons do not require productId or CategoryId remove it")
            }
        }else {
            throw new BadRequestException("Invalid scope or missing required field")
        }

        if (discountType === "PERCENTAGE" && (discountValue < 0 || discountValue > 100)) {
            throw new BadRequestException("Percentage discount must be between 1 and 100")
        }else if (discountType === "FIXED" && discountValue <= 0) {
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
            expiresAt : expiresAt? new Date(expiresAt):"",
            createdAt: new Date()
        }) as Partial<Coupon>;

        return this.couponRepository.save(coupon);

    }


}
