import { Base } from '../../utiles/base.entity';
import { Column, Entity, OneToMany, Unique } from 'typeorm';
import { SocialInfo } from './social.info.entity';
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

  @Column({
    comment: '자동 생성된 임의 이메일 인지를 판단하여 체크가 된다.',
    default: false,
  })
  isGeneratedEmail: boolean;

  @Column({
    comment: '핸드폰 번호',
    nullable: true,
  })
  phone: string;

  @Column({
    comment:
      '생성된 유저의 이름, 쇼셜 로그인으로 가입 할 경우 해당 정보를 받아오거나 자동으로 생성',
    default: '신출내기 모험가',
  })
  nickName: string;

  @Column({
    comment: '본인 인증 여부를 판단하는 컬럼',
  })
  isAuthorized: boolean;

  @OneToMany(() => UserLog, (userLog) => userLog.account)
  userLogs: UserLog[];

  @OneToMany(() => SocialInfo, (n) => n.account)
  socialInfo: SocialInfo[];
}
