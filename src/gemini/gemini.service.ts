import { BasicPromptDto } from './dto/basic-prompt.dto';
import { Content, GoogleGenAI } from '@google/genai';
import { env } from 'src/config/envs';
import { BasicPromptUseCase } from './use-cases/basic-prompt.use-case';
import { BasicPromptStreamUseCase } from './use-cases/basic-prompt-stream.use-case';
import { ChatPromptStreamUseCase } from './use-cases/chat-prompt-stream.use-case';
import { ChatPromptDto } from './dto/chat-prompt.dto';
import { Injectable } from '@nestjs/common';
import { ImageGenerationDto } from './dto/image-generation.dto';
import { imageGenerationUseCase } from './use-cases/image-generation.use-case';

@Injectable()
export class GeminiService {
  private ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || env.geminiApiKey,
  });
  private chatHistory = new Map<string, Content[]>();
  async basicPrompt(basicPromptDto: BasicPromptDto) {
    return BasicPromptUseCase(this.ai, basicPromptDto);
  }
  async basicPromptStream(basicPromptDto: BasicPromptDto) {
    return BasicPromptStreamUseCase(this.ai, basicPromptDto);
  }
  async chatPromptStream(chatPromptDto: ChatPromptDto) {
    const history = this.getChatHistory(chatPromptDto.chatId);
    return ChatPromptStreamUseCase(this.ai, chatPromptDto, {
      history,
    });
  }
  saveChatHistory(chatId: string, message: Content) {
    const messages = this.getChatHistory(chatId);
    messages.push(message);
    this.chatHistory.set(chatId, messages);
    console.log(this.chatHistory);
  }
  getChatHistory(chatId: string) {
    return this.chatHistory.get(chatId) ?? [];
  }
  imageGeneration(imageGenerationDto: ImageGenerationDto) {
    return imageGenerationUseCase(this.ai, imageGenerationDto);
  }
}
