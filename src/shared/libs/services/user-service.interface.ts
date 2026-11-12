import { OfferEntity, UserDocument } from '../models/index.js';
import { CreateUserDto } from './dto/index.js';

export interface UserService {
  findById(id: string): Promise<UserDocument | null>;
  findByEmail(email: string): Promise<UserDocument | null>;
  create(user: CreateUserDto): Promise<UserDocument>;
  findOrCreate(user: CreateUserDto): Promise<UserDocument>;
  addToFavorites(userId: string, offerId: string): Promise<UserDocument | null>;
  removeFromFavorites(userId: string, offerId: string): Promise<UserDocument | null>;
  findFavoriteOffers(userId: string): Promise<OfferEntity[]>;
}
