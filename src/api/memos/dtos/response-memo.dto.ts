import { Exclude, Expose, Transform } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { ResponseCommentDTO } from '../../comments/dtos/response-comment.dto';

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
  @IsOptional()
  comments?: ResponseCommentDTO[];

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
