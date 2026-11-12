import { BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { MailService } from '../mail/mail.service';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let usersService: {
    create: jest.Mock;
    findByEmail: jest.Mock;
    savePasswordResetToken: jest.Mock;
    findByValidResetToken: jest.Mock;
    resetPassword: jest.Mock;
  };
  let jwtService: { signAsync: jest.Mock };
  let mailService: { sendPasswordResetEmail: jest.Mock };
  let configService: { get: jest.Mock };
  let authService: AuthService;

  beforeEach(() => {
    usersService = {
      create: jest.fn(),
      findByEmail: jest.fn(),
      savePasswordResetToken: jest.fn(),
      findByValidResetToken: jest.fn(),
      resetPassword: jest.fn(),
    };
    jwtService = { signAsync: jest.fn().mockResolvedValue('signed-token') };
    mailService = { sendPasswordResetEmail: jest.fn() };
    configService = { get: jest.fn().mockReturnValue('http://localhost:3000') };
    authService = new AuthService(
      usersService as unknown as UsersService,
      jwtService as unknown as JwtService,
      mailService as unknown as MailService,
      configService as unknown as ConfigService,
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

  it('rejects an unknown email on login', async () => {
    usersService.findByEmail.mockResolvedValue(null);

    await expect(
      authService.login({ email: 'ghost@example.com', password: 'password123' }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('generates a reset token and emails the reset link on forgotPassword', async () => {
    usersService.findByEmail.mockResolvedValue({
      id: 'user-id',
      email: 'user@example.com',
      name: 'Reader',
    });

    await authService.forgotPassword({ email: 'User@Example.COM' });

    expect(usersService.findByEmail).toHaveBeenCalledWith('user@example.com');
    expect(usersService.savePasswordResetToken).toHaveBeenCalledWith(
      'user-id',
      expect.stringMatching(/^[0-9a-f]{64}$/),
      expect.any(Date),
    );
    expect(mailService.sendPasswordResetEmail).toHaveBeenCalledWith({
      recipientEmail: 'user@example.com',
      recipientName: 'Reader',
      resetUrl: expect.stringMatching(/^http:\/\/localhost:3000\/reset-password\?token=[0-9a-f]{64}$/),
    });
  });

  it('throws NotFoundException when forgotPassword email is not registered', async () => {
    usersService.findByEmail.mockResolvedValue(null);

    await expect(authService.forgotPassword({ email: 'ghost@example.com' })).rejects.toThrow(
      NotFoundException,
    );
  });

  it('resets the password when a valid token is provided', async () => {
    usersService.findByValidResetToken.mockResolvedValue({ id: 'user-id' });

    await authService.resetPassword({ token: 'valid-token', newPassword: 'newPassword123' });

    expect(usersService.resetPassword).toHaveBeenCalledWith('user-id', 'newPassword123');
  });

  it('throws BadRequestException when the reset token is invalid or expired', async () => {
    usersService.findByValidResetToken.mockResolvedValue(null);

    await expect(
      authService.resetPassword({ token: 'expired-token', newPassword: 'newPassword123' }),
    ).rejects.toThrow(BadRequestException);
  });
});
