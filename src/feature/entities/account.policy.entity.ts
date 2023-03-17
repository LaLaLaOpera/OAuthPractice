import { Account } from '@/account/entities/account.entity';
import { Base } from '@/utiles/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Feature } from './feature.entity';

@Entity()
export class AccountPolicy extends Base {
  @ManyToOne(() => Account, (target) => target.accountPolicies)
  account: Account;

  @ManyToOne(() => Feature, (target) => target.accountPolicies)
  feature: Feature;

  @Column({
    comment: '각 기능에 대한 권한 CRUD',
    type: 'simple-json',
  })
  authorization: string;
}
