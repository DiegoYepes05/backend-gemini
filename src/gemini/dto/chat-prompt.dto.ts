import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class ChatPromptDto {
  @IsString()
  @IsNotEmpty()
  prompt: string;
  @IsArray()
  @IsOptional()
  files: Express.Multer.File[];

  @IsString()
  @IsUUID()
  chatId: string;
}
