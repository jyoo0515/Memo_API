import { BeforeInsert, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import bcrypt from 'bcrypt';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { ResponseUserDTO } from './dtos/response-user.dto';
import { SALT_ROUNDS } from '../../constants';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' })
  updatedAt: Date;

  @BeforeInsert()
  private async hashPassword() {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    this.password = await bcrypt.hash(this.password, salt);
  }

  static async comparePassword(password: string, hashedPassword: string) {
    const result = await bcrypt.compare(password, hashedPassword);
    return result;
  }

  static toDTO(userEntity: User) {
    const data = instanceToPlain(userEntity);
    console.log(plainToInstance(ResponseUserDTO, data));
    return plainToInstance(ResponseUserDTO, data);
  }
}
