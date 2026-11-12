import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { PublicUser } from '../users/public-user-select';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  register(@Body() registerDto: RegisterDto): Promise<PublicUser> {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto): Promise<{ accessToken: string }> {
    return this.authService.login(loginDto);
  }

  @Get('me')
  getProfile(@CurrentUser() currentUser: PublicUser): PublicUser {
    return currentUser;
  }
}
