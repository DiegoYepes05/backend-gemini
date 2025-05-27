import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { GeminiService } from './gemini.service';
import { BasicPromptDto } from './dto/basic-prompt.dto';
import { Response } from 'express';
import { GenerateContentResponse } from '@google/genai';
import { ChatPromptDto } from './dto/chat-prompt.dto';
import { ImageGenerationDto } from './dto/image-generation.dto';

@Controller('gemini')
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) {}

  async outputResponseStream(
    res: Response,
    stream: AsyncGenerator<GenerateContentResponse, any, any>,
  ) {
    res.setHeader('Content-Type', 'text/plane');
    res.status(HttpStatus.OK);
    let resultText = '';

    for await (const chunk of stream) {
      const piece = chunk.text;
      resultText += piece;
      res.write(piece);
    }
    res.end();

    return resultText;
  }

  @Post('basic-prompt')
  basicPrompt(@Body() basicPromptDto: BasicPromptDto) {
    return this.geminiService.basicPrompt(basicPromptDto);
  }
  @Post('basic-prompt-stream')
  @UseInterceptors(FilesInterceptor('files'))
  async basicPromptStream(
    @Body() basicPromptDto: BasicPromptDto,
    @Res() res: Response,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    console.log(files);
    basicPromptDto.files = files;
    const stream = await this.geminiService.basicPromptStream(basicPromptDto);
    void this.outputResponseStream(res, stream);
  }
  @Post('chat-stream')
  @UseInterceptors(FilesInterceptor('files'))
  async chatPromptStream(
    @Body() chatPromptDto: ChatPromptDto,
    @Res() res: Response,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    console.log(files);
    chatPromptDto.files = files;
    const stream = await this.geminiService.chatPromptStream(chatPromptDto);
    const data = await this.outputResponseStream(res, stream);
    const userMessages = {
      role: 'user',
      parts: [{ text: chatPromptDto.prompt }],
    };

    const geminiMessages = {
      role: 'model',
      parts: [{ text: data }],
    };

    this.geminiService.saveChatHistory(chatPromptDto.chatId, userMessages);
    this.geminiService.saveChatHistory(chatPromptDto.chatId, geminiMessages);
  }
  @Get('chat-history/:chatId')
  getChatHistoryById(@Param('chatId') chatId: string) {
    return this.geminiService.getChatHistory(chatId).map((message) => ({
      role: message.role,
      parts: message.parts?.map((part) => part.text).join(''),
    }));
  }

  @Post('image-generation')
  @UseInterceptors(FilesInterceptor('files'))
  imageGeneration(
    @Body() imageGenerationDto: ImageGenerationDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    imageGenerationDto.files = files;
    return this.geminiService.imageGeneration(imageGenerationDto);
  }
}
