import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './../users/users.service';

import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { LogOutDto } from './dto/logout.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActiveToken } from './entities/active-token.entity';
import { BlacklistedToken } from './entities/blacklisted-token.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRepository(ActiveToken)
    private activeTokenRepository: Repository<ActiveToken>,
    @InjectRepository(BlacklistedToken)
    private blacklistTokenRepository: Repository<BlacklistedToken>,
  ) {}

  async logIn({ email, password }: LoginDto) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('email incorrecto');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('pasword is wrong');
    }

    const payload = {
      sub: user.id,
      username: user.fullname,
      email: user.email,
    };
    const access_token = await this.jwtService.signAsync(payload);

    // Guardar el token activo en la base de datos
    const activeToken = this.activeTokenRepository.create({
      email: user.email,
      token: access_token,
    });
    await this.activeTokenRepository.save(activeToken);

    return {
      access_token,
    };
  }

  async logOut(logOutDto: LogOutDto): Promise<any> {
    try {
      // Busca el token activo
      const activeToken = await this.activeTokenRepository.findOne({
        where: { email: logOutDto.email, token: logOutDto.access_token },
      });
      if (!activeToken) {
        throw new UnauthorizedException('Sesión no encontrada.');
      }
      const blacklistedToken = this.blacklistTokenRepository.create({
        token: activeToken.token,
      });
      await this.blacklistTokenRepository.save(blacklistedToken);
      await this.activeTokenRepository.delete(activeToken.id);
      return {
        message: 'Token desactivado correctamente.',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        console.error('Error al desactivar token:', error.message);
        throw error;
      }

      if (error instanceof Error) {
        console.error('Error al desactivar token:', error.message);
        throw new InternalServerErrorException(
          `Error interno al desactivar token. ${error.message}.`,
        );
      }

      // Si no es instancia de Error
      console.error('Error al desactivar token desconocido:', error);
      throw new InternalServerErrorException(
        `Error interno al desactivar token.`,
      );
    }
  }
}
