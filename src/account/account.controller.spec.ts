import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from './account.service';
import { AppModule } from '../app.module';
import { AccountController } from './account.controller';
describe('AccountController', () => {
  let controller: AccountController;
  let accountService: Partial<AccountService>;
  let module: TestingModule;

  beforeEach(async () => {
    accountService = {};
    module = await Test.createTestingModule({
      imports: [AppModule],
      controllers: [AccountController],
      providers: [
        {
          provide: AccountService,
          useValue: accountService,
        },
      ],
    }).compile();
    controller = module.get<AccountController>(AccountController);
    accountService = module.get<AccountService>(AccountService);
  });
  afterEach(async () => {
    await module.close();
  });

  test('should be defined', () => {
    expect(controller).toBeDefined();
  });
  test('test OAuth Function', async () => {
    const oauth = jest.spyOn(AccountService.prototype, 'oAuthSignUp');
    oauth.mockResolvedValue({
      init: 166666666,
      exp: 155555556,
      access_token: 'aaa',
    });
    const token = await controller.oAuthSignup('a', 'b', '');
    expect(oauth).toBeCalledTimes(1);
    expect(token).toBeDefined;
  });
});
