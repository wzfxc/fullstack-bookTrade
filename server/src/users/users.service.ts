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
}

