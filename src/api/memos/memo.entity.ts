import { instanceToPlain, plainToInstance } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Comment } from '../comments/coment.entity';
import { ResponseCommentDTO } from '../comments/dtos/response-comment.dto';
import { User } from '../users/user.entity';
import { ResponseMemoDTO } from './dtos/response-memo.dto';

@Entity({ name: 'memos' })
export class Memo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @OneToMany(() => Comment, (comment) => comment.memo, { onDelete: 'CASCADE' })
  comments: Comment[];

  @ManyToOne(() => User, (user) => user.memos, { onDelete: 'CASCADE' })
  createdBy: User;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' })
  updatedAt: Date;

  static toDTO(memoEntity: Memo, comments?: ResponseCommentDTO[]): ResponseMemoDTO {
    const data = instanceToPlain(memoEntity);
    data.comments = comments;
    return plainToInstance(ResponseMemoDTO, data);
  }
}
