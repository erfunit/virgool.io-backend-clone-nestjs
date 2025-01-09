import { Inject, Injectable, Scope } from '@nestjs/common';
import { ProfileDto } from './dto/profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ProfileEntity } from './entities/profile.entity';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  async changeProfile(profileDto: ProfileDto) {
    const { id: userID } = this.request.user;
    const profile = await this.profileRepository.findOneBy({});
  }
}
