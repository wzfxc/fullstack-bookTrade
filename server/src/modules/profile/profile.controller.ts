import { Body, Controller, Get, Patch } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PublicUser } from '../users/public-user-select';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileService, UserProfileResponse } from './profile.service';

@Controller('me/profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  getProfile(@CurrentUser() currentUser: PublicUser): Promise<UserProfileResponse> {
    return this.profileService.getProfile(currentUser.id);
  }

  @Patch()
  updateProfile(
    @CurrentUser() currentUser: PublicUser,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<PublicUser> {
    return this.profileService.updateProfile(currentUser.id, updateProfileDto);
  }
}

