import { beforeEach, describe, expect, it } from 'vitest';
import { UserServiceImpl } from '../service/impl/UserServiceImpl.js';
import { InMemoryUserRepository } from '../repository/impl/memory/InMemoryUserRepository.js';
import { ConflictException } from '../exception/ConflictException.js';
import { ResourceNotFoundException } from '../exception/ResourceNotFoundException.js';
import { UnauthorizedException } from '../exception/UnauthorizedException.js';

const userRequest = {
  name: 'João Silva',
  email: 'joao@email.com',
  cpf: '52998224725',
  password: 'senha1234',
  confirmPassword: 'senha1234',
  acceptedTerms: true as const,
};

describe('UserServiceImpl', () => {
  let userService: UserServiceImpl;

  beforeEach(() => {
    userService = new UserServiceImpl(new InMemoryUserRepository());
  });

  it('cria usuário sem expor senha e com CPF mascarado', async () => {
    const createdUser = await userService.create(userRequest);
    expect(createdUser).not.toHaveProperty('passwordHash');
    expect(createdUser.cpf).toBe('529.***.***-25');
  });

  it('bloqueia e-mail e CPF duplicados', async () => {
    await userService.create(userRequest);
    await expect(userService.create(userRequest)).rejects.toThrow(ConflictException);
    await expect(userService.create({ ...userRequest, email: 'outro@email.com' })).rejects.toThrow('CPF já cadastrado');
  });

  it('atualiza nome e e-mail', async () => {
    const createdUser = await userService.create(userRequest);
    const updatedUser = await userService.update(createdUser.id, { name: 'João S.', email: 'novo@email.com' });
    expect(updatedUser).toMatchObject({ name: 'João S.', email: 'novo@email.com' });
  });

  it('falha ao atualizar usuário inexistente', async () => {
    await expect(userService.update(99, { name: 'Ninguém', email: 'x@email.com' })).rejects.toThrow(ResourceNotFoundException);
  });

  it('autentica com senha correta e rejeita senha errada', async () => {
    await userService.create(userRequest);
    await expect(userService.login({ email: 'joao@email.com', password: 'senha1234' })).resolves.toMatchObject({ name: 'João Silva' });
    await expect(userService.login({ email: 'joao@email.com', password: 'errada123' })).rejects.toThrow(UnauthorizedException);
  });
});
