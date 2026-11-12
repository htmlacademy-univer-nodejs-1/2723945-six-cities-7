import {
  getModelForClass,
  modelOptions,
  prop,
  Ref,
} from '@typegoose/typegoose';

import {
  GOODS_VALUES,
  HOUSING_TYPES,
  Goods,
  HousingType,
} from '../../../../types/offer.type.js';
import { City } from '../../../../types/city.type.js';
import { UserEntity } from '../user/user.entity.js';

class LocationEntity {
  @prop({ required: true })
  public latitude!: number;

  @prop({ required: true })
  public longitude!: number;
}

@modelOptions({
  schemaOptions: {
    _id: false,
  },
})
class LocationSchema extends LocationEntity { }

@modelOptions({
  schemaOptions: {
    collection: 'offers',
    timestamps: true,
  },
})
export class OfferEntity {
  @prop({ required: true })
  public name!: string;

  @prop({ required: true })
  public description!: string;

  @prop({ required: true })
  public publicationDate!: Date;

  @prop({
    required: true,
    enum: ['Paris', 'Cologne', 'Brussels', 'Amsterdam', 'Hamburg', 'Dusseldorf'],
  })
  public city!: City;

  @prop({ required: true })
  public previewImage!: string;

  @prop({ required: true, type: () => [String] })
  public photos!: string[];

  @prop({ required: true, default: false })
  public isPremium!: boolean;

  @prop({ required: true, default: false })
  public isFavorite!: boolean;

  @prop({ required: true })
  public rating!: number;

  @prop({ required: true, enum: HOUSING_TYPES })
  public housingType!: HousingType;

  @prop({ required: true })
  public bedrooms!: number;

  @prop({ required: true })
  public maxAdults!: number;

  @prop({ required: true })
  public price!: number;

  @prop({ required: true, type: () => [String], enum: GOODS_VALUES })
  public goods!: Goods[];

  @prop({ required: true, ref: () => UserEntity })
  public author!: Ref<UserEntity>;

  @prop({ required: true, default: 0 })
  public commentsCount!: number;

  @prop({ required: true, type: () => LocationSchema })
  public location!: LocationEntity;
}

export const OfferModel = getModelForClass(OfferEntity);
