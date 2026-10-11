import type { Order } from '../../../entity/Order.js';
import type { NewOrder, OrderChanges, OrderRepository } from '../../OrderRepository.js';
import { ResourceNotFoundException } from '../../../exception/ResourceNotFoundException.js';

export class InMemoryOrderRepository implements OrderRepository {
  private orders: Order[] = [];
  private nextId = 1;

  async save(newOrder: NewOrder): Promise<Order> {
    const now = new Date();
    const savedOrder: Order = { ...newOrder, id: this.nextId++, emailSentCount: 1, lastEmailSentAt: now, createdAt: now };
    this.orders.push(savedOrder);
    return savedOrder;
  }

  async update(id: number, changes: OrderChanges): Promise<Order> {
    const existingOrder = this.orders.find((order) => order.id === id);
    if (!existingOrder) throw new ResourceNotFoundException(`Pedido ${id} não encontrado`);
    Object.assign(existingOrder, changes);
    return existingOrder;
  }

  async findById(id: number): Promise<Order | null> {
    return this.orders.find((order) => order.id === id) ?? null;
  }

  async findByUserId(userId: number): Promise<Order[]> {
    return this.orders
      .filter((order) => order.userId === userId)
      .sort((first, second) => second.createdAt.getTime() - first.createdAt.getTime());
  }

  async deleteById(id: number): Promise<void> {
    this.orders = this.orders.filter((order) => order.id !== id);
  }
}
