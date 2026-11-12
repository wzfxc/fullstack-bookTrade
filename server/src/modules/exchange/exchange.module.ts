import { Module } from '@nestjs/common';
import { MailModule } from '../../infra/mail/mail.module';
import { ExchangeController } from './exchange.controller';
import { ExchangeService } from './exchange.service';

@Module({
  imports: [MailModule],
  controllers: [ExchangeController],
  providers: [ExchangeService],
})
export class ExchangeModule {}

