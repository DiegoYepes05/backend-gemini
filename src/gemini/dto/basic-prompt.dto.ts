import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class BasicPromptDto {
  @IsString()
  @IsNotEmpty()
  prompt: string;

  @IsOptional()
  @IsArray()
  files?: Express.Multer.File[];
}
