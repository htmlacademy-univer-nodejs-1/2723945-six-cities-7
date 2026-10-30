import type { City } from './city.type.js';
import type { User } from './user.type.js';
import type { Location } from './location.type.js';

export type HousingType = 'apartment' | 'house' | 'room' | 'hotel';
export type Goods =
  | 'Breakfast'
  | 'Air conditioning'
  | 'Laptop friendly workspace'
  | 'Baby seat'
  | 'Washer'
  | 'Towels'
  | 'Fridge';

export const HOUSING_TYPES: HousingType[] = ['apartment', 'house', 'room', 'hotel'];
export const GOODS_VALUES: Goods[] = [
  'Breakfast',
  'Air conditioning',
  'Laptop friendly workspace',
  'Baby seat',
  'Washer',
  'Towels',
  'Fridge',
];

export interface Offer {
  name: string;
  description: string;
  publicationDate: string;
  city: City;
  previewImage: string;
  photos: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  housingType: HousingType;
  bedrooms: number;
  maxAdults: number;
  price: number;
  goods: Goods[];
  author: User;
  commentsCount: number;
  location: Location;
}
