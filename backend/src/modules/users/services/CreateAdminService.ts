import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

import User from '../infra/typeorm/entities/User';

interface IRequest {
  name: string;
  email: string;
  password: string;
  currentUserRole?: 'admin' | 'user';
}

@injectable()
class CreateAdminService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    name,
    email,
    password,
    currentUserRole,
  }: IRequest): Promise<User> {
    // Check if an admin already exists
    const adminExists = await this.usersRepository.findAdmin();

    // If an admin exists, require the current user to be an admin
    if (adminExists && currentUserRole !== 'admin') {
      throw new AppError('Only admins can create new admin accounts', 403);
    }

    const checkUserExists = await this.usersRepository.findByEmail(email);

    if (checkUserExists) {
      throw new AppError('Email address already used');
    }

    const hashedPassword = await this.hashProvider.generateHash(password);

    const user = await this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    // Set the user as admin
    user.role = 'admin';
    await this.usersRepository.save(user);

    return user;
  }
}

export default CreateAdminService;
