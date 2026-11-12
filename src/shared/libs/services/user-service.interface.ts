import { UserDocument, UserEntity } from '../models/index.js';

export interface UserService {
  findById(id: string): Promise<UserDocument | null>;
  findByEmail(email: string): Promise<UserDocument | null>;
  create(user: UserEntity): Promise<UserDocument>;
  findOrCreate(user: UserEntity): Promise<UserDocument>;
}
