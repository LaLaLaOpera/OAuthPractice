import { Column, Entity } from 'typeorm';
import { Base } from '../../utiles/base.entity';

@Entity()
export class Tenant extends Base {
  @Column()
  clientId: string;

  @Column()
  clientSecret: string;

  @Column()
  email: string;

  @Column({
    select: false,
  })
  password: string;

  @Column({
    comment: '실제로 저장된 스키마의 이름',
  })
  schemaName: string;
}
