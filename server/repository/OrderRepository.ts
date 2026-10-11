import type { Order } from '../entity/Order.js';

export type NewOrder = Omit<Order, 'id' | 'createdAt' | 'emailSentCount' | 'lastEmailSentAt'>;
export type OrderChanges = Partial<Pick<Order, 'status' | 'emailSentCount' | 'lastEmailSentAt'>>;

export interface OrderRepository {
  save(newOrder: NewOrder): Promise<Order>;
  update(id: number, changes: OrderChanges): Promise<Order>;
  findById(id: number): Promise<Order | null>;
  findByUserId(userId: number): Promise<Order[]>;
  deleteById(id: number): Promise<void>;
}
