import { Base } from '../../utiles/base.entity';
import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { Member } from './member.entity';

@Entity()
export class SocialInfo extends Base {
  @Index()
  @Column()
  snsId: string;

  @Column()
  type: string;

  @ManyToOne(() => Member, (s) => s.socialInfo)
  account: Member;
}
