import { desc, eq } from 'drizzle-orm';
import type { Database } from '../../../database/connection.js';
import { orders } from '../../../database/schema.js';
import type { Order } from '../../../entity/Order.js';
import type { NewOrder, OrderChanges, OrderRepository } from '../../OrderRepository.js';
import { ResourceNotFoundException } from '../../../exception/ResourceNotFoundException.js';

export class PostgresOrderRepository implements OrderRepository {
  constructor(private readonly database: Database) {}

  async save(newOrder: NewOrder): Promise<Order> {
    const [savedOrder] = await this.database.insert(orders).values(newOrder).returning();
    return savedOrder as Order;
  }

  async update(id: number, changes: OrderChanges): Promise<Order> {
    const [updatedOrder] = await this.database.update(orders).set(changes).where(eq(orders.id, id)).returning();
    if (!updatedOrder) throw new ResourceNotFoundException(`Pedido ${id} não encontrado`);
    return updatedOrder as Order;
  }

  async findById(id: number): Promise<Order | null> {
    const [foundOrder] = await this.database.select().from(orders).where(eq(orders.id, id));
    return (foundOrder as Order) ?? null;
  }

  async findByUserId(userId: number): Promise<Order[]> {
    const orderRows = await this.database
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));
    return orderRows as Order[];
  }

  async deleteById(id: number): Promise<void> {
    await this.database.delete(orders).where(eq(orders.id, id));
  }
}
