import { instanceToPlain, plainToInstance } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import { Memo } from '../../memos/memo.entity';
import { User } from '../../users/user.entity';
import { Comment } from '../coment.entity';

export class CreateCommentDTO {
  @IsNumber()
  memoId: number;

  @IsString()
  content: string;

  static toEntity(commentDTO: CreateCommentDTO, memo: Memo, user: User): Comment {
    const data = instanceToPlain(commentDTO);
    data.memo = memo;
    data.createdBy = user;
    return plainToInstance(Comment, data);
  }
}
