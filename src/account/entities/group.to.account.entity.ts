import { Base } from '../../utiles/base.entity';
import { Entity, ManyToOne } from 'typeorm';
import { Account } from './account.entity';
import { Group } from './group.entity';

@Entity()
export class GroupToAccount extends Base {
  @ManyToOne(() => Account, (target) => target.groupToAccount)
  Account: Account;

  @ManyToOne(() => Group, (target) => target.groupToAccount)
  group: Group;
}
