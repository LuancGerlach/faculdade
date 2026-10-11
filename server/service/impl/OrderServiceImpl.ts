import type { OrderService } from '../OrderService.js';
import type { OrderRepository } from '../../repository/OrderRepository.js';
import type { ProductRepository } from '../../repository/ProductRepository.js';
import type { UserRepository } from '../../repository/UserRepository.js';
import type { CreateOrderRequestDto } from '../../dto/order/OrderRequestDto.js';
import type { CouponResponseDto, OrderResponseDto } from '../../dto/order/OrderResponseDto.js';
import type { Order, OrderItem } from '../../entity/Order.js';
import { OrderMapper } from '../../mapper/OrderMapper.js';
import { calculateDiscountInCents, findCouponDiscountPercent, generateOrderCode } from '../../utils/PricingUtils.js';
import { ResourceNotFoundException } from '../../exception/ResourceNotFoundException.js';
import { BusinessRuleException } from '../../exception/BusinessRuleException.js';

const RESEND_EMAIL_LIMIT = 5;

export class OrderServiceImpl implements OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly productRepository: ProductRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async create(orderRequest: CreateOrderRequestDto): Promise<OrderResponseDto> {
    const buyer = await this.findUserOrThrow(orderRequest.userId);
    const purchasedProducts = await this.productRepository.findByIds(orderRequest.productIds);

    const foundProductIds = new Set(purchasedProducts.map((product) => product.id));
    const missingProductIds = orderRequest.productIds.filter((productId) => !foundProductIds.has(productId));
    if (missingProductIds.length) {
      throw new ResourceNotFoundException(`Produto(s) não encontrado(s): ${missingProductIds.join(', ')}`);
    }

    const couponPercent = orderRequest.couponCode ? this.resolveCouponPercent(orderRequest.couponCode) : 0;

    const orderItems: OrderItem[] = purchasedProducts.map((product) => ({
      productId: product.id,
      title: product.title,
      type: product.type,
      category: product.category,
      unitPriceInCents: product.priceInCents,
    }));
    const subtotalInCents = orderItems.reduce((subtotal, orderItem) => subtotal + orderItem.unitPriceInCents, 0);
    const discountInCents = calculateDiscountInCents(subtotalInCents, orderRequest.paymentMethod, couponPercent);

    const savedOrder = await this.orderRepository.save({
      code: generateOrderCode(),
      userId: buyer.id,
      status: 'PAGO',
      paymentMethod: orderRequest.paymentMethod,
      subtotalInCents,
      discountInCents,
      totalInCents: subtotalInCents - discountInCents,
      items: orderItems,
    });

    return OrderMapper.toDto(savedOrder, buyer.email);
  }

  async findById(id: number): Promise<OrderResponseDto> {
    const foundOrder = await this.findOrderOrThrow(id);
    return this.toDtoWithBuyerEmail(foundOrder);
  }

  async findByUserId(userId: number): Promise<OrderResponseDto[]> {
    const buyer = await this.findUserOrThrow(userId);
    const userOrders = await this.orderRepository.findByUserId(userId);
    return userOrders.map((order) => OrderMapper.toDto(order, buyer.email));
  }

  // Mock do reenvio: incrementa contador e data; não envia e-mail de verdade
  async resendEmail(id: number): Promise<OrderResponseDto> {
    const foundOrder = await this.findOrderOrThrow(id);
    if (foundOrder.status === 'CANCELADO') {
      throw new BusinessRuleException('Pedido cancelado não pode ter o e-mail reenviado');
    }
    if (foundOrder.emailSentCount >= RESEND_EMAIL_LIMIT) {
      throw new BusinessRuleException(`Limite de ${RESEND_EMAIL_LIMIT} envios atingido para este pedido`);
    }

    const updatedOrder = await this.orderRepository.update(id, {
      emailSentCount: foundOrder.emailSentCount + 1,
      lastEmailSentAt: new Date(),
    });
    return this.toDtoWithBuyerEmail(updatedOrder);
  }

  async delete(id: number): Promise<void> {
    await this.findOrderOrThrow(id);
    await this.orderRepository.deleteById(id);
  }

  async findCoupon(couponCode: string): Promise<CouponResponseDto> {
    return { code: couponCode.toUpperCase(), discountPercent: this.resolveCouponPercent(couponCode) };
  }

  private resolveCouponPercent(couponCode: string): number {
    const discountPercent = findCouponDiscountPercent(couponCode);
    if (discountPercent === undefined) throw new ResourceNotFoundException(`Cupom ${couponCode} inválido ou expirado`);
    return discountPercent;
  }

  private async toDtoWithBuyerEmail(order: Order) {
    const buyer = await this.findUserOrThrow(order.userId);
    return OrderMapper.toDto(order, buyer.email);
  }

  private async findOrderOrThrow(id: number) {
    const foundOrder = await this.orderRepository.findById(id);
    if (!foundOrder) throw new ResourceNotFoundException(`Pedido ${id} não encontrado`);
    return foundOrder;
  }

  private async findUserOrThrow(userId: number) {
    const foundUser = await this.userRepository.findById(userId);
    if (!foundUser) throw new ResourceNotFoundException(`Usuário ${userId} não encontrado`);
    return foundUser;
  }
}
