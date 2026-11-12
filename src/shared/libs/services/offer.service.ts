import { inject, injectable } from 'inversify';

import { Component } from '../../types/index.js';
import { OfferEntity } from '../models/index.js';
import { OfferRepository } from '../repositories/index.js';
import { OfferService } from './offer-service.interface.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { City } from '../../../types/city.type.js';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.OfferRepository)
    private readonly offerRepository: OfferRepository,
  ) { }

  public async create(offer: CreateOfferDto): Promise<OfferEntity> {
    return this.offerRepository.create({
      ...offer,
      rating: 0,
      commentsCount: 0,
    });
  }

  public async update(id: string, offer: UpdateOfferDto): Promise<OfferEntity | null> {
    return this.offerRepository.update(id, offer);
  }

  public async findById(id: string): Promise<OfferEntity | null> {
    return this.offerRepository.findById(id);
  }

  public async findAll(): Promise<OfferEntity[]> {
    return this.offerRepository.findAll();
  }

  public async delete(id: string): Promise<OfferEntity | null> {
    return this.offerRepository.delete(id);
  }

  public async findPremiumByCity(city: City): Promise<OfferEntity[]> {
    return this.offerRepository.findPremiumByCity(city);
  }
}
