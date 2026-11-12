import { Module } from '@nestjs/common';
import { BooksModule } from '../books/books.module';
import { UsersModule } from '../users/users.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [UsersModule, BooksModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}

