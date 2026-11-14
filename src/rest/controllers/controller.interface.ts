import { Route } from './route.interface.js';

export interface Controller {
  configureRoutes(): Route[];
}
