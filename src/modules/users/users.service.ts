import { Inject, Injectable, Scope } from '@nestjs/common';
import { ProfileDto } from './dto/profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ProfileEntity } from './entities/profile.entity';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { ProfileFiles } from './types/file.types';
import { PublicMessage } from 'src/common/enums/message.enums';

@Injectable({ scope: Scope.REQUEST })
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  async changeProfile(files: ProfileFiles, profileDto: ProfileDto) {
    console.log(files);

    const { profile_image, bg_image } = files;

    if (profile_image.length !== 0) {
      const [image] = profile_image;
      profileDto.profile_image = image.path;
    }
    if (bg_image.length !== 0) {
      const [image] = bg_image;
      profileDto.bg_image = image.path;
    }

    const { id: userId, profileId, username } = this.request.user;
    let profile = await this.profileRepository.findOneBy({ userId: userId });
    const {
      bio,
      gender,
      nick_name,
      x_profile,
      linkedin_profile,
      birthday,
      profile_image: profile_img,
      bg_image: bg_img,
    } = profileDto;
    if (profile) {
      Object.keys(profileDto).forEach((key) => {
        if (profileDto[key]) profile[key] = profileDto[key];
      });
    } else {
      profile = this.profileRepository.create({
        bio,
        gender,
        nick_name: nick_name || username,
        x_profile,
        linkedin_profile,
        birthday,
        userId,
        bg_image: bg_img,
        profile_image: profile_img,
      });
    }

    await this.profileRepository.save(profile);
    if (!profileId) {
      await this.userRepository.update(
        { id: userId },
        { profileId: profile.id },
      );
    }

    return {
      message: PublicMessage.ProfileSet,
      data: profile,
    };
  }

  getUserWithProfile() {
    return this.userRepository.findOne({
      where: { id: this.request.user.id },
      relations: ['profile'],
    });
  }
}
