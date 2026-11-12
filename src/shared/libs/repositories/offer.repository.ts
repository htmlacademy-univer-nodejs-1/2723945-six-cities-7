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
    return this.model.find({ city, isPremium: true }).exec();
  }
}
