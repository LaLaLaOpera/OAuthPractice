import { Base } from '../../utiles/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { GroupToAccount } from './group.to.account.entity';

@Entity({})
export class Group extends Base {
  @Column({
    comment: '그룹의 이름',
  })
  name: string;

  @OneToMany(() => GroupToAccount, (target) => target.group)
  groupToAccount: GroupToAccount[];
}
