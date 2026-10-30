import { inject, injectable } from 'inversify';
import { Logger } from '../shared/libs/logger/index.js';
import { Config, RestSchema } from '../shared/libs/config/index.js';
import { Component } from '../shared/types/index.js';
import { DatabaseClient } from '../shared/libs/database-client/index.js';
import { getMongoURI } from '../shared/helpers/index.js';

@injectable()
export class RestApplication {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.DatabaseClient) private readonly databaseClient: DatabaseClient,
  ) {}

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
    this.logger.info(`Server is going to listen on ${this.config.get('port')}`);

    this.logger.info('Initializing database...');
    await this.initDb();
    this.logger.info('Database initialization completed');
  }
}
