import { IsEnum, IsOptional } from 'class-validator';
import { Role } from '@prisma/client';
import { RegisterDto } from '../../auth/dto/register.dto';

export class CreateUserDto extends RegisterDto {
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}

