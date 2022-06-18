import { instanceToPlain, plainToInstance } from 'class-transformer';
import { IsString } from 'class-validator';
import { Memo } from '../memo.entity';

export class CreateMemoDTO {
  @IsString()
  title: string;

  @IsString()
  content: string;

  static toEntity(memoDTO: CreateMemoDTO): Memo {
    const data = instanceToPlain(memoDTO);
    return plainToInstance(Memo, data);
  }
}
