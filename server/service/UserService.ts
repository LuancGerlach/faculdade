import type { CreateUserRequestDto, LoginRequestDto, UpdateUserRequestDto } from '../dto/user/UserRequestDto.js';
import type { UserResponseDto } from '../dto/user/UserResponseDto.js';

export interface UserService {
  create(userRequest: CreateUserRequestDto): Promise<UserResponseDto>;
  update(id: number, userRequest: UpdateUserRequestDto): Promise<UserResponseDto>;
  findById(id: number): Promise<UserResponseDto>;
  login(loginRequest: LoginRequestDto): Promise<UserResponseDto>;
}
