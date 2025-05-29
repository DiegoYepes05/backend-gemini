import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';

const server = express();

async function createNestServer(expressInstance) {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );

  app.enableCors();

  return app.init();
}

// Para desarrollo local
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 3000;
  createNestServer(server)
    .then(() =>
      server.listen(port, () => {
        console.log(`Server running on port ${port}`);
      }),
    )
    .catch((err) => console.error('Error starting server', err));
}

// Para Vercel
createNestServer(server);

export default server;
