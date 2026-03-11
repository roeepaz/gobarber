import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { getRepository } from 'typeorm';

import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';

interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
  role: 'admin' | 'user';
}

export default async function ensureAdmin(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = request.headers.authorization;

  if (!authHeader) throw new AppError('JWT token is missing', 401);

  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, authConfig.jwt.secret);

    const { sub } = decoded as ITokenPayload;

    // Verify user exists and role from database (not just JWT)
    const usersRepository = getRepository(User);
    const user = await usersRepository.findOne(sub);

    if (!user) {
      throw new AppError('User not found', 401);
    }

    if (user.role !== 'admin') {
      throw new AppError('Admin access required', 403);
    }

    request.user = {
      id: sub,
    };

    return next();
  } catch (err) {
    if (err instanceof AppError) {
      throw err;
    }
    throw new AppError('Invalid JWT token', 401);
  }
}
