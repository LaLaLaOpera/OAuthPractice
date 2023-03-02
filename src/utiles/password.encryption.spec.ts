import { Test, TestingModule } from '@nestjs/testing';
import { passwordEncryption } from './password.encryption';
describe('passwordEncryption', () => {
  let _passwordEncryption: passwordEncryption;
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [passwordEncryption],
    }).compile();
    _passwordEncryption = app.get<passwordEncryption>(passwordEncryption);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(passwordEncryption).toBeDefined();
    });
  });
});
