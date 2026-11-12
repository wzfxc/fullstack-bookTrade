import { Module } from '@nestjs/common';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { MyBooksController } from './my-books.controller';

@Module({
  controllers: [BooksController, MyBooksController],
  providers: [BooksService],
  exports: [BooksService],
})
export class BooksModule {}

