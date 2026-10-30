import { inject, injectable } from 'inversify';
import { Logger } from '../shared/libs/logger/index.js';
import { Config, RestSchema } from '../shared/libs/config/index.js';
import { Component } from '../shared/types/index.js';

@injectable()
export class RestApplication {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
  ) {}

  public async init(): Promise<void> {
    this.logger.info('Application initialized');
    this.logger.info(`Server is going to listen on ${this.config.get('port')}`);
  }
}
