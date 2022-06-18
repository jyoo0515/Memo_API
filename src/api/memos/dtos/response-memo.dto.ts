import { IsDate, IsNumber, IsString } from 'class-validator';

export class ResponseMemoDTO {
  @IsNumber()
  id: number;

  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
