import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ImageGenerationDto {
  @IsString()
  @IsNotEmpty()
  prompt: string;

  @IsOptional()
  @IsArray()
  files?: Express.Multer.File[];
}
