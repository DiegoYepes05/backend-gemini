import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

let cachedApp: any;

async function createApp() {
  if (cachedApp) {
    return cachedApp;
  }

  const expressApp = express();
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );

  app.enableCors({
    origin: true,
    credentials: true,
  });

  await app.init();
  cachedApp = expressApp;

  return expressApp;
}

export default async (req: any, res: any) => {
  const app = await createApp();
  return app(req, res);
};
