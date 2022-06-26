import { Exclude, Expose, Transform } from 'class-transformer';
import { IsDate, IsNumber, IsString } from 'class-validator';

@Exclude()
export class ResponseCommentDTO {
  @Expose()
  @IsNumber()
  id: number;

  @Expose()
  @IsString()
  content: string;

  @Expose()
  @Transform(({ value }) => value.username)
  createdBy: string;

  @Expose()
  @IsDate()
  createdAt: Date;

  @Expose()
  @IsDate()
  updatedAt: Date;
}
