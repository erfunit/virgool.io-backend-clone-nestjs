import { Body, Controller, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { ProfileDto } from './dto/profile.dto';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Put('/profile')
  changeProfile(@Body() profileDto: ProfileDto) {
    this.usersService.changeProfile(profileDto);
  }
}
