import { Base } from '../../utiles/base.entity';
import { Column, Entity } from 'typeorm';

@Entity({})
export class Group extends Base {
  @Column({
    comment: '그룹의 이름',
  })
  name: string;
}
