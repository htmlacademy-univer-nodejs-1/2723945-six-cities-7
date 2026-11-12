import { Model } from 'mongoose';
import { injectable } from 'inversify';
import { UserEntity, UserDocument, UserModel } from '../models/index.js';
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
}
