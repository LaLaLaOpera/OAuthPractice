import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Feature } from '../entities/feature.entity';
@Injectable()
export class FeatureRepository extends Repository<Feature> {
  constructor(private dataSource: DataSource) {
    super(Feature, dataSource.createEntityManager());
  }
}
