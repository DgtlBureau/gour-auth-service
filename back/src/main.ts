import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as Sentry from '@sentry/node';

import { AppModule } from './app.module';
import { getRequiredEnvsByNodeEnv } from './common/utils/getRequiredEnvsByNodeEnv';
import { NodeEnv } from './common/types/App';

const envs = [
  'DB_HOST',
  'DB_PORT',
  'DB_USERNAME',
  'DB_PASSWORD',
  'DB_DATABASE',
  'ACCESS_TOKEN_SECRET',
  'REFRESH_TOKEN_SECRET',
  'API_GATEWAY_URL',
];

const requiredEnvs = getRequiredEnvsByNodeEnv(
  { common: envs, development: ['SENTRY_DSN'], production: ['SENTRY_DSN'] },
  process.env.NODE_ENV as NodeEnv,
);

requiredEnvs.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Add ${key} to .env file !!`);
  }
});

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP,
    options: {
      host: process.env.HOST,
      port: +process.env.PORT,
    },
  });

  app.useGlobalPipes(new ValidationPipe());

  if (['production', 'development'].includes(process.env.NODE_ENV)) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV,
      tracesSampleRate: 1.0,
    });
  }

  await app.listen();

  console.log('AUTH SERVICE LISTEN:', process.env.PORT);
}

bootstrap();
