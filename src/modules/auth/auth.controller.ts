import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthDto, CheckDto } from './dto/auth.dto';
import { SwaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import { Request, Response } from 'express';
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/user-existence')
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  async userExistence(@Body() authDto: AuthDto, @Res() res: Response) {
    return await this.authService.userExistence(authDto, res);
  }

  @Post('/check-otp')
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  async checkOtp(@Body() checkDto: CheckDto) {
    return await this.authService.checkOtp(checkDto.code);
  }

  @Get('/check-auth')
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard)
  checkAuth(@Req() req: Request) {
    return {
      message: "You're logged in",
      user: req.user,
    };
  }
}
