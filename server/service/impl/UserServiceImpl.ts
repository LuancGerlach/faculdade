import type { UserService } from '../UserService.js';
import type { UserRepository } from '../../repository/UserRepository.js';
import type { CreateUserRequestDto, LoginRequestDto, UpdateUserRequestDto } from '../../dto/user/UserRequestDto.js';
import type { UserResponseDto } from '../../dto/user/UserResponseDto.js';
import { UserMapper } from '../../mapper/UserMapper.js';
import { PasswordEncoderUtils } from '../../utils/PasswordEncoderUtils.js';
import { ConflictException } from '../../exception/ConflictException.js';
import { ResourceNotFoundException } from '../../exception/ResourceNotFoundException.js';
import { UnauthorizedException } from '../../exception/UnauthorizedException.js';

export class UserServiceImpl implements UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(userRequest: CreateUserRequestDto): Promise<UserResponseDto> {
    await this.ensureEmailIsAvailable(userRequest.email);
    await this.ensureCpfIsAvailable(userRequest.cpf);

    const passwordHash = await PasswordEncoderUtils.encode(userRequest.password);
    const savedUser = await this.userRepository.save({
      name: userRequest.name,
      email: userRequest.email,
      cpf: userRequest.cpf,
      passwordHash,
    });

    return UserMapper.toDto(savedUser);
  }

  async update(id: number, userRequest: UpdateUserRequestDto): Promise<UserResponseDto> {
    await this.findUserOrThrow(id);
    await this.ensureEmailIsAvailable(userRequest.email, id);

    const updatedUser = await this.userRepository.update(id, userRequest);
    return UserMapper.toDto(updatedUser);
  }

  async findById(id: number): Promise<UserResponseDto> {
    return UserMapper.toDto(await this.findUserOrThrow(id));
  }

  async login(loginRequest: LoginRequestDto): Promise<UserResponseDto> {
    const invalidCredentialsMessage = 'E-mail ou senha inválidos';
    const foundUser = await this.userRepository.findByEmail(loginRequest.email);
    if (!foundUser) throw new UnauthorizedException(invalidCredentialsMessage);

    const passwordMatches = await PasswordEncoderUtils.matches(loginRequest.password, foundUser.passwordHash);
    if (!passwordMatches) throw new UnauthorizedException(invalidCredentialsMessage);

    return UserMapper.toDto(foundUser);
  }

  private async findUserOrThrow(id: number) {
    const foundUser = await this.userRepository.findById(id);
    if (!foundUser) throw new ResourceNotFoundException(`Usuário ${id} não encontrado`);
    return foundUser;
  }

  private async ensureEmailIsAvailable(email: string, currentUserId?: number) {
    const userWithEmail = await this.userRepository.findByEmail(email);
    if (userWithEmail && userWithEmail.id !== currentUserId) {
      throw new ConflictException('E-mail já cadastrado');
    }
  }

  private async ensureCpfIsAvailable(cpf: string) {
    const userWithCpf = await this.userRepository.findByCpf(cpf);
    if (userWithCpf) {
      throw new ConflictException('CPF já cadastrado');
    }
  }
}
