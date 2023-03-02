import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { SocialInfo } from '../entities/social.info.entity';
@Injectable()
export class SocialInfoRepository extends Repository<SocialInfo> {
  constructor(private dataSource: DataSource) {
    super(SocialInfo, dataSource.createEntityManager());
  }
}
