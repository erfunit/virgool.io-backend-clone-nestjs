import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { isJWT } from 'class-validator';
import { Request } from 'express';
import { AuthMessage } from 'src/common/enums/message.enums';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext) {
    const httpContext = context.switchToHttp();
    const request: Request = httpContext.getRequest<Request>();
    const token = this.extractToken(request);
    request.user = await this.authService.extractAccessToken(token);
    return true;
  }

  protected extractToken(req: Request): string {
    const { authorization } = req.headers;
    if (!authorization || authorization?.trim() === '')
      throw new UnauthorizedException(AuthMessage.InvalidCredentials);

    const [bearer, token] = authorization?.split(' ');

    if (bearer?.toLowerCase() !== 'bearer' || !token || !isJWT(token))
      throw new UnauthorizedException(AuthMessage.InvalidCredentials);

    return token;
  }
}
