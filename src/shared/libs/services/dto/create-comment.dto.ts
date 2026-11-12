import { Ref } from '@typegoose/typegoose';

import { UserEntity } from '../../models/user/user.entity.js';
import { OfferEntity } from '../../models/offer/offer.entity.js';

export class CreateCommentDto {
  public text!: string;
  public rating!: number;
  public author!: Ref<UserEntity>;
  public offer!: Ref<OfferEntity>;
}
