import { Column, Entity, ManyToOne } from 'typeorm';
import { Base } from '../../utiles/base.entity';
import { Account } from './account.entity';

@Entity()
export class SellerInfo extends Base {
  @Column({
    comment: '사업자 등록증 이미지의 URL',
  })
  businessRegistrationURL: string;

  @Column({
    comment: '사업자 등록 번호',
  })
  businessRegistrationNumber: string;

  @Column({
    comment: '통신판매업신고증 이미지의 URL',
  })
  onlineSaleRegistrationURL: string;

  @Column({
    comment: '통신판매업신고 번호',
  })
  onlineSaleRegistrationNumber: string;

  @Column({
    comment: '법인명',
  })
  businessName: string;

  @Column({
    comment: '대표자명',
  })
  ownerName: string;

  @Column({
    comment: '사업장 소재지',
  })
  businessAddress: string;

  @Column({
    comment: 'CS 담당자 성함',
  })
  csName: string;

  @Column({
    comment: '판매 사이트 URL',
    default: '',
  })
  storeURL: string;

  @Column({
    comment: 'CS 담당자 연락처',
  })
  csPhone: string;

  @Column({
    comment: 'CS 담당자 유선 전화',
    default: '',
  })
  csLandPhone: string;

  @ManyToOne(() => Account, (target) => target.sellerInfos, {
    createForeignKeyConstraints: false,
  })
  account: Account;

  @Column({
    comment: '관리자에게 인증받은 회원인지를 구분',
    default: false,
  })
  isAuthorized: boolean;
}
