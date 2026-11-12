import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { BooksModule } from './books/books.module';
import { ExchangeModule } from './exchange/exchange.module';
import { MailModule } from './mail/mail.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProfileModule } from './profile/profile.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    MailModule,
    UsersModule,
    AuthModule,
    BooksModule,
    ExchangeModule,
    ProfileModule,
    AdminModule,
  ],
})
export class AppModule {}
