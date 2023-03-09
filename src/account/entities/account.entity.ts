import { Base } from '../../utiles/base.entity';
import { Column, Entity, OneToMany, Unique } from 'typeorm';
import { SocialInfo } from './social.info.entity';
import { UserLog } from './user.log.entity';
import { GroupToAccount } from './group.to.account.entity';
import { Address } from './address.entity';

@Entity()
@Unique(['email'])
@Unique(['phone'])
export class Account extends Base {
  @Column({
    comment: '사용자가 로그인에 사용할 이메일',
    name: 'acc_email',
  })
  email: string;

  @Column({
    select: false,
    comment: '비밀번호 암호화 Encryption 필수',
    name: 'acc_password',
  })
  password: string;

  @Column({
    comment: '자동 생성된 임의 이메일 인지를 판단하여 체크가 된다',
    default: false,
    name: 'acc_gen_email',
  })
  isGeneratedEmail: boolean;

  @Column({
    comment:
      '유저의 롤, 지금 단계에서는 구매자와 판매자의 롤을 나눈다. 판매자의 경우 필수 정보들이 들어간다.',
    name: 'acc_role',
  })
  role: string;

  @Column({
    comment: '이메일 인증 여부',
    default: false,
    name: 'acc_email_verified',
  })
  emailVerified: boolean;

  @Column({
    comment: '핸드폰 번호',
    nullable: true,
    name: 'acc_phone',
  })
  phone: string;

  @Column({
    comment:
      '생성된 유저의 이름, 쇼셜 로그인으로 가입 할 경우 해당 정보를 받아오거나 자동으로 생성',
    default: '신출내기 모험가',
    name: 'acc_nickname',
  })
  nickname: string;

  @Column({
    comment: '본인 인증 여부를 판단하는 컬럼',
    default: false,
    name: 'acc_is_authorized',
  })
  isAuthorized: boolean;

  @Column({
    comment: '회원이 보유한 포인트',
    default: 0,
    name: 'acc_point',
  })
  point: number;

  @Column({
    comment: '회원의 등급 || Level',
    default: '',
    name: 'acc_level',
  })
  level: string;

  @Column({
    comment: '회원 가입 시 사용한 IP 주소',
    default: '',
    name: 'acc_reg_ip',
  })
  registeration_ip: string;

  @Column({
    comment: '마지막으로 로그인한 아이피',
    default: '',
    name: 'acc_last_login_ip',
  })
  lastlogin_ip: string;

  @Column({
    comment: '마지막으로 로그인한 시간',
    type: 'timestamp with time zone',
    nullable: true,
    name: 'acc_last_login_date',
  })
  lastlogin_date: Date;

  @OneToMany(() => UserLog, (userLog) => userLog.account)
  userLogs: UserLog[];

  @OneToMany(() => SocialInfo, (target) => target.account)
  socialInfo: SocialInfo[];

  @OneToMany(() => GroupToAccount, (target) => target.Account)
  groupToAccount: GroupToAccount[];

  @OneToMany(() => Address, (target) => target.account)
  addresses: Address[];
}
