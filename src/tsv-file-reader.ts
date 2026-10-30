import { createReadStream } from 'node:fs';
import { resolve } from 'node:path';
import { createInterface } from 'node:readline';

import type { Goods, HousingType, Offer } from './types/offer.type.js';
import type { User } from './types/user.type.js';
import type { Location } from './types/location.type.js';

const EXPECTED_HEADER = [
  'name',
  'description',
  'publicationDate',
  'city',
  'previewImage',
  'photos',
  'isPremium',
  'isFavorite',
  'rating',
  'housingType',
  'bedrooms',
  'maxAdults',
  'price',
  'goods',
  'author',
  'commentsCount',
  'location',
] as const;

function toBoolean(value: string): boolean {
  const normalizedValue = value.trim().toLowerCase();

  if (normalizedValue === 'true') {
    return true;
  }

  if (normalizedValue === 'false') {
    return false;
  }

  throw new Error(`Некорректное значение boolean: ${value}`);
}

function toNumber(value: string): number {
  const numberValue = Number(value);

  if (value.trim() === '' || !Number.isFinite(numberValue)) {
    throw new Error(`Некорректное значение числа: ${value}`);
  }

  return numberValue;
}

function toStringArray(value: string): string[] {
  return value.split('|').map((item) => item.trim()).filter(Boolean);
}

function toGoods(value: string): Goods[] {
  return toStringArray(value) as Goods[];
}

function toAuthor(value: string): User {
  const parts = value.split('|');

  if (parts.length !== 4) {
    throw new Error(`Некорректный формат поля author: ${value}`);
  }

  const [name, email, avatarUrl, type] = parts.map((item) => item.trim());

  return {
    name,
    email,
    avatarUrl,
    type: type.toLowerCase() as User['type'],
  };
}

function toLocation(value: string): Location {
  const parts = value.split('|').map((item) => item.trim());

  if (parts.length !== 2) {
    throw new Error(`Некорректный формат поля location: ${value}`);
  }

  return {
    latitude: toNumber(parts[0]),
    longitude: toNumber(parts[1]),
  };
}

function parseOffer(row: string[], lineNumber: number): Offer {
  if (row.length !== EXPECTED_HEADER.length) {
    throw new Error(`Количество колонок не совпадает с заголовком на строке ${lineNumber}.`);
  }

  const raw = Object.fromEntries(
    EXPECTED_HEADER.map((key, index) => [key, row[index]?.trim() ?? ''])
  ) as Record<string, string>;

  return {
    name: raw.name,
    description: raw.description,
    publicationDate: raw.publicationDate,
    city: raw.city as Offer['city'],
    previewImage: raw.previewImage,
    photos: toStringArray(raw.photos),
    isPremium: toBoolean(raw.isPremium),
    isFavorite: toBoolean(raw.isFavorite),
    rating: toNumber(raw.rating),
    housingType: raw.housingType as HousingType,
    bedrooms: toNumber(raw.bedrooms),
    maxAdults: toNumber(raw.maxAdults),
    price: toNumber(raw.price),
    goods: toGoods(raw.goods),
    author: toAuthor(raw.author),
    commentsCount: toNumber(raw.commentsCount),
    location: toLocation(raw.location),
  };
}

export function offerToTsv(offer: Offer): string {
  return [
    offer.name,
    offer.description,
    offer.publicationDate,
    offer.city,
    offer.previewImage,
    offer.photos.join('|'),
    String(offer.isPremium),
    String(offer.isFavorite),
    String(offer.rating),
    offer.housingType,
    String(offer.bedrooms),
    String(offer.maxAdults),
    String(offer.price),
    offer.goods.join('|'),
    [offer.author.name, offer.author.email, offer.author.avatarUrl, offer.author.type].join('|'),
    String(offer.commentsCount),
    [offer.location.latitude, offer.location.longitude].join('|'),
  ].join('\t');
}

export const OFFERS_TSV_HEADER = EXPECTED_HEADER.join('\t');

export async function readOffersFromFileStream(
  filePath: string,
  onOffer: (offer: Offer) => void,
): Promise<number> {
  const absolutePath = resolve(filePath);
  const input = createReadStream(absolutePath, { encoding: 'utf-8' });
  const lines = createInterface({ input, crlfDelay: Infinity });
  let lineNumber = 0;
  let offerCount = 0;

  for await (const line of lines) {
    lineNumber += 1;

    if (lineNumber === 1) {
      const header = line.split('\t').map((item) => item.trim());

      if (
        header.length !== EXPECTED_HEADER.length ||
        !EXPECTED_HEADER.every((item, index) => header[index] === item)
      ) {
        throw new Error('Заголовок TSV-файла не соответствует ожидаемому формату.');
      }

      continue;
    }

    if (!line.trim()) {
      continue;
    }

    onOffer(parseOffer(line.split('\t'), lineNumber));
    offerCount += 1;
  }

  if (lineNumber === 0) {
    throw new Error('TSV-файл пустой.');
  }

  if (offerCount === 0) {
    throw new Error('В TSV-файле отсутствуют строки данных.');
  }

  return offerCount;
}
