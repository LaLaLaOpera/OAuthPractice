import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
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
  @Get('signup/:route')
  oAuthSignup(@Query('code') code, @Param('route') route) {
    return this.accountService.oAuthSignUp(code, route);
  }
}
