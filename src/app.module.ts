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

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "postgres",
      password: "admin123",
      database: "postgres",
      entities: [User, Product,Store, Review],
      synchronize: true,
    }),
    AuthModule,
    ProductModule,
    ImageModule,
    StoreModule,
    ReviewModule,
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
