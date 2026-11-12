import { getModelForClass, prop, modelOptions } from '@typegoose/typegoose';
import { USER_TYPES, UserType } from '../../../../types/user.type.js';
import { Types } from 'mongoose';
import { Ref } from '@typegoose/typegoose';
import { OfferEntity } from '../offer/offer.entity.js';

@modelOptions({
  schemaOptions: {
    collection: 'users',
    timestamps: true,
  },
})
export class UserEntity {
  @prop({ required: true })
  public name!: string;

  @prop({ required: true, unique: true })
  public email!: string;

  @prop()
  public avatarUrl?: string;

  @prop({ required: true, enum: USER_TYPES })
  public type!: UserType;

  @prop({ required: true, select: false })
  public password!: string;

  @prop({ ref: () => OfferEntity, default: [] })
  public favoriteOffers?: Ref<OfferEntity>[];
}

export const UserModel = getModelForClass(UserEntity);
export type UserDocument = UserEntity & { _id: Types.ObjectId };
