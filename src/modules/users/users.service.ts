import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Scope,
} from '@nestjs/common';
import { ProfileDto } from './dto/profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ProfileEntity } from './entities/profile.entity';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { ProfileFiles } from './types/file.types';
import {
  AuthMessage,
  BadRequestMessage,
  ConflictMessage,
  PublicMessage,
} from 'src/common/enums/message.enums';
import { AuthService } from '../auth/auth.service';
import { TokenService } from '../auth/token.service';
import { OTPEntity } from './entities/otp.entity';
import { CookieKeys } from 'src/common/enums/cookie.enum';
import { AuthMethod } from '../auth/enums/method.enum';

@Injectable({ scope: Scope.REQUEST })
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,
    @InjectRepository(OTPEntity)
    private readonly otpRepository: Repository<OTPEntity>,
    @Inject(REQUEST) private readonly request: Request,
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) {}

  async changeProfile(files: ProfileFiles, profileDto: ProfileDto) {
    const { profile_image, bg_image } = files;

    if (profile_image.length !== 0) {
      const [image] = profile_image;
      profileDto.profile_image = image.path.split('/').slice(1).join('/');
    }
    if (bg_image.length !== 0) {
      const [image] = bg_image;
      profileDto.bg_image = image.path.split('/').slice(1).join('/');
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

  async changeEmail(email: string) {
    const { id } = this.request.user;
    email = email.trim().toLowerCase();
    const user = await this.userRepository.findOneBy({ email });
    if (user && user.id !== id)
      throw new ConflictException(ConflictMessage.Email);
    else if (user && user.id === id)
      throw new BadRequestException(
        BadRequestMessage.PreviousEmailCannotReplace,
      );
    await this.userRepository.update({ id }, { new_email: email });
    const otp = await this.authService.saveOtp(id, AuthMethod.Email);
    const token = this.tokenService.createEmailToken({ email });
    return {
      code: otp.code,
      token,
    };
  }

  async verifyEmail(code: string) {
    const { id: userId, new_email } = this.request.user;
    const token = this.request.cookies?.[CookieKeys.EmailOtp];
    if (!token) throw new BadRequestException(AuthMessage.ExpiredCode);
    const { email } = this.tokenService.verifyEmailToken(token);
    if (email !== new_email)
      throw new BadRequestException(PublicMessage.SomethingWentWrong);
    const otp = await this.checkOtp(userId, code);
    if (otp.method !== AuthMethod.Email)
      throw new BadRequestException(PublicMessage.SomethingWentWrong);

    await this.userRepository.update(
      { id: userId },
      { email: email, email_verified: true, new_email: null },
    );

    return {
      message: PublicMessage.EmailUpdated,
    };
  }

  async changePhone(phone: string) {
    const { id } = this.request.user;
    phone = phone.trim().toLowerCase();
    const user = await this.userRepository.findOneBy({ phone });
    if (user && user.id !== id)
      throw new ConflictException(ConflictMessage.Phone);
    else if (user && user.id === id)
      throw new BadRequestException(
        BadRequestMessage.PreviousPhoneCannotReplace,
      );
    await this.userRepository.update({ id }, { new_phone: phone });
    const otp = await this.authService.saveOtp(id, AuthMethod.Phone);
    const token = this.tokenService.createPhoneToken({ phone });
    return {
      code: otp.code,
      token,
    };
  }

  async verifyPhone(code: string) {
    const { id: userId, new_phone } = this.request.user;
    const token = this.request.cookies?.[CookieKeys.PhoneOtp];
    if (!token) throw new BadRequestException(AuthMessage.ExpiredCode);
    const { phone } = this.tokenService.verifyPhoneToken(token);
    if (phone !== new_phone) {
      console.log('phone is not equal to new phone');
      throw new BadRequestException(PublicMessage.SomethingWentWrong);
    }
    const otp = await this.checkOtp(userId, code);
    if (otp.method !== AuthMethod.Phone) {
      console.log('method error');
      throw new BadRequestException(PublicMessage.SomethingWentWrong);
    }

    await this.userRepository.update(
      { id: userId },
      { phone, phone_verified: true, new_phone: null },
    );

    return {
      message: PublicMessage.PhoneUpdated,
    };
  }

  async checkOtp(userId: number, code: string) {
    const otp = await this.otpRepository.findOneBy({ userId });

    if (!otp) throw new BadRequestException(PublicMessage.SomethingWentWrong);
    const now = new Date();
    if (otp.expiresIn < now || otp.code !== code)
      throw new BadRequestException(PublicMessage.SomethingWentWrong);
    return otp;
  }
}
