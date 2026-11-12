import {
  Goods,
  HousingType,
} from '../../../../types/offer.type.js';
import { City } from '../../../../types/city.type.js';
import { Ref } from '@typegoose/typegoose';
import { UserEntity } from '../../models/user/user.entity.js';

export class CreateOfferDto {
  public name!: string;
  public description!: string;
  public publicationDate!: Date;
  public city!: City;
  public previewImage!: string;
  public photos!: string[];
  public isPremium!: boolean;
  public housingType!: HousingType;
  public bedrooms!: number;
  public maxAdults!: number;
  public price!: number;
  public goods!: Goods[];
  public author!: Ref<UserEntity>;
  public location!: {
    latitude: number;
    longitude: number;
  };
}
