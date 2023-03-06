import { Base } from '../../utiles/base.entity';
import { Entity, ManyToOne } from 'typeorm';
import { Member } from './member.entity';
import { Group } from './group.entity';

@Entity()
export class GroupToMember extends Base {
  @ManyToOne(() => Member, (target) => target.groupToMember)
  member: Member;

  @ManyToOne(() => Group, (target) => target.groupToMember)
  group: Group;
}
