import { Module } from '@nestjs/common';
import { FeatureService } from './feature.service';
import { FeatureController } from './feature.controller';
import { FeatureRepository } from './repository/feature.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupPolicy } from './entities/group.policy.entity';
import { AccountPolicy } from './entities/account.policy.entity';
import { Feature } from './entities/feature.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AccountPolicy, Feature, GroupPolicy])],
  controllers: [FeatureController],
  providers: [FeatureService, FeatureRepository, AccountPolicy, GroupPolicy],
})
export class FeatureModule {}
