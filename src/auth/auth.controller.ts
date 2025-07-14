import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Public } from './decorators/public.decorator';
import { LogOutDto } from './dto/logout.dto';

@ApiBearerAuth('JWT-auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión' })
  signIn(
    @Body()
    loginDto: LoginDto,
  ) {
    return this.authService.logIn(loginDto);
  }

  @Get('profile')
  @ApiOperation({ summary: 'Obtener perfil' })
  getProfile(@Req() req) {
    return req.user;
  }

  @Post('logout')
  @ApiOperation({ summary: 'cerrar sesion' })
  logOut(@Body() logOutDto: LogOutDto) {
    return this.authService.logOut(logOutDto);
  }
}
