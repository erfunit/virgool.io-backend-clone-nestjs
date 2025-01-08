import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Scope,
  UnauthorizedException,
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
import { Request, Response } from 'express';
import { AuthResponse } from './types/response.type';
import { CookieKeys } from 'src/common/enums/cookie.enum';
import { REQUEST } from '@nestjs/core';

@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(OTPEntity)
    private readonly otpRepository: Repository<OTPEntity>,
    private readonly tokenService: TokenService,
    @Inject(REQUEST) private request: Request,
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
      expires: new Date(Date.now() + 1000 * 60 * 2),
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

  async checkOtp(code: string) {
    const token = this.request.cookies?.[CookieKeys.OTP];
    if (!token) throw new UnauthorizedException(AuthMessage.ExpiredCode);
    const payload = this.tokenService.verifyOtpToken(token);
    const otp = await this.otpRepository.findOneBy({
      code,
      userId: payload.userId,
    });
    if (!otp) {
      console.log('no otp code found...');
      throw new UnauthorizedException(AuthMessage.ExpiredCode);
    }
    const now = new Date();
    if (otp.expiresIn < now) {
      console.log('its probably expired');

      throw new UnauthorizedException(AuthMessage.ExpiredCode);
    }
    const user = await this.userRepository.findOneBy({ id: payload.userId });
    const accessToken = this.tokenService.createAccessToken({
      userId: user.id,
    });
    return {
      message: PublicMessage.LogginSuccess,
      data: {
        accessToken,
        user,
      },
    };
  }

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

  async extractAccessToken(token: string) {
    const { userId } = this.tokenService.verifyAccessToken(token);
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new UnauthorizedException(AuthMessage.InvalidCredentials);
    return user;
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
