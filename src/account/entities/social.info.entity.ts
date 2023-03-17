import { Base } from '@/utiles/base.entity';
import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { Account } from './account.entity';

@Entity()
export class SocialInfo extends Base {
  @Index()
  @Column()
  snsId: string;

  @Column()
  type: string;

  @ManyToOne(() => Account, (s) => s.socialInfo)
  account: Account;

  @Column({
    comment: 'OAuth로 넘겨받은 email 값',
    default: '',
  })
  sns_email: string;

  @Column({
    type: 'simple-json',
    default: '',
  })
  info: string;
}
