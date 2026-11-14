import { Expose, Type } from 'class-transformer';
import { OfferPreviewRdo } from './offer-preview.dto.js';

class LocationRdo {
  @Expose()
  public latitude!: number;

  @Expose()
  public longitude!: number;
}

export class OfferRdo extends OfferPreviewRdo {
  @Expose()
  public description!: string;

  @Expose()
  public photos!: string[];

  @Expose()
  public bedrooms!: number;

  @Expose()
  public maxAdults!: number;

  @Expose()
  public goods!: string[];

  @Expose()
  public author!: string;

  @Expose()
  @Type(() => LocationRdo)
  public location!: LocationRdo;
}
