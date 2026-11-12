import { Container } from 'inversify';
import { Component } from '../shared/types/index.js';
import { PinoLogger } from '../shared/libs/logger/index.js';
import { RestConfig } from '../shared/libs/config/index.js';
import { RestApplication } from './rest-application.js';
import { MongoDatabaseClient } from '../shared/libs/database-client/index.js';
import { UserRepository, OfferRepository } from '../shared/libs/repositories/index.js';
import { DefaultUserService } from '../shared/libs/services/index.js';
import { DefaultOfferService } from '../shared/libs/services/index.js';

const restContainer = new Container();

restContainer.bind(Component.Logger).to(PinoLogger).inSingletonScope();
restContainer.bind(Component.Config).to(RestConfig).inSingletonScope();
restContainer.bind(Component.DatabaseClient).to(MongoDatabaseClient).inSingletonScope();
restContainer.bind(Component.RestApplication).to(RestApplication).inSingletonScope();
restContainer.bind(Component.UserRepository).to(UserRepository).inSingletonScope();
restContainer.bind(Component.OfferRepository).to(OfferRepository).inSingletonScope();
restContainer.bind(Component.UserService).to(DefaultUserService).inSingletonScope();
restContainer.bind(Component.OfferService).to(DefaultOfferService).inSingletonScope();
export { restContainer };
