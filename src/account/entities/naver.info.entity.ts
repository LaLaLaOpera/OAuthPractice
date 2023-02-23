import { Base } from 'src/utiles/base.entity';
import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { Member } from './account.entity';

@Entity()
export class NaverInfo extends Base {
  @Index()
  @Column()
  snsId: string;

  @ManyToOne(() => Member, (s) => s.naver)
  account: Member;
}
