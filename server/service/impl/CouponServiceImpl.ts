import type { CouponService } from '../CouponService.js';
import type { CouponResponseDto } from '../../dto/coupon/CouponResponseDto.js';
import { findCouponDiscountPercent } from '../../utils/CouponUtils.js';
import { ResourceNotFoundException } from '../../exception/ResourceNotFoundException.js';

export class CouponServiceImpl implements CouponService {
  async findByCode(couponCode: string): Promise<CouponResponseDto> {
    const discountPercent = findCouponDiscountPercent(couponCode);
    if (discountPercent === undefined) {
      throw new ResourceNotFoundException(`Cupom ${couponCode} inválido ou expirado`);
    }
    return { code: couponCode.trim().toUpperCase(), discountPercent };
  }
}
