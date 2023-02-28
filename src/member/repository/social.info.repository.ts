import { DataSource, Repository } from 'typeorm';
import { SocialInfo } from '../entities/social.info.entity';

export class SocialInfoRepository extends Repository<SocialInfo> {
  constructor(private dataSource: DataSource) {
    super(SocialInfo, dataSource.createEntityManager());
  }
}
