import { IsOptional, IsString } from 'class-validator';

export class UpdateMemoDTO {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;
}
