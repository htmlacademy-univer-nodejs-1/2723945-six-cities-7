import {
  getModelForClass,
  modelOptions,
  prop,
  Ref,
} from '@typegoose/typegoose';

import { UserEntity } from '../user/user.entity.js';
import { OfferEntity } from '../offer/offer.entity.js';

@modelOptions({
  schemaOptions: {
    collection: 'comments',
    timestamps: true,
  },
})
export class CommentEntity {
  @prop({ required: true })
  public text!: string;

  @prop({ required: true })
  public rating!: number;

  @prop({ required: true, ref: () => UserEntity })
  public author!: Ref<UserEntity>;

  @prop({ required: true, ref: () => OfferEntity })
  public offer!: Ref<OfferEntity>;
}

export const CommentModel = getModelForClass(CommentEntity);
