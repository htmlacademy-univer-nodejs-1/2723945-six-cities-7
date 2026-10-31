import { Model } from 'mongoose';
import { injectable } from 'inversify';
import { OfferEntity, OfferModel } from '../models/index.js';
import { MongoRepository } from './mongo.repository.js';

@injectable()
export class OfferRepository extends MongoRepository<OfferEntity> {
  constructor() {
    super(OfferModel as unknown as Model<OfferEntity>);
  }
}
