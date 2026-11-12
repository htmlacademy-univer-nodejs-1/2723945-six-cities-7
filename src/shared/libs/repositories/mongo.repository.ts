import { Model } from 'mongoose';
import { Repository } from './repository.interface.js';

export class MongoRepository<T> implements Repository<T> {
  constructor(
    protected readonly model: Model<T>,
  ) {}

  public async findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  public async create(item: T): Promise<T> {
    return this.model.create(item);
  }
}
