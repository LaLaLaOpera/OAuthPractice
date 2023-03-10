import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { CreateAddressDto } from './dto/create-address-dto';
import { Address } from './entities/address.entity';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address) private readonly repo: Repository<Address>,
  ) {}
  async get(accountId) {
    return await this.repo.find({
      where: {
        account: {
          id: accountId,
        },
      },
    });
  }
  async put(account, address: CreateAddressDto) {
    console.log(account);
    address.account = account;
    const add = await this.repo.save(address);
    if (address.isMain == true) {
      this.repo.update(
        {
          account: account,
          id: Not(add.id),
        },
        {
          isMain: false,
        },
      );
    }
    return add;
  }
}
