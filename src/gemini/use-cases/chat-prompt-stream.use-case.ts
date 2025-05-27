import { Content, createPartFromUri, GoogleGenAI } from '@google/genai';

import { ChatPromptDto } from '../dto/chat-prompt.dto';
import { geminiUploadFiles } from 'src/config/helpers/gemini-upload-files';

interface Options {
  model?: string;
  history: Content[];
}
export const ChatPromptStreamUseCase = async (
  ai: GoogleGenAI,
  chatPromptDto: ChatPromptDto,
  options?: Options,
) => {
  const { prompt, files = [] } = chatPromptDto;

  const uploadedFiles = await geminiUploadFiles(ai, files);

  const { model = 'gemini-2.0-flash', history = [] } = options ?? {};
  const chat = ai.chats.create({
    model: model,
    config: {
      systemInstruction: 'Responde unicamente en español y en formato markdown',
    },
    history: history,
  });
  return chat.sendMessageStream({
    message: [
      prompt,
      ...uploadedFiles.map((file) =>
        createPartFromUri(file.uri ?? '', file.mimeType ?? ''),
      ),
    ],
  });
};
