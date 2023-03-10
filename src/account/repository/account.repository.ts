import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Account } from '../entities/account.entity';

@Injectable()
export class AccountRepository extends Repository<Account> {
  constructor(private dataSource: DataSource) {
    super(Account, dataSource.createEntityManager());
  }
  sellerValidation(accountId) {
    this.createQueryBuilder('account').select((s) =>
      s
        .select('')
        .from('seller', 'seller')
        .where('seller.accountId =:id', { id: accountId }),
    );
  }
}
