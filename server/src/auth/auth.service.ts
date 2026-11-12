import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PublicUser } from '../users/public-user-select';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
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
}

