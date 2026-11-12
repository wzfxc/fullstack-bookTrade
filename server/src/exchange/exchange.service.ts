import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';
import { PublicUser, publicUserSelect } from '../users/public-user-select';

@Injectable()
export class ExchangeService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async requestExchange(bookId: string, requester: PublicUser): Promise<{ message: string }> {
    const requestedBook = await this.prismaService.book.findUnique({
      where: { id: bookId },
      include: { user: { select: publicUserSelect } },
    });

    if (!requestedBook) {
      throw new NotFoundException('Book no longer exists or was deleted');
    }

    if (requestedBook.userId === requester.id) {
      throw new BadRequestException('Cannot request exchange for your own book');
    }

    const requesterBooks = await this.prismaService.book.findMany({
      where: { userId: requester.id },
      orderBy: [{ name: 'asc' }, { id: 'asc' }],
    });

    await this.mailService.sendExchangeRequest({
      requestedBook,
      bookOwner: requestedBook.user,
      requester,
      requesterBooks,
    });

    return { message: 'Exchange request sent' };
  }
}

