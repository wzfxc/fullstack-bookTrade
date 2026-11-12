import { randomBytes } from 'crypto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { MailService } from '../../infra/mail/mail.service';
import { PublicUser } from '../users/public-user-select';
import { UsersService } from '../users/users.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtPayload } from './jwt-payload.interface';

const RESET_TOKEN_BYTES = 32;
const RESET_TOKEN_EXPIRATION_MS = 60 * 60 * 1000;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {}

  register(registerDto: RegisterDto): Promise<PublicUser> {
    const email = registerDto.email.toLowerCase();

    return this.usersService.create({ ...registerDto, email, role: Role.USER });
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const email = loginDto.email.toLowerCase();
    const user = await this.usersService.findByEmail(email);

    const isPasswordValid =
      user !== null && (await bcrypt.compare(loginDto.password, user.password));

    if (!user || !isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload: JwtPayload = { sub: user.id };

    return { accessToken: await this.jwtService.signAsync(payload) };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string }> {
    const email = forgotPasswordDto.email.toLowerCase();
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User with this email does not exist');
    }

    const token = randomBytes(RESET_TOKEN_BYTES).toString('hex');
    const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRATION_MS);

    await this.usersService.savePasswordResetToken(user.id, token, expiresAt);

    const frontendOrigin =
      this.configService.get<string>('CORS_ORIGIN') ??
      process.env.CORS_ORIGIN ??
      'http://localhost:3000';
    const resetUrl = `${frontendOrigin}/reset-password?token=${token}`;

    await this.mailService.sendPasswordResetEmail({
      recipientEmail: user.email,
      recipientName: user.name,
      resetUrl,
    });

    return { message: 'Password reset email sent' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
    const user = await this.usersService.findByValidResetToken(resetPasswordDto.token);

    if (!user) {
      throw new BadRequestException('Invalid or expired password reset token');
    }

    await this.usersService.resetPassword(user.id, resetPasswordDto.newPassword);

    return { message: 'Password has been reset successfully' };
  }
}
