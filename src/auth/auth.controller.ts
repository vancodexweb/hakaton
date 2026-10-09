import {Body, Controller, Get, HttpCode, Post, Res} from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import {RegisterDto} from "./dto/register.dto";
import {Public} from "./decorators/public.decorator";
import {AuthDto} from "./dto/auth.dto";
import {ConfigService} from "@nestjs/config";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly config: ConfigService,) {}

  private setCookie(res: Response, token: string) {
    res.cookie('access_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: this.config.get('COOKIE_SECURE') === 'true',
      maxAge: 24 * 60 * 60 * 1000,
    });
  }

  @Public()
  @Post('register')
  async register(@Body() data: RegisterDto) {
    return await this.authService.register(data)
  }

  @Public()
  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response) {
    const token = await this.authService.login(dto);
    this.setCookie(res, token);
    return { message: 'ok' };
  }

  @Public()
  @Post('logout')
  @HttpCode(200)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    return { message: 'ok' };
  }

}
