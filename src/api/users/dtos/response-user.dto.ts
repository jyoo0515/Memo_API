import { IsDate, IsString } from 'class-validator';

export class ResponseUserDTO {
  @IsString()
  username: string;

  @IsDate()
  createdAt: Date;
}
