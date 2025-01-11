import {
  Body,
  Controller,
  Get,
  ParseFilePipe,
  Patch,
  Post,
  Put,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import {
  ChangeEmailDto,
  ChangePhoneDto,
  ChangeUsernameDto,
  ProfileDto,
} from './dto/profile.dto';
import { SwaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {
  multerDestination,
  multerFileName,
} from 'src/common/utils/multer.util';
import { ProfileFiles } from './types/file.types';
import { Response } from 'express';
import { CookieKeys } from 'src/common/enums/cookie.enum';
import { PublicMessage } from 'src/common/enums/message.enums';
import { CheckDto } from '../auth/dto/auth.dto';
import { RequiredAuth } from 'src/common/decorators/auth.decorator';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Put('/profile')
  @RequiredAuth()
  @ApiConsumes(SwaggerConsumes.MultipartData)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'profile_image', maxCount: 1 },
        { name: 'bg_image', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: multerDestination('user-profile'),
          filename: multerFileName,
        }),
      },
    ),
  )
  changeProfile(
    @UploadedFiles(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [],
      }),
    )
    files: ProfileFiles,
    @Body()
    profileDto: ProfileDto,
  ) {
    return this.usersService.changeProfile(files, profileDto);
  }

  @Get('/profile')
  @RequiredAuth()
  getUserWithProfile() {
    return this.usersService.getUserWithProfile();
  }

  @Patch('/change-email')
  @RequiredAuth()
  @ApiConsumes(SwaggerConsumes.Json, SwaggerConsumes.UrlEncoded)
  async changeEmail(@Body() emailDto: ChangeEmailDto, @Res() res: Response) {
    const { code, token } = await this.usersService.changeEmail(emailDto.email);
    res.cookie(CookieKeys.EmailOtp, token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 2,
    });
    res.json({
      code,
      message: PublicMessage.OTPSent,
    });
  }

  @Post('/verify-email-otp')
  @RequiredAuth()
  @ApiConsumes(SwaggerConsumes.Json, SwaggerConsumes.UrlEncoded)
  async verfiyEmailOtp(@Body() otpDto: CheckDto) {
    return this.usersService.verifyEmail(otpDto.code);
  }

  @Patch('/change-phone')
  @RequiredAuth()
  @ApiConsumes(SwaggerConsumes.Json, SwaggerConsumes.UrlEncoded)
  async changePhone(@Body() phoneDto: ChangePhoneDto, @Res() res: Response) {
    const { code, token } = await this.usersService.changePhone(phoneDto.phone);
    res.cookie(CookieKeys.PhoneOtp, token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 2,
    });
    res.json({
      code,
      message: PublicMessage.OTPSent,
    });
  }

  @Post('/verify-phone-otp')
  @RequiredAuth()
  @ApiConsumes(SwaggerConsumes.Json, SwaggerConsumes.UrlEncoded)
  async verfiyPhoneOtp(@Body() otpDto: CheckDto) {
    return this.usersService.verifyPhone(otpDto.code);
  }

  @Patch('/change-username')
  @RequiredAuth()
  @ApiConsumes(SwaggerConsumes.Json, SwaggerConsumes.UrlEncoded)
  async changeUsername(@Body() usernameDto: ChangeUsernameDto) {
    return this.usersService.changeUsername(usernameDto.username);
  }
}
