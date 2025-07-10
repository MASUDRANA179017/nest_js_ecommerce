import { ApiProperty } from '@nestjs/swagger';

export class OrderItemDto {
  @ApiProperty({
    description: 'Product ID in the order item',
    example: 101,
  })
  productId: number;

  @ApiProperty({
    description: 'Quantity ordered',
    example: 2,
  })
  quantity: number;
}
