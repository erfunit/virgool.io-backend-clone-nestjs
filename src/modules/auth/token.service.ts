import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CookiePayload } from './types/payload.type';

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
}
