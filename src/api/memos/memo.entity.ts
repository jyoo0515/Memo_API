import { instanceToPlain, plainToInstance } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ResponseMemoDTO } from './dtos/response-memo.dto';

@Entity({ name: 'memos' })
export class Memo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' })
  updatedAt: Date;

  static toDTO(memoEntity: Memo): ResponseMemoDTO {
    const data = instanceToPlain(memoEntity);
    return plainToInstance(ResponseMemoDTO, data);
  }
}