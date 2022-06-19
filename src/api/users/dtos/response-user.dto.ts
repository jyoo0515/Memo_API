import { Exclude, Expose } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';

@Exclude()
export class ResponseUserDTO {
  @Expose()
  @IsString()
  username: string;

  @Expose()
  @IsDate()
  createdAt: Date;
}
