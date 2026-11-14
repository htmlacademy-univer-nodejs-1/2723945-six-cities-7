import { Expose, Transform } from 'class-transformer';

export class OfferPreviewRdo {
  @Expose()
  @Transform(({ obj }) => obj._id.toString(), { toClassOnly: true })
  public id!: string;

  @Expose()
  public price!: number;

  @Expose()
  public name!: string;

  @Expose()
  public housingType!: string;

  @Expose()
  @Transform(() => false)
  public isFavorite!: boolean;

  @Expose()
  public publicationDate!: Date;

  @Expose()
  public city!: string;

  @Expose()
  public previewImage!: string;

  @Expose()
  public isPremium!: boolean;

  @Expose()
  public rating!: number;

  @Expose()
  public commentsCount!: number;
}
