import { injectable } from 'inversify';
import { config } from 'dotenv';
import { Config } from './config.interface.js';
import { configRestSchema, RestSchema } from './rest-schema.js';

@injectable()
export class RestConfig implements Config<RestSchema> {
  private readonly config: RestSchema;

  constructor() {
    const parsedOutput = config({ quiet: true });

    if (parsedOutput.error) {
      throw new Error('Can\'t read .env file. Perhaps the file does not exist.');
    }

    configRestSchema.load({});
    configRestSchema.validate({ allowed: 'strict' });

    this.config = configRestSchema.getProperties();
  }

  public get<T extends keyof RestSchema>(key: T): RestSchema[T] {
    return this.config[key];
  }
}
