import type { User } from '../entity/User.js';

export type NewUser = Pick<User, 'name' | 'email' | 'cpf' | 'passwordHash'>;
export type UserChanges = Partial<NewUser>;

export interface UserRepository {
  save(newUser: NewUser): Promise<User>;
  update(id: number, changes: UserChanges): Promise<User>;
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByCpf(cpf: string): Promise<User | null>;
}
