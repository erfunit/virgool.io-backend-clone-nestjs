import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthType } from './enums/type.enum';
import { AuthMethod } from './enums/method.enum';
import { isEmail, isMobilePhone } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import {
  AuthMessage,
  BadRequesMessage,
  PublicMessage,
  ValidlationMessage,
} from 'src/common/enums/message.enums';
import { OTPEntity } from '../users/entities/otp.entity';
import { randomInt } from 'crypto';
import { TokenService } from './token.service';
import { Response } from 'express';
import { AuthResponse } from './types/response.type';
import { CookieKeys } from 'src/common/enums/cookie.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(OTPEntity)
    private readonly otpRepository: Repository<OTPEntity>,
    private readonly tokenService: TokenService,
  ) {}

  async userExistence(authDto: AuthDto, res: Response) {
    const { method, type, username } = authDto;
    let result: AuthResponse;
    switch (type) {
      case AuthType.Login:
        result = await this.login(method, username);
        break;
      case AuthType.Register:
        result = await this.register(method, username);
        break;
      default:
        throw new BadRequestException();
    }

    const { message, token, code } = result;
    res.cookie(CookieKeys.OTP, token, {
      httpOnly: true,
    });
    return res.json({
      message: message,
      code: code,
    });
  }

  async login(method: AuthMethod, username: string) {
    const validUsername = this.usernameValidator(method, username);
    const user = await this.checkUserExistance(method, validUsername);

    if (!user) {
      throw new BadRequestException(AuthMessage.UserNotFound);
    }

    const otp = await this.saveOtp(user.id);
    await this.userRepository.save(user);
    const token = this.tokenService.createOtpToken({ userId: user.id });
    return {
      message: PublicMessage.OTPSent,
      code: otp.code,
      token,
    };
  }

  async register(method: AuthMethod, username: string) {
    const validUsername = this.usernameValidator(method, username);
    let user = await this.checkUserExistance(method, validUsername);
    if (method === AuthMethod.Username)
      throw new BadRequestException(
        BadRequesMessage.UsernameNotAllowedForRegister,
      );
    if (user) {
      throw new ConflictException(AuthMessage.AlreadyExists);
    }

    user = this.userRepository.create({
      [method]: username,
      username: `m_${randomInt(1, 99999999)}`,
    });

    await this.userRepository.save(user);
    const otp = await this.saveOtp(user.id);
    await this.userRepository.save(user);
    const token = this.tokenService.createOtpToken({ userId: user.id });
    return {
      message: PublicMessage.OTPSent,
      code: otp.code,
      token,
    };
  }

  async checkOtp() {}

  async saveOtp(userId: number) {
    const code = randomInt(10000, 99999).toString();
    const expiresIn = new Date(Date.now() + 1000 * 60 * 2);
    let existsOTP = false;
    let otp = await this.otpRepository.findOneBy({ userId });
    if (otp) {
      existsOTP = true;
      otp.code = code;
      otp.expiresIn = expiresIn;
    } else {
      otp = this.otpRepository.create({
        code,
        expiresIn,
        userId,
      });
    }
    if (!existsOTP)
      await this.userRepository.update({ id: userId }, { otpId: otp.id });
    otp = await this.otpRepository.save(otp);
    // send[SMS, EMAIL] otp code
    return otp;
  }

  usernameValidator(method: AuthMethod, username: string) {
    switch (method) {
      case AuthMethod.Email:
        if (isEmail(username)) return username;
        throw new BadRequestException(ValidlationMessage.InvaliddEmail);
      case AuthMethod.Phone:
        if (isMobilePhone(username, 'fa-IR')) return username;
        throw new BadRequestException(ValidlationMessage.InvalidPhone);

      default:
        return username;
    }
  }

  async checkUserExistance(
    method: AuthMethod,
    username: string,
  ): Promise<UserEntity> {
    let user: UserEntity;
    if (method === AuthMethod.Phone) {
      user = await this.userRepository.findOneBy({
        phone: username,
      });
    } else if (method === AuthMethod.Email) {
      user = await this.userRepository.findOneBy({
        email: username,
      });
    } else if (method === AuthMethod.Username) {
      user = await this.userRepository.findOneBy({
        username,
      });
    } else {
      throw new BadRequestException(ValidlationMessage.InvalidMethod);
    }

    return user;
  }
}
