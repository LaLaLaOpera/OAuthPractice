import {
  Body,
  Controller,
  Get,
  Ip,
  NotAcceptableException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
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

  @Get('/:accountId/address')
  getUSERADDRESS(
    @Req() req,
    @Param('accountId', new ParseUUIDPipe()) accountId,
  ) {
    if (req['user'].id != accountId) {
      console.log(req['user']);
      console.log(accountId);
      throw new NotAcceptableException('Not Authorized');
    }
    return this.accountService.getAddresses(accountId);
  }

  @Put('/:accountId/address')
  addAddress(
    @Req() req,
    @Param('accountId', new ParseUUIDPipe()) accountId,
    @Body() createAccountDto: CreateAccountDto,
  ) {
    if (req['user'].id != accountId) {
      console.log(req['user']);
      console.log(accountId);
      throw new NotAcceptableException('Not Authorized');
    }
    return this.accountService.addAddress(accountId, createAccountDto);
  }
}
