import { Model } from 'mongoose';
import { injectable } from 'inversify';
import { OfferEntity, UserEntity, UserDocument, UserModel } from '../models/index.js';
import { MongoRepository } from './mongo.repository.js';

@injectable()
export class UserRepository extends MongoRepository<UserEntity> {
  constructor() {
    super(UserModel as unknown as Model<UserEntity>);
  }

  public async findById(id: string): Promise<UserDocument | null> {
    return this.model.findById(id).exec() as Promise<UserDocument | null>;
  }

  public async findByEmail(email: string): Promise<UserDocument | null> {
    return this.model.findOne({ email }).exec() as Promise<UserDocument | null>;
  }

  public async addToFavorites(userId: string, offerId: string): Promise<UserDocument | null> {
    return this.model.findByIdAndUpdate(
      userId,
      { $addToSet: { favoriteOffers: offerId } },
      { new: true },
    ).exec() as Promise<UserDocument | null>;
  }

  public async removeFromFavorites(userId: string, offerId: string): Promise<UserDocument | null> {
    return this.model.findByIdAndUpdate(
      userId,
      { $pull: { favoriteOffers: offerId } },
      { new: true },
    ).exec() as Promise<UserDocument | null>;
  }

  public async findFavoriteOffers(userId: string): Promise<OfferEntity[]> {
    const user = await this.model
      .findById(userId)
      .populate('favoriteOffers')
      .exec();

    return user?.favoriteOffers as OfferEntity[] ?? [];
  }
}
