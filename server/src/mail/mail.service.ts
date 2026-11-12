import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Book } from '@prisma/client';
import { createTransport, Transporter } from 'nodemailer';
import { PublicUser } from '../users/public-user-select';

export interface ExchangeRequestEmail {
  requestedBook: Book;
  bookOwner: Pick<PublicUser, 'name' | 'email'>;
  requester: Pick<PublicUser, 'name' | 'email'>;
  requesterBooks: Book[];
}

export interface PasswordResetEmail {
  recipientEmail: string;
  recipientName: string;
  resetUrl: string;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter?: Transporter;

  constructor(private readonly configService: ConfigService) {}

  async sendExchangeRequest({
    requestedBook,
    bookOwner,
    requester,
    requesterBooks,
  }: ExchangeRequestEmail): Promise<void> {
    try {
      await this.getTransporter().sendMail({
        from: this.getSenderAddress(),
        to: bookOwner.email,
        replyTo: requester.email,
        subject: `Exchange request for "${requestedBook.name}"`,
        text: this.buildExchangeRequestText({
          requestedBook,
          bookOwner,
          requester,
          requesterBooks,
        }),
      });
    } catch (error) {
      this.logger.error('Failed to send exchange request email', error);
      throw new ServiceUnavailableException('Unable to send the exchange request email');
    }
  }

  async sendPasswordResetEmail({
    recipientEmail,
    recipientName,
    resetUrl,
  }: PasswordResetEmail): Promise<void> {
    try {
      await this.getTransporter().sendMail({
        from: this.getSenderAddress(),
        to: recipientEmail,
        subject: 'Reset your BookTrade password',
        text: [
          `Hello ${recipientName},`,
          '',
          'We received a request to reset your password.',
          `Reset your password using the link below (valid for 1 hour):`,
          resetUrl,
          '',
          'If you did not request a password reset, you can safely ignore this email.',
        ].join('\n'),
      });
    } catch (error) {
      this.logger.error('Failed to send password reset email', error);
      throw new ServiceUnavailableException('Unable to send the password reset email');
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
      `Requester Name: ${requester.name}`,
      `Requester Email: ${requester.email}`,
      '',
      `${requester.name} (${requester.email}) wants to exchange for your book "${requestedBook.name}" by ${requestedBook.author}.`,
      '',
      `Books offered by ${requester.name}:`,
      offeredBooks,
    ].join('\n');
  }

  private getSenderAddress(): string {
    return (
      this.configService.get<string>('MAIL_FROM') ??
      this.configService.getOrThrow<string>('SMTP_USER')
    );
  }

  private getTransporter(): Transporter {
    if (!this.transporter) {
      const port = Number(this.configService.get<string>('SMTP_PORT', '587'));

      this.transporter = createTransport({
        host: this.configService.get<string>('SMTP_HOST', 'smtp.gmail.com'),
        port,
        secure: port === 465,
        auth: {
          user: this.configService.getOrThrow<string>('SMTP_USER'),
          pass: this.configService.getOrThrow<string>('SMTP_PASSWORD'),
        },
      });
    }

    return this.transporter;
  }
}
