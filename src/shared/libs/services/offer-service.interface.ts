import { OfferEntity } from '../models/index.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { City } from '../../../types/city.type.js';

export interface OfferService {
  create(offer: CreateOfferDto): Promise<OfferEntity>;
  update(id: string, offer: UpdateOfferDto): Promise<OfferEntity | null>;
  findById(id: string): Promise<OfferEntity | null>;
  findAll(count?: number): Promise<OfferEntity[]>;
  delete(id: string): Promise<OfferEntity | null>;
  findPremiumByCity(city: City): Promise<OfferEntity[]>;
}
