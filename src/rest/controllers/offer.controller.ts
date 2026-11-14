import { Types } from 'mongoose';
import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';
import { Component } from '../../shared/types/index.js';
import { Logger } from '../../shared/libs/logger/index.js';
import { OfferService } from '../../shared/libs/services/index.js';
import { Controller } from './controller.js';
import { Route } from './route.interface.js';
import { CreateOfferRequest } from './dto/create-offer.request.js';
import { CreateOfferDto } from '../../shared/libs/services/dto/create-offer.dto.js';
import { UpdateOfferDto } from '../../shared/libs/services/dto/update-offer.dto.js';
import { HttpError } from '../filters/http-error.js';
import { City } from '../../types/city.type.js';
import { plainToInstance } from 'class-transformer';
import { OfferPreviewRdo } from './dto/offer-preview.dto.js';
import { OfferRdo } from './dto/offer.rdo.js';

@injectable()
export class OfferController extends Controller {
  private readonly premiumRouter: Router = Router();

  constructor(
    @inject(Component.Logger) logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {
    super(logger);
  }

  public getPremiumRouter(): Router {
    this.premiumRouter.get(
      '/cities/:city/premium-offers',
      asyncHandler(async (req, res) => {
        const city = req.params.city;

        const offers = await this.offerService.findPremiumByCity(
          city as City,
        );

        const offersPreview = plainToInstance(
          OfferPreviewRdo,
          offers,
          { excludeExtraneousValues: true },
        );

        this.ok(res, offersPreview);
      }),
    );

    return this.premiumRouter;
  }

  public configureRoutes(): Route[] {
    return [
      {
        path: '/',
        method: 'get',
        handler: async (req, res) => {
          const count = req.query.count
            ? Number(req.query.count)
            : undefined;

          const offers = await this.offerService.findAll(count);

          const offersPreview = plainToInstance(
            OfferPreviewRdo,
            offers,
            { excludeExtraneousValues: true },
          );

          this.ok(res, offersPreview);
        },
      },
      {
        path: '/',
        method: 'post',
        handler: async (req, res) => {
          const offerData = req.body as CreateOfferRequest;

          const offerDto: CreateOfferDto = {
            ...offerData,
            author: new Types.ObjectId('6af7593029dff35ac5336c82'),
          };

          const offer = await this.offerService.create(offerDto);

          const offerRdo = plainToInstance(
            OfferRdo,
            offer,
            { excludeExtraneousValues: true },
          );

          this.created(res, offerRdo);
        },
      },
      {
        path: '/:offerId',
        method: 'get',
        handler: async (req, res) => {
          const offerId = Array.isArray(req.params.offerId)
            ? req.params.offerId[0]
            : req.params.offerId;

          const offer = await this.offerService.findById(offerId);

          if (!offer) {
            throw new HttpError(
              StatusCodes.NOT_FOUND,
              `Offer with id ${offerId} not found`,
            );
          }

          const offerRdo = plainToInstance(
            OfferRdo,
            offer,
            { excludeExtraneousValues: true },
          );

          this.ok(res, offerRdo);
        },
      },
      {
        path: '/:offerId',
        method: 'patch',
        handler: async (req, res) => {
          const offerId = Array.isArray(req.params.offerId)
            ? req.params.offerId[0]
            : req.params.offerId;

          const offerData = req.body as UpdateOfferDto;

          const updatedOffer = await this.offerService.update(
            offerId,
            offerData,
          );

          if (!updatedOffer) {
            throw new HttpError(
              StatusCodes.NOT_FOUND,
              `Offer with id ${offerId} not found`,
            );
          }

          const offerRdo = plainToInstance(
            OfferRdo,
            updatedOffer,
            { excludeExtraneousValues: true },
          );

          this.ok(res, offerRdo);
        },
      },
      {
        path: '/:offerId',
        method: 'delete',
        handler: async (req, res) => {
          const offerId = Array.isArray(req.params.offerId)
            ? req.params.offerId[0]
            : req.params.offerId;

          const deletedOffer = await this.offerService.delete(offerId);

          if (!deletedOffer) {
            throw new HttpError(
              StatusCodes.NOT_FOUND,
              `Offer with id ${offerId} not found`,
            );
          }

          this.noContent(res);
        },
      },
    ];
  }
}
