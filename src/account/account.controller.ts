import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';

@Controller('/account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}
  @Post('/signin')
  signIn(@Body() createAccountDto: CreateAccountDto) {
    return this.accountService.signIn(createAccountDto);
  }
  @Post('/signup')
  signUp(@Body() createAccountDto: CreateAccountDto) {
    return this.accountService.signUp(createAccountDto);
  }
  @Get('signup/kakao')
  kakaoSignUp(@Query() code) {
    console.log(code);
    return this.accountService.kakaoSignUp(code.code);
  }
  @Get('signup/google')
  googleSignUp(@Query() code) {
    console.log(code);
    return this.accountService.googleSignUp(code.code);
  }
  @Get('signup/naver')
  naverSignUp(@Query() code) {
    console.log(code);
    return this.accountService.naverSignUp(code.code);
  }
}
