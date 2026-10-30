
import 'reflect-metadata';
import { Component } from './shared/types/index.js';
import { RestApplication } from './rest/rest-application.js';
import { restContainer } from './rest/rest-container.js';

const application = restContainer.get<RestApplication>(
  Component.RestApplication
);

application.init();

