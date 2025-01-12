import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { isJWT } from 'class-validator';
import { Request } from 'express';
import { AuthService } from '../auth.service';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const httpContext = context.switchToHttp();
    const request: Request = httpContext.getRequest<Request>();
    const optionalAuth = this.reflector.get<boolean>(
      'optionalAuth',
      context.getHandler(),
    );

    const authorization = request.headers.authorization;

    if (authorization) {
      try {
        const token = this.extractToken(authorization);
        request.user = await this.authService.extractAccessToken(token);
      } catch (error: any) {
        console.log(error);
        if (!optionalAuth) {
          throw new UnauthorizedException('Invalid token');
        }
        request.user = null; // Proceed as unauthenticated if optional
      }
    } else {
      if (!optionalAuth) {
        throw new UnauthorizedException('Token is required');
      }
      request.user = null; // Proceed as unauthenticated if optional
    }

    return true;
  }

  private extractToken(authorization: string): string {
    const [bearer, token] = authorization.split(' ');

    if (bearer?.toLowerCase() !== 'bearer' || !token || !isJWT(token)) {
      throw new UnauthorizedException('Invalid token');
    }

    return token;
  }
}
