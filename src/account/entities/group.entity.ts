import { Base } from '@/utiles/base.entity';
import { Column, Entity, OneToMany, Relation } from 'typeorm';
import { GroupPolicy } from '@/feature/entities/group.policy.entity';
import { Account } from './account.entity';

@Entity({})
export class Group extends Base {
  @Column({
    comment: '그룹의 이름',
  })
  name: string;

  @OneToMany(() => Account, (target) => target.group)
  accounts: Account[];

  @OneToMany(() => GroupPolicy, (target) => target.group)
  groupPolicies: Relation<GroupPolicy>[];
}
