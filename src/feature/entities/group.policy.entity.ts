import { Group } from '@/account/entities/group.entity';
import { Base } from '@/utiles/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Feature } from './feature.entity';

@Entity()
export class GroupPolicy extends Base {
  @ManyToOne(() => Group, (target) => target.groupPolicies)
  group: Group;

  @ManyToOne(() => Feature, (target) => target.groupPolicies)
  feature: Feature;

  @Column({
    comment: '각 기능에 대한 권한 CRUD',
    type: 'simple-json',
  })
  authorization: string;
}
