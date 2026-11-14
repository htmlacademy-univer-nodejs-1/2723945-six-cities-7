import { inject, injectable } from 'inversify';
import { Logger } from '../shared/libs/logger/index.js';
import { Config, RestSchema } from '../shared/libs/config/index.js';
import { Component } from '../shared/types/index.js';
import { DatabaseClient } from '../shared/libs/database-client/index.js';
import { getMongoURI } from '../shared/helpers/index.js';
import express, { Express } from 'express';
import { ExceptionFilter } from './filters/exception-filter.interface.js';
import { OfferController } from './controllers/offer.controller.js';
import { UserController } from './controllers/user.controller.js';
import { FavoriteController } from './controllers/favorite.controller.js';

@injectable()
export class RestApplication {
  private readonly app: Express = express();

  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.DatabaseClient) private readonly databaseClient: DatabaseClient,
    @inject(Component.ExceptionFilter) private readonly exceptionFilter: ExceptionFilter,
    @inject(Component.OfferController) private readonly offerController: OfferController,
    @inject(Component.UserController) private readonly userController: UserController,
    @inject(Component.FavoriteController) private readonly favoriteController: FavoriteController,
  ) { }

  private registerMiddleware(): void {
    this.app.use(express.json());
  }

  private registerExceptionFilter(): void {
    this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
  }

  private registerRoutes(): void {
    this.app.use('/offers', this.offerController.getRouter());
    this.app.use(this.offerController.getPremiumRouter());
    this.app.use('/users', this.userController.getRouter());
    this.app.use('/', this.favoriteController.getRouter());
  }

  private async initDb(): Promise<void> {
    const mongoUri = getMongoURI(
      this.config.get('dbUser'),
      this.config.get('dbPassword'),
      this.config.get('dbHost'),
      this.config.get('dbPort'),
      this.config.get('dbName'),
    );

    await this.databaseClient.connect(mongoUri);
  }

  public async init(): Promise<void> {
    this.logger.info('Application initialized');

    this.registerMiddleware();
    this.registerRoutes();
    this.registerExceptionFilter();

    this.logger.info('Initializing database...');
    await this.initDb();
    this.logger.info('Database initialization completed');

    const port = this.config.get('port');

    this.app.listen(port, () => {
      this.logger.info(`Server started on port ${port}`);
    });
  }
}
