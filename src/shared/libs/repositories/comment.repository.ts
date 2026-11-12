import { Model } from 'mongoose';
import { injectable } from 'inversify';

import { CommentEntity, CommentModel } from '../models/index.js';
import { MongoRepository } from './mongo.repository.js';

@injectable()
export class CommentRepository extends MongoRepository<CommentEntity> {
  constructor() {
    super(CommentModel as unknown as Model<CommentEntity>);
  }

  public async findByOfferId(offerId: string): Promise<CommentEntity[]> {
    return this.model.find({ offer: offerId }).exec() as Promise<CommentEntity[]>;
  }
}
