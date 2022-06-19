import { instanceToPlain, plainToInstance } from 'class-transformer';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Memo } from '../memos/memo.entity';
import { User } from '../users/user.entity';
import { ResponseCommentDTO } from './dtos/response-comment.dto';

@Entity({ name: 'comments' })
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  content: string;

  @ManyToOne(() => Memo, (memo) => memo.comments, { onDelete: 'CASCADE' })
  memo: Memo;

  @ManyToOne(() => User, (user) => user.comments, { onDelete: 'CASCADE' })
  createdBy: User;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' })
  updatedAt: Date;

  static toDTO(commentEntity: Comment): ResponseCommentDTO {
    const data = instanceToPlain(commentEntity);
    return plainToInstance(ResponseCommentDTO, data);
  }
}
