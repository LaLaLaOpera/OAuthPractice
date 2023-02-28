// import { AccountController } from './account.controller';
// import { JwtService } from '@nestjs/jwt';
// import { Test, TestingModule } from '@nestjs/testing';
// import { passwordEncryption } from '../utiles/password.encryption';
// import { AccountService } from './account.service';
// import { OAuthService } from './oauth.service';
// import { AppModule } from '../app.module';
// import { Member } from './entities/member.entity';
// import { getRepositoryToken } from '@nestjs/typeorm';
// import { SocialInfo } from './entities/social.info.entity';
// describe('AccountController', () => {
//   let controller: AccountController;
//   const mockRepository = () => ({
//     findOne: jest.fn(),
//     save: jest.fn(),
//     create: jest.fn(),
//   });

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       imports: [AppModule],
//       controllers: [AccountController],
//       providers: [
//         AccountService,
//         JwtService,
//         OAuthService,
//         passwordEncryption,
//         {
//           provide: getRepositoryToken(Member),
//           useValue: mockRepository(),
//         },
//         {
//           provide: getRepositoryToken(SocialInfo),
//           useValue: mockRepository(),
//         },
//       ],
//     }).compile();
//     controller = module.get<AccountController>(AccountController);
//   });

//   it('should be defined', () => {
//     expect(controller).toBeDefined();
//   });
// });
