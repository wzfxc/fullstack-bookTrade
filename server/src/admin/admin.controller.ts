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
import { Role } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { PublicUser } from '../users/public-user-select';
import { AdminService } from './admin.service';
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

  @Delete('books/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteBook(
    @Param('id', ParseUUIDPipe) bookId: string,
    @CurrentUser() admin: PublicUser,
  ): Promise<void> {
    return this.adminService.deleteBook(bookId, admin);
  }
}

