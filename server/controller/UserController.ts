import type { Request, Response } from 'express';
import type { UserService } from '../service/UserService.js';
import type { CreateUserRequestDto, LoginRequestDto, UpdateUserRequestDto } from '../dto/user/UserRequestDto.js';
import { parseIdParam } from './pathParams.js';

// Equivalente ao @RestController @RequestMapping("/api/users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  create = async (request: Request, response: Response) => {
    const createdUser = await this.userService.create(request.body as CreateUserRequestDto);
    response.status(201).location(`/api/users/${createdUser.id}`).json(createdUser);
  };

  update = async (request: Request, response: Response) => {
    const userId = parseIdParam(request.params.id);
    const updatedUser = await this.userService.update(userId, request.body as UpdateUserRequestDto);
    response.status(200).json(updatedUser);
  };

  findById = async (request: Request, response: Response) => {
    const userId = parseIdParam(request.params.id);
    response.status(200).json(await this.userService.findById(userId));
  };

  login = async (request: Request, response: Response) => {
    const authenticatedUser = await this.userService.login(request.body as LoginRequestDto);
    response.status(200).json(authenticatedUser);
  };
}
