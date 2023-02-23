import { Base } from 'src/utiles/base.entity';
import { Column, Entity, OneToMany, Unique } from 'typeorm';
import { GoogleInfo } from './google.info.entity';
import { KakaoInfo } from './kakao.info.entity';
import { NaverInfo } from './naver.info.entity';
import { UserLog } from './user.log.entity';

@Entity()
@Unique(['email'])
export class Member extends Base {
  @Column({
    comment: '사용자가 로그인에 사용할 이메일',
  })
  email: string;

  @Column({
    select: false,
    comment: '비밀번호 암호화 Encryption 필수',
  })
  password: string;

  @OneToMany(() => UserLog, (userLog) => userLog.account)
  userLogs: UserLog[];

  @OneToMany(() => KakaoInfo, (a) => a.account)
  kakao: KakaoInfo[];

  @OneToMany(() => GoogleInfo, (g) => g.account)
  google: GoogleInfo[];

  @OneToMany(() => NaverInfo, (n) => n.account)
  naver: NaverInfo[];
}
