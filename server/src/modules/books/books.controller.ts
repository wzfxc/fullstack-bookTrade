import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { Book } from '@prisma/client';
import { Public } from '../../common/decorators/public.decorator';
import { BooksService, PaginatedBooks } from './books.service';
import { FindBooksQueryDto } from './dto/find-books-query.dto';

@Public()
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  findAll(@Query() findBooksQueryDto: FindBooksQueryDto): Promise<PaginatedBooks> {
    return this.booksService.findAll(findBooksQueryDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Book> {
    return this.booksService.findOne(id);
  }
}

