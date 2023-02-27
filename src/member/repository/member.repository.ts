import { Repository } from 'typeorm';
import { Member } from '../entities/member.entity';

export class MemberRepository extends Repository<Member> {
  async findByTypeAndId(type: string, id: string) {
    return await this.createQueryBuilder('member')
      .leftJoinAndSelect(`member.${type}`, `${type}`)
      .where(`${type}.snsId =:id`, { id: id })
      .getOne();
  }
}
