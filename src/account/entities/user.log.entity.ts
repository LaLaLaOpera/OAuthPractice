import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from './account.entity';

@Entity()
export class UserLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Account, (Account) => Account.userLogs, {
    createForeignKeyConstraints: false,
  })
  account: Account;

  @CreateDateColumn({
    type: 'timestamp with time zone',
  })
  loginDate: Date;

  @Column()
  loginStatus: string;
}
