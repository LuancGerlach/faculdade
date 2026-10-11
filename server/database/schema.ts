import { pgTable, serial, varchar, integer, real, text, jsonb, timestamp } from 'drizzle-orm/pg-core';
import type { ProductModule } from '../entity/Product.js';
import type { OrderItem } from '../entity/Order.js';

// Equivalente às classes @Entity. O DDL real fica em database/migrations (estilo Flyway)
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 160 }).notNull(),
  type: varchar('type', { length: 20 }).notNull(),
  category: varchar('category', { length: 60 }).notNull(),
  map: varchar('map', { length: 40 }),
  priceInCents: integer('price_in_cents').notNull(),
  oldPriceInCents: integer('old_price_in_cents'),
  rating: real('rating').notNull().default(0),
  reviewsCount: integer('reviews_count').notNull().default(0),
  salesCount: integer('sales_count').notNull().default(0),
  badge: varchar('badge', { length: 10 }),
  author: varchar('author', { length: 80 }).notNull(),
  description: text('description').notNull(),
  modules: jsonb('modules').$type<ProductModule[]>().notNull().default([]),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 120 }).notNull(),
  email: varchar('email', { length: 160 }).notNull().unique(),
  cpf: varchar('cpf', { length: 11 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 100 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  code: varchar('code', { length: 20 }).notNull().unique(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  status: varchar('status', { length: 20 }).notNull(),
  paymentMethod: varchar('payment_method', { length: 20 }).notNull(),
  subtotalInCents: integer('subtotal_in_cents').notNull(),
  discountInCents: integer('discount_in_cents').notNull().default(0),
  totalInCents: integer('total_in_cents').notNull(),
  items: jsonb('items').$type<OrderItem[]>().notNull(),
  emailSentCount: integer('email_sent_count').notNull().default(1),
  lastEmailSentAt: timestamp('last_email_sent_at', { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
