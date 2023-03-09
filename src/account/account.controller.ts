import {
  Body,
  Controller,
  Get,
  Ip,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
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
  oAuthSignup(@Query('code') code, @Param('route') route, @Ip() ip) {
    console.log(ip);
    return this.accountService.oAuthSignUp(code, route);
  }
  @Get()
  getAccountInfo(@Req() req) {
    return this.accountService.get(req);
  }
}
