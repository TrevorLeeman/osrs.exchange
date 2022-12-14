import dotenv from 'dotenv';
import type { Knex } from 'knex';

dotenv.config({ path: '.env.local' });

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.POSTGRES_HOSTNAME,
      port: parseInt(process.env.POSTGRES_PORT!),
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
    },
    migrations: {
      directory: './src/db/migrations',
      tableName: 'knex_migrations',
      extension: 'ts',
    },
    seeds: {
      directory: './src/db/seeds',
    },
    pool: { min: 0, max: 10 },
    searchPath: ['public'],
    useNullAsDefault: true,
  },
};
export default config;
