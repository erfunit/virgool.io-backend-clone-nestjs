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
  ValidlationMessage,
} from 'src/common/enums/message.enums';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  userExistence(authDto: AuthDto) {
    const { method, type, username } = authDto;

    switch (type) {
      case AuthType.Login:
        return this.login(method, username);
      case AuthType.Register:
        return this.register(method, username);
      default:
        throw new BadRequestException();
    }
  }

  async login(method: AuthMethod, username: string) {
    const validUsername = this.usernameValidator(method, username);
    const user = await this.checkUserExistance(method, validUsername);

    if (!user) {
      throw new BadRequestException(AuthMessage.UserNotFound);
    }
  }

  async register(method: AuthMethod, username: string) {
    const validUsername = this.usernameValidator(method, username);
    const user = await this.checkUserExistance(method, validUsername);

    if (user) {
      throw new ConflictException(AuthMessage.AlreadyExists);
    }
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
