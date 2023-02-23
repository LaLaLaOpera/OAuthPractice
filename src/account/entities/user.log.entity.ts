import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Member } from './account.entity';

@Entity()
export class UserLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Member, (Member) => Member.userLogs, {
    createForeignKeyConstraints: false,
  })
  account: Member;

  @CreateDateColumn({
    type: 'timestamp with time zone',
  })
  loginDate: Date;

  @Column()
  loginStatus: string;
}
