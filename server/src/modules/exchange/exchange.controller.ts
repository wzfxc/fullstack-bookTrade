import { Controller, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PublicUser } from '../users/public-user-select';
import { ExchangeService } from './exchange.service';

@Controller('books')
export class ExchangeController {
  constructor(private readonly exchangeService: ExchangeService) {}

  @Post(':id/exchange')
  @HttpCode(HttpStatus.OK)
  requestExchange(
    @Param('id', ParseUUIDPipe) bookId: string,
    @CurrentUser() requester: PublicUser,
  ): Promise<{ message: string }> {
    return this.exchangeService.requestExchange(bookId, requester);
  }
}

