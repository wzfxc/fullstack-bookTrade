import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Book } from '@prisma/client';
import { createTestAccount, createTransport, getTestMessageUrl, Transporter } from 'nodemailer';
import { PublicUser } from '../users/public-user-select';

interface ExchangeRequestEmail {
  requestedBook: Book;
  bookOwner: Pick<PublicUser, 'name' | 'email'>;
  requester: Pick<PublicUser, 'name' | 'email'>;
  requesterBooks: Book[];
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporterPromise?: Promise<Transporter>;

  constructor(private readonly configService: ConfigService) {}

  async sendExchangeRequest({
    requestedBook,
    bookOwner,
    requester,
    requesterBooks,
  }: ExchangeRequestEmail): Promise<void> {
    try {
      const transporter = await this.getTransporter();
      const info = await transporter.sendMail({
        from: this.configService.getOrThrow<string>('MAIL_FROM'),
        to: bookOwner.email,
        replyTo: requester.email,
        subject: `Exchange request for "${requestedBook.name}"`,
        text: this.buildExchangeRequestText({ requestedBook, bookOwner, requester, requesterBooks }),
      });

      const previewUrl = getTestMessageUrl(info);
      if (previewUrl) {
        this.logger.log(`Exchange email preview: ${previewUrl}`);
      }
    } catch (error) {
      this.transporterPromise = undefined;
      this.logger.error('Failed to send exchange request email', error);
      throw new ServiceUnavailableException('Unable to send the exchange request email');
    }
  }

  private buildExchangeRequestText({
    requestedBook,
    bookOwner,
    requester,
    requesterBooks,
  }: ExchangeRequestEmail): string {
    const offeredBooks = requesterBooks.length
      ? requesterBooks.map((book) => `- ${book.name} by ${book.author}`).join('\n')
      : 'The requester has not added any books yet.';

    return [
      `Hello ${bookOwner.name},`,
      '',
      `${requester.name} (${requester.email}) wants to exchange for your book "${requestedBook.name}" by ${requestedBook.author}.`,
      '',
      `Books offered by ${requester.name}:`,
      offeredBooks,
    ].join('\n');
  }

  private getTransporter(): Promise<Transporter> {
    this.transporterPromise ??= this.createTransporter();
    return this.transporterPromise;
  }

  private async createTransporter(): Promise<Transporter> {
    const configuredUser = this.configService.get<string>('SMTP_USER');
    const configuredPassword = this.configService.get<string>('SMTP_PASSWORD');

    const credentials =
      configuredUser && configuredPassword
        ? { user: configuredUser, pass: configuredPassword }
        : await this.createEtherealCredentials();

    return createTransport({
      host: this.configService.get<string>('SMTP_HOST', 'smtp.ethereal.email'),
      port: Number(this.configService.get('SMTP_PORT', 587)),
      secure: false,
      auth: credentials,
    });
  }

  private async createEtherealCredentials(): Promise<{ user: string; pass: string }> {
    const testAccount = await createTestAccount();
    this.logger.log(`Generated Ethereal account: ${testAccount.user}`);

    return { user: testAccount.user, pass: testAccount.pass };
  }
}

