import type { User } from '../entity/User.js';
import type { UserResponseDto } from '../dto/user/UserResponseDto.js';

const maskCpf = (cpf: string) => `${cpf.slice(0, 3)}.***.***-${cpf.slice(9)}`;

export const UserMapper = {
  // Nunca expõe o passwordHash; CPF sai mascarado
  toDto(user: User): UserResponseDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      cpf: maskCpf(user.cpf),
      createdAt: user.createdAt.toISOString(),
    };
  },
};
