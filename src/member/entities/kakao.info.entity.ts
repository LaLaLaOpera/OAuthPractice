import { Base } from '../../utiles/base.entity';
import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { Member } from './member.entity';

@Entity()
export class KakaoInfo extends Base {
  @Index()
  @Column()
  snsId: string;

  @ManyToOne(() => Member, (s) => s.kakao)
  account: Member;
}
