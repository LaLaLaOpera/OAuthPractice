import { randomUUID } from 'crypto';
import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Payment {
  @BeforeInsert()
  setId() {
    this.id = 'defualt_id_' + randomUUID();
    return;
  }

  @PrimaryColumn()
  id: string;

  @Column({
    type: 'simple-json',
  })
  orderDetail: string;
}
