import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { Book, Role } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { PublicUser } from '../users/public-user-select';
import { AdminService } from './admin.service';
import { CreateBookByAdminDto } from './dto/create-book-by-admin.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Roles(Role.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  listUsers(): Promise<PublicUser[]> {
    return this.adminService.listUsers();
  }

  @Post('users')
  createUser(@Body() createUserDto: CreateUserDto): Promise<PublicUser> {
    return this.adminService.createUser(createUserDto);
  }

  @Post('users/:userId/books')
  createBookForUser(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() createBookByAdminDto: CreateBookByAdminDto,
  ): Promise<Book> {
    return this.adminService.createBookForUser(userId, createBookByAdminDto);
  }

  @Delete('books/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteBook(
    @Param('id', ParseUUIDPipe) bookId: string,
    @CurrentUser() admin: PublicUser,
  ): Promise<void> {
    return this.adminService.deleteBook(bookId, admin);
  }
}
