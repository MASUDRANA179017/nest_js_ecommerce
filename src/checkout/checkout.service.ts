
import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItem } from 'src/entity/order-item.entity';
import { Order } from 'src/entity/order.entity';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { Product } from 'src/entity/product.entity';

@Injectable()
export class CheckoutService {
    constructor(
        @InjectRepository(Order) private orderRepository: Repository<Order>,
        @InjectRepository(OrderItem) private itemRepository: Repository<OrderItem>,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Product) private productRepository: Repository<Product>,
    ) { }

    async createOrder(createOrderDto: CreateOrderDto, userId: number) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) throw new Error('User not found');

        if (!createOrderDto.items || createOrderDto.items.length === 0) {
            throw new ForbiddenException('Order items are required');
        }

        const itemTest = this.itemRepository.find()

        // console.log(itemTest);


        if (!itemTest) {
            throw new ForbiddenException('order item not selected or not found')
        }

        let totalAmount = 0;

        const orderItems: OrderItem[] = [];

        for (const item of createOrderDto.items) {
            const { productId, quantity } = item;

            const product = await this.productRepository.findOne({ where: { id: productId } });
            if (!product) throw new ForbiddenException(`Product with ID ${productId} not found`);
            const productPrice = product.price;
            const totalPrice = product.price * quantity;
            totalAmount += totalPrice;

            const orderItem = this.itemRepository.create({
                productId,
                quantity,
                totalPrice,
            });

            orderItems.push(orderItem);
        }


        const order = this.orderRepository.create({
            user,
            totalAmount,
            shippingAddress: createOrderDto.shippingAddress
        });

        const savedOrder = await this.orderRepository.save(order);

        
        await this.itemRepository.save(orderItems);

        return {
            message: 'Order placed successfully',
            order: savedOrder,
            items: orderItems,
        };
    }

    async getAllOrders(): Promise<Order[]> {
        return this.orderRepository.find({ relations: ['user', 'items'] });
    }

}
