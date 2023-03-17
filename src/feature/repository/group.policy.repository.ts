import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { GroupPolicy } from '../entities/group.policy.entity';
@Injectable()
export class GroupPolicyRepository extends Repository<GroupPolicy> {
  constructor(private dataSource: DataSource) {
    super(GroupPolicy, dataSource.createEntityManager());
  }
}
