import mongoose from 'mongoose';
import { inject, injectable } from 'inversify';
import { DatabaseClient } from './database-client.interface.js';
import { Component } from '../../types/index.js';
import { Logger } from '../logger/index.js';

@injectable()
export class MongoDatabaseClient implements DatabaseClient {
  private isConnected = false;

  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
  ) {}

  public isConnectedToDatabase(): boolean {
    return this.isConnected;
  }

  public async connect(uri: string): Promise<void> {
    if (this.isConnectedToDatabase()) {
      throw new Error('MongoDB client already connected');
    }

    this.logger.info('Trying to connect to MongoDB...');

    await mongoose.connect(uri);
    this.isConnected = true;

    this.logger.info('Database connection established.');
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnectedToDatabase()) {
      throw new Error('Not connected to the database');
    }

    await mongoose.disconnect();
    this.isConnected = false;

    this.logger.info('Database connection closed.');
  }
}
