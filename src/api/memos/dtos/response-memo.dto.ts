import { Exclude, Expose, Transform } from 'class-transformer';
import { IsDate, IsNumber, IsString } from 'class-validator';

@Exclude()
export class ResponseMemoDTO {
  @Expose()
  @IsNumber()
  id: number;

  @Expose()
  @IsString()
  title: string;

  @Expose()
  @IsString()
  content: string;

  @Expose()
  @Transform(({ value }) => value.username)
  @IsString()
  createdBy: string;

  @Expose()
  @IsDate()
  createdAt: Date;

  @Expose()
  @IsDate()
  updatedAt: Date;
}
