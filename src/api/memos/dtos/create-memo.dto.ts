import { instanceToPlain, plainToInstance } from 'class-transformer';
import { IsString } from 'class-validator';
import { User } from '../../users/user.entity';
import { Memo } from '../memo.entity';

export class CreateMemoDTO {
  @IsString()
  title: string;

  @IsString()
  content: string;

  static toEntity(memoDTO: CreateMemoDTO, user: User): Memo {
    const data = instanceToPlain(memoDTO);
    data.createdBy = user;
    return plainToInstance(Memo, data);
  }
}
