import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let usersService: { create: jest.Mock; findByEmail: jest.Mock };
  let jwtService: { signAsync: jest.Mock };
  let authService: AuthService;

  beforeEach(() => {
    usersService = { create: jest.fn(), findByEmail: jest.fn() };
    jwtService = { signAsync: jest.fn().mockResolvedValue('signed-token') };
    authService = new AuthService(
      usersService as unknown as UsersService,
      jwtService as unknown as JwtService,
    );
  });

  it('lowercases the email and forces the USER role on registration', async () => {
    await authService.register({ email: 'Mixed@Example.COM', password: 'password123', name: 'Mixed' });

    expect(usersService.create).toHaveBeenCalledWith({
      email: 'mixed@example.com',
      password: 'password123',
      name: 'Mixed',
      role: Role.USER,
    });
  });

  it('looks up the user by lowercased email on login and returns a token', async () => {
    usersService.findByEmail.mockResolvedValue({
      id: 'user-id',
      password: await bcrypt.hash('password123', 4),
    });

    const result = await authService.login({ email: 'Mixed@Example.COM', password: 'password123' });

    expect(usersService.findByEmail).toHaveBeenCalledWith('mixed@example.com');
    expect(result).toEqual({ accessToken: 'signed-token' });
    expect(jwtService.signAsync).toHaveBeenCalledWith({ sub: 'user-id' });
  });

  it('rejects an incorrect password', async () => {
    usersService.findByEmail.mockResolvedValue({
      id: 'user-id',
      password: await bcrypt.hash('password123', 4),
    });

    await expect(
      authService.login({ email: 'user@example.com', password: 'wrong-password' }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('rejects an unknown email', async () => {
    usersService.findByEmail.mockResolvedValue(null);

    await expect(
      authService.login({ email: 'ghost@example.com', password: 'password123' }),
    ).rejects.toThrow(UnauthorizedException);
  });
});

