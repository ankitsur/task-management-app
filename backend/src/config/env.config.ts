import 'dotenv/config';

export type Environment = 'development' | 'production' | 'test';

export interface EnvConfig {
  nodeEnv: Environment;
  port: number;
}

function getEnv(key: string): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

export const envConfig: EnvConfig = {
  nodeEnv: getEnv('NODE_ENV') as Environment,
  port: Number(getEnv('PORT')),
};
