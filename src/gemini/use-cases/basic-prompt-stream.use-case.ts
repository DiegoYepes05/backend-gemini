import {
  createPartFromUri,
  createUserContent,
  GoogleGenAI,
} from '@google/genai';
import { BasicPromptDto } from '../dto/basic-prompt.dto';

interface Options {
  model?: string;
}
export const BasicPromptStreamUseCase = async (
  ai: GoogleGenAI,
  basicPromptDto: BasicPromptDto,
  options?: Options,
) => {
  const { prompt, files = [] } = basicPromptDto;

  const images = await Promise.all(
    files.map((file) => {
      return ai.files.upload({
        file: new Blob([file.buffer], {
          type: file.mimetype.includes('image') ? file.mimetype : 'image/png',
        }),
      });
    }),
  );

  const { model = 'gemini-2.0-flash' } = options ?? {};
  const response = await ai.models.generateContentStream({
    model: model,
    contents: createUserContent([
      prompt,

      ...images.map((image) =>
        createPartFromUri(image.uri ?? '', image.mimeType ?? ''),
      ),
    ]),
    config: {
      systemInstruction: 'Responde unicamente en español y en formato markdown',
    },
  });
  return response;
};
