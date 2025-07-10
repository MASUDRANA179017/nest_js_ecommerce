import { ApiProperty } from "@nestjs/swagger";
import { OrderItemDto } from "./order-item.dto";

export class CreateOrderDto {

  @ApiProperty({
    description: 'The shipping address of the order',
    example: "Nikunjo Dhaka Bangladesh"
  })
  shippingAddress: string;

  @ApiProperty({
    description: 'List of items in the order',
    type: [OrderItemDto],
  })
  items: OrderItemDto[];

  @ApiProperty({
    description: 'Date and time when the order was created',
    example: '2025-07-09T12:30:00.000Z',
  })
  createdAt: Date;


}
