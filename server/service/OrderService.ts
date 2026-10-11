import type { CreateOrderRequestDto } from '../dto/order/OrderRequestDto.js';
import type { CouponResponseDto, OrderResponseDto } from '../dto/order/OrderResponseDto.js';

export interface OrderService {
  create(orderRequest: CreateOrderRequestDto): Promise<OrderResponseDto>;
  findById(id: number): Promise<OrderResponseDto>;
  findByUserId(userId: number): Promise<OrderResponseDto[]>;
  resendEmail(id: number): Promise<OrderResponseDto>;
  delete(id: number): Promise<void>;
  findCoupon(couponCode: string): Promise<CouponResponseDto>;
}
