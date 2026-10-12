import type { CouponResponseDto } from '../dto/coupon/CouponResponseDto.js';

export interface CouponService {
  findByCode(couponCode: string): Promise<CouponResponseDto>;
}
