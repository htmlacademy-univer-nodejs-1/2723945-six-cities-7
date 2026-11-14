import {Goods,HousingType,} from '../../../types/offer.type.js';
import { City } from '../../../types/city.type.js';

export interface CreateOfferRequest {
  name: string;
  description: string;
  publicationDate: Date;
  city: City;
  previewImage: string;
  photos: string[];
  isPremium: boolean;
  housingType: HousingType;
  bedrooms: number;
  maxAdults: number;
  price: number;
  goods: Goods[];
  location: {
    latitude: number;
    longitude: number;
  };
}
