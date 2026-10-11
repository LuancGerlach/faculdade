import { eq } from 'drizzle-orm';
import type { Database } from '../../../database/connection.js';
import { users } from '../../../database/schema.js';
import type { User } from '../../../entity/User.js';
import type { NewUser, UserChanges, UserRepository } from '../../UserRepository.js';
import { ResourceNotFoundException } from '../../../exception/ResourceNotFoundException.js';

export class PostgresUserRepository implements UserRepository {
  constructor(private readonly database: Database) {}

  async save(newUser: NewUser): Promise<User> {
    const [savedUser] = await this.database.insert(users).values(newUser).returning();
    return savedUser;
  }

  async update(id: number, changes: UserChanges): Promise<User> {
    const [updatedUser] = await this.database
      .update(users)
      .set({ ...changes, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    if (!updatedUser) throw new ResourceNotFoundException(`Usuário ${id} não encontrado`);
    return updatedUser;
  }

  async findById(id: number): Promise<User | null> {
    const [foundUser] = await this.database.select().from(users).where(eq(users.id, id));
    return foundUser ?? null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const [foundUser] = await this.database.select().from(users).where(eq(users.email, email));
    return foundUser ?? null;
  }

  async findByCpf(cpf: string): Promise<User | null> {
    const [foundUser] = await this.database.select().from(users).where(eq(users.cpf, cpf));
    return foundUser ?? null;
  }
}
