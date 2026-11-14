import { inject, injectable } from 'inversify';
import { Component } from '../../shared/types/index.js';
import { Logger } from '../../shared/libs/logger/index.js';
import { UserService } from '../../shared/libs/services/index.js';
import { Controller } from './controller.js';
import { Route } from './route.interface.js';
import { HttpError } from '../filters/http-error.js';
import { StatusCodes } from 'http-status-codes';
import { plainToInstance } from 'class-transformer';
import { OfferPreviewRdo } from './dto/offer-preview.dto.js';

const TEMPORARY_USER_ID = '6af7593029dff35ac5336c82';

@injectable()
export class FavoriteController extends Controller {
  constructor(
    @inject(Component.Logger) logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
  ) {
    super(logger);
  }

  public configureRoutes(): Route[] {
    return [
      {
        path: '/favorites',
        method: 'get',
        handler: async (_req, res) => {
          const offers = await this.userService.findFavoriteOffers(TEMPORARY_USER_ID);

          const offersPreview = plainToInstance(
            OfferPreviewRdo,
            offers,
            { excludeExtraneousValues: true },
          );

          offersPreview.forEach((offer) => {
            offer.isFavorite = true;
          });

          this.ok(res, offersPreview);
        },
      },
      {
        path: '/offers/:offerId/favorite',
        method: 'post',
        handler: async (req, res) => {
          const offerId = req.params.offerId as string;

          const user = await this.userService.addToFavorites(
            TEMPORARY_USER_ID,
            offerId,
          );

          if (!user) {
            throw new HttpError(StatusCodes.NOT_FOUND, 'User or offer not found');
          }

          res.sendStatus(StatusCodes.CREATED);
        },
      },
      {
        path: '/offers/:offerId/favorite',
        method: 'delete',
        handler: async (req, res) => {
          const offerId = req.params.offerId as string;

          const user = await this.userService.removeFromFavorites(
            TEMPORARY_USER_ID,
            offerId,
          );

          if (!user) {
            throw new HttpError(StatusCodes.NOT_FOUND, 'User not found');
          }

          this.noContent(res);
        },
      },
    ];
  }
}
