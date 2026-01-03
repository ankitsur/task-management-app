import { DataSourceOptions } from 'typeorm';
import { envConfig } from './env.config';
import { Task } from '../modules/tasks/domain/task.entity';

function getEnv(key: string): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

export const databaseConfig: DataSourceOptions = {
  type: 'postgres',
  host: getEnv('DATABASE_HOST'),
  port: Number(getEnv('DATABASE_PORT')),
  username: getEnv('DATABASE_USER'),
  password: getEnv('DATABASE_PASSWORD'),
  database: getEnv('DATABASE_NAME'),

  entities: [Task],
  migrations: ['dist/migrations/*.js'],

  synchronize: false,
  logging: envConfig.nodeEnv !== 'production',
};
