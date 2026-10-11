import type { User } from '../../../entity/User.js';
import type { NewUser, UserChanges, UserRepository } from '../../UserRepository.js';
import { ResourceNotFoundException } from '../../../exception/ResourceNotFoundException.js';

export class InMemoryUserRepository implements UserRepository {
  private readonly users: User[] = [];
  private nextId = 1;

  async save(newUser: NewUser): Promise<User> {
    const now = new Date();
    const savedUser: User = { ...newUser, id: this.nextId++, createdAt: now, updatedAt: now };
    this.users.push(savedUser);
    return savedUser;
  }

  async update(id: number, changes: UserChanges): Promise<User> {
    const existingUser = this.users.find((user) => user.id === id);
    if (!existingUser) throw new ResourceNotFoundException(`Usuário ${id} não encontrado`);
    Object.assign(existingUser, changes, { updatedAt: new Date() });
    return existingUser;
  }

  async findById(id: number): Promise<User | null> {
    return this.users.find((user) => user.id === id) ?? null;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email) ?? null;
  }

  async findByCpf(cpf: string): Promise<User | null> {
    return this.users.find((user) => user.cpf === cpf) ?? null;
  }
}
