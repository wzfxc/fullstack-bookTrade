import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma, Role, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { PublicUser, publicUserSelect } from './public-user-select';

const PASSWORD_SALT_ROUNDS = 10;
const UNIQUE_CONSTRAINT_VIOLATION_CODE = 'P2002';

interface CreateUserData {
  email: string;
  password: string;
  name: string;
  role?: Role;
}

interface UpdateUserProfileData {
  name?: string;
  email?: string;
  avatarUrl?: string | null;
}

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: CreateUserData): Promise<PublicUser> {
    const hashedPassword = await bcrypt.hash(data.password, PASSWORD_SALT_ROUNDS);

    try {
      return await this.prismaService.user.create({
        data: { ...data, password: hashedPassword },
        select: publicUserSelect,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === UNIQUE_CONSTRAINT_VIOLATION_CODE
      ) {
        throw new ConflictException('Email is already registered');
      }
      throw error;
    }
  }

  async updateProfile(userId: string, data: UpdateUserProfileData): Promise<PublicUser> {
    try {
      return await this.prismaService.user.update({
        where: { id: userId },
        data,
        select: publicUserSelect,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === UNIQUE_CONSTRAINT_VIOLATION_CODE
      ) {
        throw new ConflictException('Email is already registered');
      }
      throw error;
    }
  }

  findByEmail(email: string): Promise<User | null> {
    return this.prismaService.user.findUnique({ where: { email } });
  }

  findPublicById(id: string): Promise<PublicUser | null> {
    return this.prismaService.user.findUnique({ where: { id }, select: publicUserSelect });
  }

  findAll(): Promise<PublicUser[]> {
    return this.prismaService.user.findMany({
      select: publicUserSelect,
      orderBy: { email: 'asc' },
    });
  }

  async savePasswordResetToken(userId: string, token: string, expiresAt: Date): Promise<void> {
    await this.prismaService.user.update({
      where: { id: userId },
      data: {
        resetPasswordToken: token,
        resetPasswordExpires: expiresAt,
      },
    });
  }

  findByValidResetToken(token: string): Promise<User | null> {
    return this.prismaService.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { gt: new Date() },
      },
    });
  }

  async resetPassword(userId: string, newPassword: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(newPassword, PASSWORD_SALT_ROUNDS);

    await this.prismaService.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });
  }
}
