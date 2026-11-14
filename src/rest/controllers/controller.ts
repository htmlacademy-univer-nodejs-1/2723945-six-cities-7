import asyncHandler from 'express-async-handler';
import { Router, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Logger } from '../../shared/libs/logger/index.js';
import { Controller as IController } from './controller.interface.js';
import { Route } from './route.interface.js';

export abstract class Controller implements IController {
  protected readonly router: Router = Router();

  constructor(protected readonly logger: Logger) { }

  public abstract configureRoutes(): Route[];

  public getRouter(): Router {
    const routes = this.configureRoutes();

    routes.forEach(({ path, method, handler }) => {
      this.router[method](path, asyncHandler(handler));
    });

    return this.router;
  }

  protected ok<T>(res: Response, data: T): void {
    res.status(StatusCodes.OK).json(data);
  }

  protected created<T>(res: Response, data: T): void {
    res.status(StatusCodes.CREATED).json(data);
  }

  protected noContent(res: Response): void {
    res.sendStatus(StatusCodes.NO_CONTENT);
  }
}
