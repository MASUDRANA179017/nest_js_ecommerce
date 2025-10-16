import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entity/user.entity";
import { ProductModule } from "./product/product.module";
import { Product } from "./entity/product.entity";
import { ImageModule } from './image/image.module';
import { StoreModule } from './store/store.module';
import { Store } from "./entity/store.entity";
import { ReviewModule } from './review/review.module';
import { Review } from "./entity/review.entity";
import { CategoryModule } from './category/category.module';
import { Category } from "./entity/category.entity";
import { CouponModule } from './coupon/coupon.module';
import { Coupon } from "./entity/coupon.entity";
import { CheckoutModule } from './checkout/checkout.module';
import { Order } from "./entity/order.entity";
import { OrderItem } from "./entity/order-item.entity";
import { TagsModule } from './tags/tags.module';
import { BlogModule } from './blog/blog.module';
import { Tag } from "./entity/tag.entity";
import { Blog } from "./entity/blog.entity";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "postgres",
      password: "admin123",
      database: "postgres",
      entities: [User, Product,Store, Review, Category, Coupon, Order, OrderItem, Tag, Blog],
      synchronize: true,
    }),
    AuthModule,
    ProductModule,
    ImageModule,
    StoreModule,
    ReviewModule,
    CategoryModule,
    CouponModule,
    CheckoutModule,
    TagsModule,
    BlogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
