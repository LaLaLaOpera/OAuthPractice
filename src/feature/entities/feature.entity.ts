import { Column, Entity, OneToMany } from 'typeorm';
import { GroupPolicy } from './group.policy.entity';
import { AccountPolicy } from './account.policy.entity';
import { Base } from '@/utiles/base.entity';

@Entity()
export class Feature extends Base {
  @Column({})
  url: string;

  @Column({
    comment: '',
  })
  name: string;

  @Column({
    comment: '디테일 사항이 들어갈 컬럼',
    type: 'simple-json',
  })
  detail: string;

  @Column({
    comment: '권한이 필요한지 여부',
  })
  reqAuth: boolean;

  @OneToMany(() => GroupPolicy, (target) => target.feature)
  groupPolicies: GroupPolicy[];

  @OneToMany(() => AccountPolicy, (target) => target.feature)
  accountPolicies: AccountPolicy[];
}
