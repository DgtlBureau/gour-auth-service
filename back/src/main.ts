import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

const requiredEnvs = ['DB_HOST', 'DB_PORT', 'DB_USERNAME', 'DB_PASSWORD', 'DB_DATABASE'];

requiredEnvs.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Add ${key} to .env file !!`);
  }
});

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP,
    options: {
      port: +process.env.PORT,
    },
  });

  app.useGlobalPipes(new ValidationPipe());

  console.log('APP LISTEN %s port', process.env.PORT);
}

bootstrap();
