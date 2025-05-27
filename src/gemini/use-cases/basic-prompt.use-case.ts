import { GoogleGenAI } from '@google/genai';
import { BasicPromptDto } from '../dto/basic-prompt.dto';

interface Options {
  model?: string;
}
export const BasicPromptUseCase = async (
  ai: GoogleGenAI,
  basicPromptDto: BasicPromptDto,
  options?: Options,
) => {
  const { model = 'gemini-2.0-flash' } = options ?? {};
  const response = await ai.models.generateContent({
    model: model,
    contents: basicPromptDto.prompt,
    config: {
      systemInstruction: 'Responde unicamente en español y en formato markdown',
    },
  });
  return response.text;
};
