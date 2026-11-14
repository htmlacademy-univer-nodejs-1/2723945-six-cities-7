import { Model } from 'mongoose';
import { injectable } from 'inversify';
import { OfferEntity, OfferModel } from '../models/index.js';
import { MongoRepository } from './mongo.repository.js';
import { City } from '../../../types/city.type.js';

@injectable()
export class OfferRepository extends MongoRepository<OfferEntity> {
  constructor() {
    super(OfferModel as unknown as Model<OfferEntity>);
  }

  public async findPremiumByCity(city: City): Promise<OfferEntity[]> {
    return this.model
      .find({ city, isPremium: true })
      .sort({ publicationDate: -1 })
      .limit(3)
      .exec();
  }

  public async findAll(count = 60): Promise<OfferEntity[]> {
    return this.model
      .find()
      .sort({ publicationDate: -1 })
      .limit(count)
      .exec();
  }
}
