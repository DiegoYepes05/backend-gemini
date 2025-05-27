import { join } from 'path';

import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';

import { GeminiService } from './gemini.service';
import { GeminiController } from './gemini.controller';

@Module({
  controllers: [GeminiController],
  providers: [GeminiService],
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
  ],
})
export class GeminiModule {}
