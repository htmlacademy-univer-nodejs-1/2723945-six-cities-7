import { inject, injectable } from 'inversify';

import { Component } from '../../types/index.js';
import { OfferEntity, UserDocument } from '../models/index.js';
import { UserRepository } from '../repositories/index.js';
import { UserService } from './user-service.interface.js';
import { CreateUserDto } from './dto/index.js';
import { createSHA256 } from '../../helpers/index.js';

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

  public async findByEmailWithPassword(email: string): Promise<UserDocument | null> {
    return this.userRepository.findByEmailWithPassword(email);
  }

  public async create(user: CreateUserDto): Promise<UserDocument> {
    return this.userRepository.create(user) as Promise<UserDocument>;
  }

  public async findOrCreate(user: CreateUserDto): Promise<UserDocument> {
    const existingUser = await this.userRepository.findByEmail(user.email);

    if (existingUser) {
      return existingUser;
    }

    return this.userRepository.create(user) as Promise<UserDocument>;
  }

  public async addToFavorites(userId: string, offerId: string): Promise<UserDocument | null> {
    return this.userRepository.addToFavorites(userId, offerId);
  }

  public async removeFromFavorites(userId: string, offerId: string): Promise<UserDocument | null> {
    return this.userRepository.removeFromFavorites(userId, offerId);
  }

  public async findFavoriteOffers(userId: string): Promise<OfferEntity[]> {
    return this.userRepository.findFavoriteOffers(userId);
  }

  public async verifyUser(email: string, password: string, salt: string): Promise<UserDocument | null> {
    const user = await this.userRepository.findByEmailWithPassword(email);

    if (!user) {
      return null;
    }

    const passwordHash = createSHA256(password, salt);

    if (user.password !== passwordHash) {
      return null;
    }

    return user;
  }
}
