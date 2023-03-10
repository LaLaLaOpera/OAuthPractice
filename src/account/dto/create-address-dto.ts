import { Account } from '../entities/account.entity';

export class CreateAddressDto {
  zipCode: string;

  address: string;

  addressDetail: string;

  isMain: boolean;

  account: Account;
}
