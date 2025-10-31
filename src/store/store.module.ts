import { Module } from '@nestjs/common';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from 'src/entity/store.entity';
import { User } from 'src/entity/user.entity';
import { Product } from 'src/entity/product.entity';


@Module({
  imports: [ TypeOrmModule.forFeature([Store, User, Product]) ],
  controllers: [StoreController],
  providers: [StoreService]
})
export class StoreModule {}
