import { inject, injectable } from 'inversify';

import { Component } from '../../types/index.js';
import { OfferEntity } from '../models/index.js';
import { OfferRepository } from '../repositories/index.js';

@injectable()
export class DefaultOfferService {
  constructor(
    @inject(Component.OfferRepository)
    private readonly offerRepository: OfferRepository,
  ) {}

  public async create(offer: OfferEntity): Promise<OfferEntity> {
    return this.offerRepository.create(offer);
  }
}
