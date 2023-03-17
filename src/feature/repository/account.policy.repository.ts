import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { AccountPolicy } from '../entities/account.policy.entity';
@Injectable()
export class AccountPolicyRepository extends Repository<AccountPolicy> {
  constructor(private dataSource: DataSource) {
    super(AccountPolicy, dataSource.createEntityManager());
  }
}
