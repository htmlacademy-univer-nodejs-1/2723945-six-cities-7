import convict from 'convict';
import formats from 'convict-format-with-validator';

convict.addFormats(formats);

export interface RestSchema {
  port: number;
  dbHost: string;
  dbUser: string;
  dbPassword: string;
  dbPort: number;
  dbName: string;
  salt: string;
}

export const configRestSchema = convict<RestSchema>({
  port: {
    doc: 'Port for incoming connections',
    format: 'port',
    default: null,
    env: 'PORT',
  },
  dbHost: {
    doc: 'Database server IP address',
    format: 'ipaddress',
    default: null,
    env: 'DB_HOST',
  },
  dbUser: {
    doc: 'Database user',
    format: String,
    default: null,
    env: 'DB_USER',
  },
  dbPassword: {
    doc: 'Database password',
    format: String,
    default: null,
    env: 'DB_PASSWORD',
  },
  dbName: {
    doc: 'Database name',
    format: String,
    default: null,
    env: 'DB_NAME',
  },
  dbPort: {
    doc: 'Database server port',
    format: 'port',
    default: 27017,
    env: 'DB_PORT',
  },
  salt: {
    doc: 'Salt for password hashing',
    format: (value: unknown) => {
      if (typeof value !== 'string' || value.trim().length === 0) {
        throw new Error('Must be a non-empty string');
      }
    },
    default: null,
    env: 'SALT',
  },
});
