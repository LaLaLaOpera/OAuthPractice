import { Base } from '../../utiles/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { GroupToMember } from './group.to.member.entity';

@Entity({})
export class Group extends Base {
  @Column({
    comment: '그룹의 이름',
  })
  name: string;

  @OneToMany(() => GroupToMember, (target) => target.group)
  groupToMember: GroupToMember[];
}
