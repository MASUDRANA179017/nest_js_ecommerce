import { Module } from '@nestjs/common';
import { CheckoutController } from './checkout.controller';
import { CheckoutService } from './checkout.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/entity/product.entity';
import { User } from 'src/entity/user.entity';
import { OrderItem } from 'src/entity/order-item.entity';
import { Order } from 'src/entity/order.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([Order,Product, OrderItem, User]) ],
  controllers: [CheckoutController],
  providers: [CheckoutService]
})
export class CheckoutModule {}
