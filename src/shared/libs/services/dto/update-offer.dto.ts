import {
  Goods,
  HousingType,
} from '../../../../types/offer.type.js';
import { City } from '../../../../types/city.type.js';

export class UpdateOfferDto {
  public name?: string;
  public description?: string;
  public city?: City;
  public previewImage?: string;
  public photos?: string[];
  public isPremium?: boolean;
  public housingType?: HousingType;
  public bedrooms?: number;
  public maxAdults?: number;
  public price?: number;
  public goods?: Goods[];
  public location?: {
    latitude: number;
    longitude: number;
  };
}
