import type { Request, Response } from 'express';
import type { OrderService } from '../service/OrderService.js';
import type { CreateOrderRequestDto } from '../dto/order/OrderRequestDto.js';
import { parseIdParam } from './pathParams.js';

// Equivalente ao @RestController @RequestMapping("/api/orders")
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  create = async (request: Request, response: Response) => {
    const createdOrder = await this.orderService.create(request.body as CreateOrderRequestDto);
    response.status(201).location(`/api/orders/${createdOrder.id}`).json(createdOrder);
  };

  findById = async (request: Request, response: Response) => {
    response.status(200).json(await this.orderService.findById(parseIdParam(request.params.id)));
  };

  findByUserId = async (request: Request, response: Response) => {
    response.status(200).json(await this.orderService.findByUserId(parseIdParam(request.params.id)));
  };

  resendEmail = async (request: Request, response: Response) => {
    response.status(200).json(await this.orderService.resendEmail(parseIdParam(request.params.id)));
  };

  delete = async (request: Request, response: Response) => {
    await this.orderService.delete(parseIdParam(request.params.id));
    response.status(204).send();
  };

  findCoupon = async (request: Request, response: Response) => {
    response.status(200).json(await this.orderService.findCoupon(String(request.params.code)));
  };
}
