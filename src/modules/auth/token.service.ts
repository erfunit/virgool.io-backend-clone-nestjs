import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  AccessTokenPayload,
  CookiePayload,
  EmailTokenPayload,
  PhoneTokenPayload,
} from './types/payload.type';
import { AuthMessage, PublicMessage } from 'src/common/enums/message.enums';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  createOtpToken(payload: CookiePayload) {
    const token = this.jwtService.sign(payload, {
      secret: process.env.OTP_TOKEN_SECRET,
      expiresIn: 60 * 2,
      algorithm: 'HS256',
    });

    return token;
  }

  verifyOtpToken(token: string): CookiePayload {
    try {
      return this.jwtService.verify(token, {
        secret: process.env.OTP_TOKEN_SECRET,
      });
    } catch (err: any) {
      console.log(err);
      throw new UnauthorizedException(AuthMessage.TryAgain);
    }
  }

  createAccessToken(payload: AccessTokenPayload) {
    const token = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: '1y',
      algorithm: 'HS256',
    });

    return token;
  }

  verifyAccessToken(token: string): AccessTokenPayload {
    try {
      return this.jwtService.verify(token, {
        secret: process.env.ACCESS_TOKEN_SECRET,
      });
    } catch (err: any) {
      console.log(err);
      throw new UnauthorizedException(AuthMessage.InvalidCredentials);
    }
  }

  createEmailToken(payload: EmailTokenPayload) {
    const token = this.jwtService.sign(payload, {
      secret: process.env.EMAIL_TOKEN_SECRET,
      expiresIn: 2 * 60,
      algorithm: 'HS256',
    });

    return token;
  }

  verifyEmailToken(token: string): EmailTokenPayload {
    try {
      return this.jwtService.verify(token, {
        secret: process.env.EMAIL_TOKEN_SECRET,
      });
    } catch (err: any) {
      console.log(err);
      throw new BadRequestException(PublicMessage.SomethingWentWrong);
    }
  }

  createPhoneToken(payload: PhoneTokenPayload) {
    const token = this.jwtService.sign(payload, {
      secret: process.env.PHONE_TOKEN_SECRET,
      expiresIn: 2 * 60,
      algorithm: 'HS256',
    });

    return token;
  }

  verifyPhoneToken(token: string): PhoneTokenPayload {
    try {
      return this.jwtService.verify(token, {
        secret: process.env.PHONE_TOKEN_SECRET,
      });
    } catch (err: any) {
      console.log(err);
      throw new BadRequestException(PublicMessage.SomethingWentWrong);
    }
  }
}
