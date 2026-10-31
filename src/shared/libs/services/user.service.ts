import { inject, injectable } from 'inversify';

import { Component } from '../../types/index.js';
import { UserDocument, UserEntity } from '../models/index.js';
import { UserRepository } from '../repositories/index.js';
import { UserService } from './user-service.interface.js';

@injectable()
export class DefaultUserService implements UserService {
  constructor(
    @inject(Component.UserRepository)
    private readonly userRepository: UserRepository,
  ) { }

  public async findById(id: string): Promise<UserDocument | null> {
    return this.userRepository.findById(id) as Promise<UserDocument | null>;
  }

  public async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userRepository.findByEmail(email) as Promise<UserDocument | null>;
  }

  public async create(user: UserEntity): Promise<UserDocument> {
    return this.userRepository.create(user) as Promise<UserDocument>;
  }

  public async findOrCreate(user: UserEntity): Promise<UserDocument> {
    const existingUser = await this.userRepository.findByEmail(user.email);

    if (existingUser) {
      return existingUser;
    }

    return this.userRepository.create(user) as Promise<UserDocument>;
  }
}
