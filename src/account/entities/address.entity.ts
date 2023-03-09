import { Column, Entity, ManyToOne } from 'typeorm';
import { Base } from '../../utiles/base.entity';
import { Account } from './account.entity';

@Entity()
export class Address extends Base {
  @Column()
  zipCode: string;

  @Column()
  address: string;

  @Column()
  addressDetail: string;

  @Column({
    default: false,
  })
  isMain: boolean;

  @ManyToOne(() => Account, (target) => target.addresses)
  account: Account;
}
