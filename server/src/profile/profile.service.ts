import { Injectable, NotFoundException } from '@nestjs/common';
import { Book } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PublicUser, publicUserSelect } from '../users/public-user-select';
import { UsersService } from '../users/users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

export interface IncomingExchangeRequest {
  id: string;
  requesterId: string;
  ownerId: string;
  bookId: string;
  createdAt: Date;
  requester: PublicUser;
  book: Book;
}

export interface UserProfileResponse extends PublicUser {
  booksCount: number;
  incomingRequests: IncomingExchangeRequest[];
}

@Injectable()
export class ProfileService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  async getProfile(userId: string): Promise<UserProfileResponse> {
    const [user, booksCount, incomingRequests] = await this.prismaService.$transaction([
      this.prismaService.user.findUnique({
        where: { id: userId },
        select: publicUserSelect,
      }),
      this.prismaService.book.count({ where: { userId } }),
      this.prismaService.exchangeRequest.findMany({
        where: { ownerId: userId },
        include: {
          requester: { select: publicUserSelect },
          book: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      ...user,
      booksCount,
      incomingRequests,
    };
  }

  updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<PublicUser> {
    const normalizedEmail = updateProfileDto.email?.toLowerCase();

    return this.usersService.updateProfile(userId, {
      ...updateProfileDto,
      ...(normalizedEmail !== undefined ? { email: normalizedEmail } : {}),
    });
  }
}

