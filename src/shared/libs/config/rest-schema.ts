import convict from 'convict';
import formats from 'convict-format-with-validator';

convict.addFormats(formats);

export interface RestSchema {
  port: number;
  dbHost: string;
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
