import type { Request, Response } from 'express';
import type { CouponService } from '../service/CouponService.js';

// Equivalente ao @RestController @RequestMapping("/api/coupons")
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  findByCode = async (request: Request, response: Response) => {
    response.status(200).json(await this.couponService.findByCode(String(request.params.code)));
  };
}
