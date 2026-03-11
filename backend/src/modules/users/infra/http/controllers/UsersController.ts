import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';
import { verify } from 'jsonwebtoken';

import authConfig from '@config/auth';
import CreateUserService from '@modules/users/services/CreateUserService';
import CreateAdminService from '@modules/users/services/CreateAdminService';

export default class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;

    const createUser = container.resolve(CreateUserService);

    const user = await createUser.execute({
      name,
      email,
      password,
    });

    return response.json(classToClass(user));
  }

  public async createAdmin(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;

    const createAdmin = container.resolve(CreateAdminService);

    // Extract role from JWT token if present
    let currentUserRole: 'admin' | 'user' | undefined;
    const authHeader = request.headers.authorization;

    if (authHeader) {
      const [, token] = authHeader.split(' ');
      try {
        const decoded = verify(token, authConfig.jwt.secret) as { role: 'admin' | 'user' };
        currentUserRole = decoded.role;
      } catch {
        // Invalid token, will be handled as unauthorized by service if admin exists
      }
    }

    const user = await createAdmin.execute({
      name,
      email,
      password,
      currentUserRole,
    });

    return response.json(classToClass(user));
  }
}
