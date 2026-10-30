import { Container } from 'inversify';
import { Component } from '../shared/types/index.js';
import { PinoLogger } from '../shared/libs/logger/index.js';
import { RestConfig } from '../shared/libs/config/index.js';
import { RestApplication } from './rest-application.js';

const restContainer = new Container();

restContainer.bind(Component.Logger).to(PinoLogger).inSingletonScope();
restContainer.bind(Component.Config).to(RestConfig).inSingletonScope();
restContainer.bind(Component.RestApplication).to(RestApplication).inSingletonScope();

export { restContainer };
