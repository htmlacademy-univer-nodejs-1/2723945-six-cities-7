export const Component = {
  RestApplication: Symbol.for('RestApplication'),
  Logger: Symbol.for('Logger'),
  Config: Symbol.for('Config'),
  DatabaseClient: Symbol.for('DatabaseClient'),
  UserRepository: Symbol.for('UserRepository'),
  OfferRepository: Symbol.for('OfferRepository'),
  UserService: Symbol.for('UserService'),
  OfferService: Symbol.for('OfferService'),
} as const;
